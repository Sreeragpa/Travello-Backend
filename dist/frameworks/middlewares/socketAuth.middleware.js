"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function socketAuthMiddleware(socket, next) {
    const token = socket.handshake.auth.token;
    console.log(token, "From socket io");
    console.log(socket.handshake, "From socket handshake");
    // if (!token) {
    //   const error = new Error("Authentication error");
    //   return next(error);
    // }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        socket.data.user = decoded; // Attach the decoded user data to the socket object
        next();
    }
    catch (err) {
        const error = new Error("Authentication error");
        return next(error);
    }
}
exports.socketAuthMiddleware = socketAuthMiddleware;
