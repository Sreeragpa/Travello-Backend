import express, { NextFunction, Request, Response } from "express";
import { NotificationRepository } from "../../repository/notification.repository";
import { NotificationUsecase } from "../../usecase/notification.usecase";
import { NotificationController } from "../../controllers/notification.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
const router = express.Router();
const notificationRepository = new NotificationRepository();
const notificationUsecase = new NotificationUsecase(notificationRepository);
const notificationConroller = new NotificationController(notificationUsecase)

router.post('/create-notification',authMiddleware,(req: Request,res: Response, next: NextFunction)=>notificationConroller.sendNotification(req,res,next))
router.get('/get-notification',authMiddleware,(req: Request,res: Response, next: NextFunction)=>notificationConroller.getNotification(req,res,next))

export default router