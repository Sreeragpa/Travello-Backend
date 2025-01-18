"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const errorHandler_1 = __importDefault(require("../middlewares/errorHandler"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_route_1 = __importDefault(require("../routes/auth.route"));
const post_route_1 = __importDefault(require("../routes/post.route"));
const follow_route_1 = __importDefault(require("../routes/follow.route"));
const user_route_1 = __importDefault(require("../routes/user.route"));
const comment_route_1 = __importDefault(require("../routes/comment.route"));
const trip_route_1 = __importDefault(require("../routes/trip.route"));
const notification_route_1 = __importDefault(require("../routes/notification.route"));
const conversation_route_1 = __importDefault(require("../routes/conversation.route"));
const message_route_1 = __importDefault(require("../routes/message.route"));
const admin_route_1 = __importDefault(require("../routes/admin.route"));
// Initialize Express application
const app = (0, express_1.default)();
// Load environment variables from .env file 
dotenv_1.default.config();
// Parse incoming JSON requests with a maximum size of 50mb
app.use(express_1.default.json({ limit: '50mb' }));
// Parse incoming URL-encoded form data
app.use(express_1.default.urlencoded({ extended: false }));
const allowedOrigins = [
    'http://localhost:4200', // Allow requests from Angular application on localhost
    'https://travello.srg.buzz',
    'http://travello.srg.buzz',
    'https://travello.srgweb.site',
];
// Enable CORS 
app.use((0, cors_1.default)({
    // origin: 'http://localhost:4200', // Allow requests from Angular application
    origin: allowedOrigins, // Allow requests from Angular application
    optionsSuccessStatus: 200,
    credentials: true // Include credentials (cookies) in cross-origin requests
}));
// Cookie-Parser
app.use((0, cookie_parser_1.default)());
// Apply Helmet middleware to secure your Express app with various HTTP headers
app.use((0, helmet_1.default)());
// Auth routes
app.use('/api/auth', auth_route_1.default);
// post routes
app.use('/api/posts', post_route_1.default);
// follow routes
app.use('/api/follow', follow_route_1.default);
//  User Routes
app.use('/api/user', user_route_1.default);
// Comment Rooutes
app.use('/api/comment', comment_route_1.default);
// Trip Routes
app.use('/api/trip', trip_route_1.default);
// Notification Routes
app.use('/api/notification', notification_route_1.default);
// Conversation Routes
app.use('/api/conversation', conversation_route_1.default);
// Message Routes
app.use('/api/message', message_route_1.default);
// Admin Routes
app.use('/api/admin', admin_route_1.default);
// Unknown Route
app.all("*", (req, res, next) => {
    const error = new Error(`Route not found`);
    error.statusCode = 404;
    console.log(error);
    next(error);
});
// Error Handling Middleware 
app.use(errorHandler_1.default);
exports.default = app;
