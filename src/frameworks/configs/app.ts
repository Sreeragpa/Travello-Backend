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


// Initialize Express application
 const app: Express = express();

// Load environment variables from .env file 
dotenv.config();

// Parse incoming JSON requests with a maximum size of 50mb
app.use(express.json({ limit: '50mb' }));

// Parse incoming URL-encoded form data
app.use(express.urlencoded({ extended: false }));

// Enable CORS 
app.use(cors({
    origin: 'http://localhost:4200', // Allow requests from Angular application
    // origin: 'http://10.4.4.139:4200', // Allow requests from Angular application

    credentials: true // Include credentials (cookies) in cross-origin requests
  }));

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
app.use('/api/user', userRouter)

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