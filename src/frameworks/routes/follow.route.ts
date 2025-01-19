import express, { NextFunction, Request, Response } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { FollowRepository } from "../../repository/follow.repository";
import { FollowUsecase } from "../../usecase/follow.usecase";
import { FollowController } from "../../controllers/follow.controller";
import { NotificationRepository } from "../../repository/notification.repository";
import { NotificationUsecase } from "../../usecase/notification.usecase"
import { io } from "../../server";
import { userSocketMap } from "../configs/socketioHandlers";
import { UserRepository } from "../../repository/user.repository";

const router = express.Router();
const followRepository = new FollowRepository();
const notificationRepository = new NotificationRepository();
const userRepository = new UserRepository();
const notificationUsecase = new NotificationUsecase(notificationRepository,userRepository)
const followUsecase = new FollowUsecase(followRepository,notificationUsecase);
const followController = new FollowController(followUsecase);


router.post('/follow',authMiddleware,(req:Request, res: Response, next: NextFunction)=>{
    followController.followAccount(req,res,next)
})

router.delete('/unfollow',authMiddleware,(req:Request, res: Response, next: NextFunction)=>{
    followController.unfollowAcccount(req,res,next)
    
})
router.get('/count',authMiddleware,(req: Request, res: Response, next: NextFunction)=>{
    followController.getFollowCount(req,res,next)
})
router.get('/count/:id',authMiddleware,(req: Request, res: Response, next: NextFunction)=>{
    followController.getFollowCount(req,res,next)
})

router.get('/following',authMiddleware,(req: Request, res: Response, next: NextFunction)=>{
    followController.getFollowings(req,res,next)
})

export default router