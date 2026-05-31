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
exports.AuthController = void 0;
const server_1 = require("../server");
const redis_1 = require("../frameworks/configs/redis");
class AuthController {
    constructor(authUsecase) {
        this.authUsecase = authUsecase;
    }
    signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                console.log(body);
                const data = yield this.authUsecase.userSignup(body);
                res.status(200).json({ status: 'success', data: data });
            }
            catch (error) {
                next(error);
            }
        });
    }
    verifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                if (!(body === null || body === void 0 ? void 0 : body.email) || !(body === null || body === void 0 ? void 0 : body.otp)) {
                    throw new Error("Missing Data (email or OTP");
                }
                const data = yield this.authUsecase.verifyOtp(body.email, body.otp);
                res.status(200).json({ status: 'success', data: data });
            }
            catch (error) {
                next(error);
            }
        });
    }
    signin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                if (!(body === null || body === void 0 ? void 0 : body.email) || !(body === null || body === void 0 ? void 0 : body.password)) {
                    throw new Error("Missing Data (email or password");
                }
                const token = yield this.authUsecase.userSignin(body);
                // Auth before Refresh Token
                // res.cookie('authToken', token, {
                //     httpOnly: true,
                //     secure: true,  // Use true if you're serving over HTTPS
                //     sameSite: 'strict'  // Allows cross-site cookie usage
                //   });
                res.cookie('authToken', token.accessToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    maxAge: 15 * 60 * 1000 // 15 minutes
                });
                res.cookie('refreshToken', token.refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });
                res.status(200).json({ status: 'success', data: token.accessToken });
            }
            catch (error) {
                next(error);
            }
        });
    }
    googleSignin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("IN Google AUth Controller");
                const { idToken } = req.body;
                if (!idToken) {
                    throw new Error("Missing Token");
                }
                const token = yield this.authUsecase.userSigninGoogle(idToken);
                // res.cookie('authToken', token, { httpOnly: true });
                // res.cookie('authToken', token, {
                //     httpOnly: true,
                //     secure: true,  // Use true if you're serving over HTTPS
                //     sameSite: 'strict'  // Allows cross-site cookie usage
                //   });
                res.cookie('authToken', token.accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 15 * 60 * 1000 // 15 minutes
                });
                res.cookie('refreshToken', token.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });
                res.status(200).json({ status: 'success', data: token.accessToken });
            }
            catch (error) {
                next(error);
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const data = yield this.authUsecase.resetPassword(email);
                res.status(200).json({ status: 'success', data: data });
            }
            catch (error) {
                next(error);
            }
        });
    }
    verifyresetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp, newpassword } = req.body;
                const data = yield this.authUsecase.verifyResetPassword(email, otp, newpassword);
                res.status(200).json({ status: 'success', data: data });
            }
            catch (error) {
                next(error);
            }
        });
    }
    checkAuthenticated(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("authenticated");
                res.status(200).json({ status: 'authenticated' });
            }
            catch (error) {
                next(error);
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
                const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.user_id;
                yield this.authUsecase.logoutUser(refreshToken);
                if (userId) {
                    yield (0, redis_1.forceUserOffline)(userId);
                    server_1.io.in(userId).disconnectSockets(true);
                }
                const cookieOptions = {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                };
                res.clearCookie("authToken", cookieOptions);
                res.clearCookie("refreshToken", cookieOptions);
                res.status(200).json({ status: "success", data: "Logged out successfully" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies.authToken;
            if (!token) {
                return res.status(401).json({ message: 'Token not found' });
            }
            res.status(200).json({ status: "success", data: token });
        });
    }
}
exports.AuthController = AuthController;
