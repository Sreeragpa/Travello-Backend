"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSocketMap = void 0;
exports.default = setupSocketHandlers;
const jwt_utils_1 = require("../utils/jwt.utils");
const dotenv_1 = __importDefault(require("dotenv"));
const conversation_repository_1 = require("../../repository/conversation.repository");
const redis_1 = require("./redis");
dotenv_1.default.config();
exports.userSocketMap = {};
const conversationRepository = new conversation_repository_1.ConversationRepository();
function emitConversationPresence(io, conversationId, actorUserId, isActive) {
    return __awaiter(this, void 0, void 0, function* () {
        const conversation = yield conversationRepository.findById(conversationId);
        if (!(conversation === null || conversation === void 0 ? void 0 : conversation.members)) {
            return;
        }
        const participantIds = conversation.members
            .map((memberId) => String(memberId))
            .filter((memberId) => memberId !== actorUserId);
        participantIds.forEach((participantId) => {
            const socketId = exports.userSocketMap[participantId];
            if (socketId) {
                io.to(socketId).emit("conversationParticipantStatus", {
                    conversationId,
                    userId: actorUserId,
                    isActive,
                });
            }
        });
    });
}
function clearUserPresence(socket, io, userId, reason) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userId) {
            return;
        }
        const joinedConversations = socket.data.joinedConversations;
        if (joinedConversations && joinedConversations.size > 0) {
            for (const conversationId of joinedConversations) {
                yield emitConversationPresence(io, conversationId, userId, false);
            }
            joinedConversations.clear();
        }
        delete exports.userSocketMap[userId];
        yield (0, redis_1.markUserOffline)(userId);
        console.log(`User ${userId} marked offline via ${reason}`);
    });
}
function setupSocketHandlers(io) {
    io.on("connection", (socket) => {
        var _a, _b, _c;
        console.log("A user connected");
        let presenceHeartbeat = null;
        const token = socket.handshake.auth.token;
        try {
            const decoded = (0, jwt_utils_1.verifyJWT)(token);
            socket.data.user = decoded;
        }
        catch (error) {
            console.log("Invalid socket token");
            socket.disconnect(true);
            return;
        }
        const user = (_a = socket === null || socket === void 0 ? void 0 : socket.data) === null || _a === void 0 ? void 0 : _a.user;
        console.log(user, "User from Socket");
        const userId = ((_b = socket.data.user) === null || _b === void 0 ? void 0 : _b.user_id) || ((_c = socket.data.user) === null || _c === void 0 ? void 0 : _c.id);
        if (userId) {
            exports.userSocketMap[userId] = socket.id;
            socket.join(userId);
            socket.data.joinedConversations = new Set();
            void (0, redis_1.markUserOnline)(userId);
            presenceHeartbeat = setInterval(() => {
                void (0, redis_1.refreshUserPresence)(userId);
            }, 25000);
            socket.data.presenceHeartbeat = presenceHeartbeat;
        }
        // Handle socket events
        socket.on("unfollow", (data) => __awaiter(this, void 0, void 0, function* () {
            console.log("unfollow event received with data:", data);
            try {
                socket.emit("unfollowResponse", { success: true, data: "result" });
            }
            catch (error) {
                socket.emit("unfollowResponse", { success: false, error: error });
            }
        }));
        socket.on('joinConversation', (conversationId) => {
            var _a;
            socket.join(conversationId);
            console.log(`User ${socket.id} joined conversation ${conversationId}`);
            if (userId) {
                (_a = socket.data.joinedConversations) === null || _a === void 0 ? void 0 : _a.add(conversationId);
                void emitConversationPresence(io, conversationId, userId, true);
            }
        });
        socket.on('leaveConversation', (conversationId) => {
            var _a;
            socket.leave(conversationId);
            console.log(`User ${socket.id} left conversation ${conversationId}`);
            if (userId) {
                (_a = socket.data.joinedConversations) === null || _a === void 0 ? void 0 : _a.delete(conversationId);
                void emitConversationPresence(io, conversationId, userId, false);
            }
        });
        socket.on("logout", () => __awaiter(this, void 0, void 0, function* () {
            yield clearUserPresence(socket, io, userId, "logout");
            socket.disconnect(true);
        }));
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
