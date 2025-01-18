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
const jwt_utils_1 = require("../utils/jwt.utils");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.userSocketMap = {};
function setupSocketHandlers(io) {
    io.on("connection", (socket) => {
        var _a;
        console.log("A user connected");
        const token = socket.handshake.auth.token;
        const decoded = (0, jwt_utils_1.verifyJWT)(token);
        socket.data.user = decoded;
        const user = (_a = socket === null || socket === void 0 ? void 0 : socket.data) === null || _a === void 0 ? void 0 : _a.user;
        console.log(user, "User from Socket");
        exports.userSocketMap[user.user_id] = socket.id;
        const userId = socket.data.user.id;
        socket.join(userId);
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
            socket.join(conversationId);
            console.log(`User ${socket.id} joined conversation ${conversationId}`);
        });
        socket.on("disconnect", () => {
            console.log("user disconnected");
            delete exports.userSocketMap[user.user_id];
        });
    });
    return io;
}
exports.default = setupSocketHandlers;
