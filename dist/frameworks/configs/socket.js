"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSocketIO = setSocketIO;
exports.getSocketIO = getSocketIO;
let io = null;
function setSocketIO(server) {
    io = server;
}
function getSocketIO() {
    return io;
}
