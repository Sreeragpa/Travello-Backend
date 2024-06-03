import { NextFunction, Request, Response } from "express";
import { IFollowUsecase } from "../interfaces/usecase/IFollow.usecase";
import { AuthenticatedRequest } from "../frameworks/middlewares/auth.middleware";
import { IJwtPayload } from "../interfaces/usecase/IUser.usecase";

export class FollowController{
    private followUsecase: IFollowUsecase
    constructor(followUsecase: IFollowUsecase){
        this.followUsecase = followUsecase
    }

    async followAccount(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {
            const user = req.user as IJwtPayload;
            const {followingid} = req.body;
            const followerid = user.user_id;
            const result = await this.followUsecase.follow(followerid,followingid);
            res.status(200).json({status:"success",data:result})
        } catch (error) {
            next(error)
        }
    }

    async unfollowAcccount(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {
            const user = req.user as IJwtPayload;
            const { followingid} = req.body;
            const followerid = user.user_id;
            const result = await this.followUsecase.unfollow(followerid,followingid);
            res.status(200).json({status:"success",data:result})
        } catch (error) {
            next(error)
        }
    }

    async getFollowCount(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {
            const user = req.user as IJwtPayload;
            const result = await this.followUsecase.getFollowersCount(user.user_id);

            res.status(200).json({status:'success',data:result})
        } catch (error) {
            next(error)
        }
    }
}