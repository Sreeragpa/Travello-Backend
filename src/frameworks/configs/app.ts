import express, { NextFunction, Request, Response, application, Express } from "express"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet";
import errorHandler from "../middlewares/errorHandler";
import cookieParser from "cookie-parser";

import authRouter from "../routes/auth.route"
import postRouter from '../routes/post.route'
import followRouter from "../routes/follow.route"
import userRouter from "../routes/user.route"
import commentRouter from "../routes/comment.route"
import tripRouter from "../routes/trip.route"
import notificationRouter from "../routes/notification.route"
import conversationRouter from "../routes/conversation.route"
import messageRouter from "../routes/message.route"
import adminRouter from "../routes/admin.route"


// Initialize Express application
 const app: Express = express();

// Load environment variables from .env file 
dotenv.config();

// Parse incoming JSON requests with a maximum size of 50mb
app.use(express.json({ limit: '50mb' }));

// Parse incoming URL-encoded form data
app.use(express.urlencoded({ extended: false }));
const allowedOrigins = [
  'http://localhost:4200', // Allow requests from Angular application on localhost
  'https://travello.srg.buzz',
  'http://travello.srg.buzz'
];
// const corsOptions = {
//   origin: function (origin:any, callback:any) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   optionsSuccessStatus: 200, // Some legacy browsers choke on 204
//   credentials: true // Include credentials (cookies) in cross-origin requests
// };
const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

// Enable CORS 
app.use(cors(corsOptions));

// Cookie-Parser
app.use(cookieParser())

// Apply Helmet middleware to secure your Express app with various HTTP headers
app.use(helmet());


// Auth routes
app.use('/api/auth', authRouter);  
// post routes
app.use('/api/posts', postRouter);  
// follow routes
app.use('/api/follow', followRouter);  
//  User Routes
app.use('/api/user', userRouter);
// Comment Rooutes
app.use('/api/comment', commentRouter);
// Trip Routes
app.use('/api/trip', tripRouter);
// Notification Routes
app.use('/api/notification', notificationRouter);
// Conversation Routes
app.use('/api/conversation', conversationRouter);
// Message Routes
app.use('/api/message', messageRouter);
// Admin Routes
app.use('/api/admin', adminRouter);

// Unknown Route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Route not found`) as any;
    error.statusCode = 404;
    console.log(error);
    next(error);
});

// Error Handling Middleware 
app.use(errorHandler);


export default app