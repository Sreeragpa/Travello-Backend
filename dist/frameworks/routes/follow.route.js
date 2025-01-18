"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const follow_repository_1 = require("../../repository/follow.repository");
const follow_usecase_1 = require("../../usecase/follow.usecase");
const follow_controller_1 = require("../../controllers/follow.controller");
const notification_repository_1 = require("../../repository/notification.repository");
const notification_usecase_1 = require("../../usecase/notification.usecase");
const router = express_1.default.Router();
const followRepository = new follow_repository_1.FollowRepository();
const notificationRepository = new notification_repository_1.NotificationRepository();
const notificationUsecase = new notification_usecase_1.NotificationUsecase(notificationRepository);
const followUsecase = new follow_usecase_1.FollowUsecase(followRepository, notificationUsecase);
const followController = new follow_controller_1.FollowController(followUsecase);
router.post('/follow', auth_middleware_1.authMiddleware, (req, res, next) => {
    followController.followAccount(req, res, next);
});
router.delete('/unfollow', auth_middleware_1.authMiddleware, (req, res, next) => {
    followController.unfollowAcccount(req, res, next);
});
router.get('/count', auth_middleware_1.authMiddleware, (req, res, next) => {
    followController.getFollowCount(req, res, next);
});
router.get('/count/:id', auth_middleware_1.authMiddleware, (req, res, next) => {
    followController.getFollowCount(req, res, next);
});
router.get('/following', auth_middleware_1.authMiddleware, (req, res, next) => {
    followController.getFollowings(req, res, next);
});
exports.default = router;
