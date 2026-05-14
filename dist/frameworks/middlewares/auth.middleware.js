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
        const refreshToken = req.cookies.refreshToken;
        if (!authToken && !refreshToken) {
            return res
                .status(401)
                .json({ message: "Unauthorized: No tokens provided" });
        }
        let userData = null;
        if (authToken) {
            // Attempt to verify the access token
            userData = (0, jwt_utils_1.verifyJWT)(authToken);
        }
        console.log("heyegywugewyrug", userData);
        // If access token is invalid, use the refresh token
        if (!userData && refreshToken) {
            const refreshTokenData = yield (0, jwt_utils_1.verifyJWT)(refreshToken);
            if (!refreshTokenData) {
                return res
                    .status(401)
                    .json({ message: "Unauthorized: Invalid refresh token" });
            }
            userData = refreshTokenData;
            // Issue a new access token
            const payload = {
                id: userData.id,
                email: userData.email,
                user_id: userData.user_id,
            };
            const token = (0, jwt_utils_1.signJWT)(payload, 15);
            // Send new tokens to the client
            res.cookie("authToken", token.accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 15 * 60 * 1000 // 15 minutes
            });
            res.cookie("refreshToken", token.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expires in 7 days
            });
        }
        // If no valid token is found, return unauthorized
        if (!userData) {
            return res
                .status(401)
                .json({ message: "Unauthorized: Token verification failed" });
        }
        let user = yield user_model_1.UserModel.findById(userData === null || userData === void 0 ? void 0 : userData.user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check if the user is blocked
        if (user.isBlocked) {
            return res.status(403).json({ message: "User is blocked" });
        }
        req.user = userData; // Attach user data to the request object
        next();
    }
    catch (error) {
        return res.status(500).json({ message: "JWT Verification Error" });
    }
});
exports.authMiddleware = authMiddleware;
