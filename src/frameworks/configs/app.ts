import express, { NextFunction, Request, Response, application } from "express"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet";
import errorHandler from "../middlewares/errorHandler";
import authRouter from "../routes/auth.route"
import cookieParser from "cookie-parser";


// Initialize Express application
 const app = express();

// Load environment variables from .env file 
dotenv.config();

// Parse incoming JSON requests with a maximum size of 50mb
app.use(express.json({ limit: '50mb' }));

// Parse incoming URL-encoded form data
app.use(express.urlencoded({ extended: false }));

// Enable CORS 
app.use(cors());

// Cookie-Parser
app.use(cookieParser())

// Apply Helmet middleware to secure your Express app with various HTTP headers
app.use(helmet());


// Auth routes
app.use('/api/auth', authRouter);  

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