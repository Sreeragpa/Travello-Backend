"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_repository_1 = require("../../repository/user.repository");
const user_usecase_1 = require("../../usecase/user.usecase");
const user_controller_1 = require("../../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const cloudinaryService_1 = require("../utils/cloudinaryService");
const auth_repository_1 = require("../../repository/auth.repository");
const follow_repository_1 = require("../../repository/follow.repository");
const router = express_1.default.Router();
const cloudinaryService = new cloudinaryService_1.CloudinaryService();
const authRepository = new auth_repository_1.AuthRepository();
const userRepository = new user_repository_1.UserRepository();
const followRepository = new follow_repository_1.FollowRepository();
const userUsecase = new user_usecase_1.UserUsecase(userRepository, authRepository, cloudinaryService, followRepository);
const userController = new user_controller_1.UserController(userUsecase);
// /api/user
router.put('/add-profileimg', auth_middleware_1.authMiddleware, (req, res, next) => {
    userController.updateProfilePicture(req, res, next);
});
router.get('/get-user', auth_middleware_1.authMiddleware, (req, res, next) => {
    userController.getUser(req, res, next);
});
router.get('/get-user/:id', auth_middleware_1.authMiddleware, (req, res, next) => {
    userController.getUser(req, res, next);
});
router.put('/user', auth_middleware_1.authMiddleware, (req, res, next) => {
    userController.updateProfile(req, res, next);
});
router.put('/update-password', auth_middleware_1.authMiddleware, (req, res, next) => {
    userController.updatePassword(req, res, next);
});
router.put('/update-profile', auth_middleware_1.authMiddleware, (req, res, next) => {
    userController.updateProfile(req, res, next);
});
router.get('/search-user', auth_middleware_1.authMiddleware, (req, res, next) => {
    userController.searchUser(req, res, next);
});
exports.default = router;
