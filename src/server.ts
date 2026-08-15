import app from "./frameworks/configs/app";
import connectDb from "./frameworks/configs/db";
import { connectQdrant } from "./frameworks/configs/qdrant";
import {createServer} from "http"
import initializeSocketIO from "./frameworks/configs/socketio";
import { setSocketIO } from "./frameworks/configs/socket";


// Connect Database
connectDb();
connectQdrant();

// Create HTTP server and attach Express app to it so Socket.IO can hook into the same listener
const server = createServer(app);

// Initialize Socket.IO server
export const io = initializeSocketIO(server);
setSocketIO(io);
// const notificationRepository = new NotificationRepository();
// export const notificationUsecase = new NotificationUsecase(notificationRepository, io, userSocketMap);

// Start Server
const PORT = process.env.PORT || 9000;

if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default server;
