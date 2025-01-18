"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_utils_1 = require("../utils/jwt.utils");
const user_model_1 = require("../models/user.model");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authToken = req.cookies.authToken;
        if (!authToken) {
            return res.sendStatus(401);
        }
        // const token = authHeader.split(' ')[1];
        const userData = (0, jwt_utils_1.verifyJWT)(authToken);
        if (!userData) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Fetch the user from the database
        const user = yield user_model_1.UserModel.findById(userData.user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if the user is blocked
        if (user.isBlocked) {
            return res.status(403).json({ message: 'User is blocked' });
        }
        req.user = userData; // Attach user data to the request object
        next();
    }
    catch (error) {
        return res.status(500).json({ message: 'JWT Verification Error' });
    }
});
exports.authMiddleware = authMiddleware;
