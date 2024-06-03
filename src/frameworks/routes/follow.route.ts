import express, { NextFunction, Request, Response } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { FollowRepository } from "../../repository/follow.repository";
import { FollowUsecase } from "../../usecase/follow.usecase";
import { FollowController } from "../../controllers/follow.controller";

const router = express.Router();
const followRepository = new FollowRepository();
const followUsecase = new FollowUsecase(followRepository);
const followController = new FollowController(followUsecase)

router.post('/follow',authMiddleware,(req:Request, res: Response, next: NextFunction)=>{
    followController.followAccount(req,res,next)
})

router.delete('/unfollow',authMiddleware,(req:Request, res: Response, next: NextFunction)=>{
    followController.unfollowAcccount(req,res,next)
    
})
router.get('/count',authMiddleware,(req: Request, res: Response, next: NextFunction)=>{
    followController.getFollowCount(req,res,next)
})

export default router