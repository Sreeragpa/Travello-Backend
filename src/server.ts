import app from "./frameworks/configs/app";
import connectDb from "./frameworks/configs/db";
import {createServer} from "http"
import initializeSocketIO from "./frameworks/configs/socketio";


// Connect Database
connectDb();

// Create HTTP server and attach Express app to it
const server = createServer(app);

// Initialize Socket.IO server
export const io = initializeSocketIO(server);
// const notificationRepository = new NotificationRepository();
// export const notificationUsecase = new NotificationUsecase(notificationRepository, io, userSocketMap);

// Start Server
const PORT = process.env.PORT || 9000;
server.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})

