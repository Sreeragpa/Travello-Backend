"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../../controllers/auth.controller");
const auth_usecase_1 = require("../../usecase/auth.usecase");
const auth_repository_1 = require("../../repository/auth.repository");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
const authRepository = new auth_repository_1.AuthRepository();
const authUsecase = new auth_usecase_1.AuthUsecase(authRepository);
const authController = new auth_controller_1.AuthController(authUsecase);
// main route /api/auth
router.post('/signup', (req, res, next) => {
    authController.signup(req, res, next);
});
router.post('/verify-otp', (req, res, next) => {
    authController.verifyOtp(req, res, next);
});
router.post('/signin', (req, res, next) => {
    authController.signin(req, res, next);
});
router.post('/google', (req, res, next) => {
    authController.googleSignin(req, res, next);
});
router.get('/test', (req, res, next) => {
    res.status(200).json({ message: "/api/auth Working like a pro" });
});
router.post('/logout', (req, res, next) => {
    authController.logout(req, res, next);
    // res.cookie('authToken', '', { expires: new Date(0) });
    // res.status(200).json({status:"Success",message:"logout"})
});
router.post('/forgot-password', (req, res, next) => {
    authController.resetPassword(req, res, next);
});
router.post('/verify-password', (req, res, next) => {
    authController.verifyresetPassword(req, res, next);
});
router.get('/check-auth', auth_middleware_1.authMiddleware, (req, res, next) => {
    authController.checkAuthenticated(req, res, next);
});
router.get('/token', auth_middleware_1.authMiddleware, (req, res, next) => {
    authController.getToken(req, res, next);
});
// router.post('/logout',authMiddleware,authController.)
// router.post('/forgot-password', authController.forgotPassword);
// router.post('/refresh-token', authController.refreshToken);
exports.default = router;
