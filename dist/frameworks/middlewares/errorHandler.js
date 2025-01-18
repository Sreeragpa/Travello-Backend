"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    // Customize error response based on error type and environment
    // (production vs development)
    let errorMessage = 'Internal Server Error'; // Default message
    if (process.env.NODE_ENV === 'development') {
        errorMessage = err.message; // Provide more details in development
    }
    res.status(err.statusCode || 500).json({ message: errorMessage });
};
exports.default = errorHandler;
