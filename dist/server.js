"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const app_1 = __importDefault(require("./frameworks/configs/app"));
const db_1 = __importDefault(require("./frameworks/configs/db"));
const http_1 = require("http");
const socketio_1 = __importDefault(require("./frameworks/configs/socketio"));
// Connect Database
(0, db_1.default)();
// Create HTTP server and attach Express app to it
const server = (0, http_1.createServer)(app_1.default);
// Initialize Socket.IO server
exports.io = (0, socketio_1.default)(server);
// const notificationRepository = new NotificationRepository();
// export const notificationUsecase = new NotificationUsecase(notificationRepository, io, userSocketMap);
// Start Server
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
