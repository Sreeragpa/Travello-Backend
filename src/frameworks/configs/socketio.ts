import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import setupSocketHandlers from "./socketioHandlers";

export default function initializeSocketIO(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:4200',
        'http://10.4.4.139:4200',
        'http://10.4.5.201:4200',
        'http://192.168.18.167:4200',
        'http://10.4.3.148:4200'
        
      ],
      methods: ["GET", "POST"],
      credentials: true
    }
  });
  setupSocketHandlers(io);

  return io;
}
