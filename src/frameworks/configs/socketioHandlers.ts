import { Server, Socket } from "socket.io";
import { FollowRepository } from "../../repository/follow.repository";
import { FollowUsecase } from "../../usecase/follow.usecase";
import { FollowController } from "../../controllers/follow.controller";
import { NotificationRepository } from "../../repository/notification.repository";
import { NotificationUsecase } from "../../usecase/notification.usecase";
import { socketAuthMiddleware } from "../middlewares/socketAuth.middleware";
import { verifyJWT } from '../utils/jwt.utils';
import { IJwtPayload } from '../../interfaces/usecase/IUser.usecase';
import dotenv from "dotenv";
import { io } from "../../server";
import { NOTIFICATION_TYPE } from "../../enums/notification.enums";
import { INotification } from "../../entities/notification.entity";

dotenv.config();


export const userSocketMap: { [userId: string]: string } = {};

export default function setupSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected");


    const token = socket.handshake.auth.token;

    const decoded = verifyJWT(token);
    socket.data.user = decoded as IJwtPayload;

    const user = socket?.data?.user ;
    console.log(user, "User from Socket");

    userSocketMap[user.user_id] = socket.id;
    const userId = socket.data.user.id;
    
    socket.join(userId);


    // Handle socket events




    socket.on("unfollow", async (data) => {

      console.log("unfollow event received with data:", data);
      try {
        const { followingid } = data;
        const followerid = user.user_id;
        // const result = await followUsecase.unfollow(followerid, followingid);
        socket.emit("unfollowResponse", { success: true, data: "result" });
      } catch (error) {
        socket.emit("unfollowResponse", { success: false, error: error });
      }
    });

    socket.on('test',async(data)=>{
      console.log(data,"data from test socket");
      
    })
    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${socket.id} joined conversation ${conversationId}`);
    });
  

    socket.on("disconnect", () => {
      console.log("user disconnected");
      delete userSocketMap[user.user_id];
    });
  });

  return io;
}

