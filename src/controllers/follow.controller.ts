import { NextFunction, Request, Response } from "express";
import { IFollowUsecase } from "../interfaces/usecase/IFollow.usecase";
import { AuthenticatedRequest } from "../frameworks/middlewares/auth.middleware";
import { IJwtPayload } from "../interfaces/usecase/IUser.usecase";
import { Server as SocketIOServer } from "socket.io";
import { IFollowingSearch } from "../entities/follow.entity";
interface IUserSocketMap {
    [key: string]: string;
  }
export class FollowController{
    private followUsecase: IFollowUsecase;

    constructor(followUsecase: IFollowUsecase){
        this.followUsecase = followUsecase
    }

    async followAccount(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {
            const user = req.user as IJwtPayload;
            const {followingid} = req.body;
            const followerid = user.user_id;
            const result = await this.followUsecase.follow(followerid,followingid);
            
            
            // const followedUserSocketId = this.userSocketMap[followingid];
            // console.log(followedUserSocketId);
            // console.log(this.io,'io');
            
            // if (followedUserSocketId) {
            //     console.log('hehehheheh');
                
            //     // this.io.to(followedUserSocketId).emit('followNotification',result);
            //   }
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
            const userId = req.params.id || user.user_id;
            const result = await this.followUsecase.getFollowersCount(userId);

            res.status(200).json({status:'success',data:result})
        } catch (error) {
            next(error)
        }
    }

    async getFollowings(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {
            const user = req.user as IJwtPayload;
            const searchvalue = req.query.search;
            const data: IFollowingSearch = {
                follower_id: user.user_id,
                searchKeyword:searchvalue?String(searchvalue).trim():null
            }
            const users = await this.followUsecase.getFollowings(data);
            res.status(200).json({status:"success",data:users})
            
        } catch (error) {
            next(error)
        }
    }
}