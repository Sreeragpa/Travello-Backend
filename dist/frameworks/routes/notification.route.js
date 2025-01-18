"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_repository_1 = require("../../repository/notification.repository");
const notification_usecase_1 = require("../../usecase/notification.usecase");
const notification_controller_1 = require("../../controllers/notification.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
const notificationRepository = new notification_repository_1.NotificationRepository();
const notificationUsecase = new notification_usecase_1.NotificationUsecase(notificationRepository);
const notificationController = new notification_controller_1.NotificationController(notificationUsecase);
router.post('/create-notification', auth_middleware_1.authMiddleware, (req, res, next) => notificationController.sendNotification(req, res, next));
router.get('/get-notification', auth_middleware_1.authMiddleware, (req, res, next) => notificationController.getNotification(req, res, next));
router.get('/count', auth_middleware_1.authMiddleware, (req, res, next) => notificationController.getNotificationCount(req, res, next));
router.post('/mark-read', auth_middleware_1.authMiddleware, (req, res, next) => notificationController.markNotificationRead(req, res, next));
exports.default = router;
