import { Server, Socket } from "socket.io";
import { FollowRepository } from "../../repository/follow.repository";
import { FollowUsecase } from "../../usecase/follow.usecase";
import { FollowController } from "../../controllers/follow.controller";
import { NotificationRepository } from "../../repository/notification.repository";
import { NotificationUsecase } from "../../usecase/notification.usecase";
import { verifyJWT } from '../utils/jwt.utils';
import { IJwtPayload } from '../../interfaces/usecase/IUser.usecase';
import dotenv from "dotenv";
import { io } from "../../server";
import { NOTIFICATION_TYPE } from "../../enums/notification.enums";
import { INotification } from "../../entities/notification.entity";
import { ConversationRepository } from "../../repository/conversation.repository";
import { markUserOffline, markUserOnline, refreshUserPresence } from "./redis";

dotenv.config();


export const userSocketMap: { [userId: string]: string } = {};
const conversationRepository = new ConversationRepository();

async function emitConversationPresence(
  io: Server,
  conversationId: string,
  actorUserId: string,
  isActive: boolean
) {
  const conversation = await conversationRepository.findById(conversationId);
  if (!conversation?.members) {
    return;
  }

  const participantIds = conversation.members
    .map((memberId) => String(memberId))
    .filter((memberId) => memberId !== actorUserId);

  participantIds.forEach((participantId) => {
    const socketId = userSocketMap[participantId];
    if (socketId) {
      io.to(socketId).emit("conversationParticipantStatus", {
        conversationId,
        userId: actorUserId,
        isActive,
      });
    }
  });
}

async function clearUserPresence(
  socket: Socket,
  io: Server,
  userId: string | undefined,
  reason: "disconnect" | "logout"
) {
  if (!userId) {
    return;
  }

  const joinedConversations = socket.data.joinedConversations as Set<string> | undefined;
  if (joinedConversations && joinedConversations.size > 0) {
    for (const conversationId of joinedConversations) {
      await emitConversationPresence(io, conversationId, userId, false);
    }
    joinedConversations.clear();
  }

  delete userSocketMap[userId];
  await markUserOffline(userId);

  console.log(`User ${userId} marked offline via ${reason}`);
}

export default function setupSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected");

    let presenceHeartbeat: NodeJS.Timeout | null = null;
    const token = socket.handshake.auth.token;

    try {
      const decoded = verifyJWT(token);
      socket.data.user = decoded as IJwtPayload;
    } catch (error) {
      console.log("Invalid socket token");
      socket.disconnect(true);
      return;
    }

    const user = socket?.data?.user as any;
    console.log(user, "User from Socket");

    const userId = socket.data.user?.user_id || socket.data.user?.id;
    if (userId) {
      userSocketMap[userId] = socket.id;
      socket.join(userId);
      socket.data.joinedConversations = new Set<string>();

      void markUserOnline(userId);
      presenceHeartbeat = setInterval(() => {
        void refreshUserPresence(userId);
      }, 25000);
      socket.data.presenceHeartbeat = presenceHeartbeat;
    }
    


    // Handle socket events




    socket.on("unfollow", async (data) => {

      console.log("unfollow event received with data:", data);
      try {
        socket.emit("unfollowResponse", { success: true, data: "result" });
      } catch (error) {
        socket.emit("unfollowResponse", { success: false, error: error });
      }
    });

    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${socket.id} joined conversation ${conversationId}`);
      if (userId) {
        socket.data.joinedConversations?.add(conversationId);
        void emitConversationPresence(io, conversationId, userId, true);
      }
    });

    socket.on('leaveConversation', (conversationId) => {
      socket.leave(conversationId);
      console.log(`User ${socket.id} left conversation ${conversationId}`);
      if (userId) {
        socket.data.joinedConversations?.delete(conversationId);
        void emitConversationPresence(io, conversationId, userId, false);
      }
    });

    socket.on("logout", async () => {
      await clearUserPresence(socket, io, userId, "logout");
      socket.disconnect(true);
    });
  

    socket.on("disconnect", () => {
      console.log("user disconnected");
      if (presenceHeartbeat) {
        clearInterval(presenceHeartbeat);
      }
      if (userId) {
        void clearUserPresence(socket, io, userId, "disconnect");
      }
    });
  });

  return io;
}
