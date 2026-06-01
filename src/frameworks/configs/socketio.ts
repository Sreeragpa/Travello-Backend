import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import setupSocketHandlers from "./socketioHandlers";

export default function initializeSocketIO(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:4200',
        'https://travello-sigma.vercel.app',
        'https://travello.sreerag.site',
      ],
      methods: ["GET", "POST"],
      credentials: true
    }
  });
  setupSocketHandlers(io);

  return io;
}
