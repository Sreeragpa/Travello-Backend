"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const socketioHandlers_1 = __importDefault(require("./socketioHandlers"));
function initializeSocketIO(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: [
                'http://localhost:4200',
                'https://travello.srg.buzz',
                'http://travello.srg.buzz',
                'https://travello.srgweb.site',
            ],
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    (0, socketioHandlers_1.default)(io);
    return io;
}
exports.default = initializeSocketIO;
