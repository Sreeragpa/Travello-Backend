import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import setupSocketHandlers from "./socketioHandlers";

export default function initializeSocketIO(server: HttpServer) {
  const io = new Server(server, {
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
  setupSocketHandlers(io);

  return io;
}
