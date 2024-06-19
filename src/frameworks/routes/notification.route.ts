import express, { NextFunction, Request, Response } from "express";
import { NotificationRepository } from "../../repository/notification.repository";
import { NotificationUsecase } from "../../usecase/notification.usecase";
import { NotificationController } from "../../controllers/notification.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { io } from "../../server";
import { userSocketMap } from "../configs/socketioHandlers";
const router = express.Router();
const notificationRepository = new NotificationRepository();
const notificationUsecase = new NotificationUsecase(notificationRepository);
const notificationController = new NotificationController(notificationUsecase)

router.post('/create-notification',authMiddleware,(req: Request,res: Response, next: NextFunction)=>notificationController.sendNotification(req,res,next))
router.get('/get-notification',authMiddleware,(req: Request,res: Response, next: NextFunction)=>notificationController.getNotification(req,res,next))
router.get('/count',authMiddleware,(req: Request,res: Response, next: NextFunction)=>notificationController.getNotificationCount(req,res,next))
router.post('/mark-read',authMiddleware,(req: Request,res: Response, next: NextFunction)=>notificationController.markNotificationRead(req,res,next))

export default router