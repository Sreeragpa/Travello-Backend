import { Server } from "socket.io";

let io: Server | null = null;

export function setSocketIO(server: Server) {
  io = server;
}

export function getSocketIO() {
  return io;
}
