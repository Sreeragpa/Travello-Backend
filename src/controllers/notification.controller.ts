import { NextFunction, Response } from "express";
import { INotification } from "../entities/notification.entity";
import { AuthenticatedRequest } from "../frameworks/middlewares/auth.middleware";
import { INotificationUsecase } from "../interfaces/usecase/INotification.usecase";
import { IJwtPayload } from "../interfaces/usecase/IUser.usecase";
import { NOTIFICATION_TYPE } from "../enums/notification.enums";
import { io } from "../server";

export class NotificationController{
    private notificationUsecase : INotificationUsecase
    constructor(notificationUsecase: INotificationUsecase){
        this.notificationUsecase = notificationUsecase
    }
    async sendNotification(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {
            const user = req.user as IJwtPayload;
            console.log(req.body);
            
            const {  recipient, type, tripId } = req.body;
            const sender = user.id;
            const notificationdata: INotification = {
                sender: sender,
                recipient: recipient,
                type: NOTIFICATION_TYPE.JOINREQUEST,
                tripid: tripId,
            }

            
            
            const data = await this.notificationUsecase.createNotification(notificationdata);
            const followedUserSocketId = 'userSocketMap[followingid];'
            if (followedUserSocketId) {
              io.to(followedUserSocketId).emit("notification", {
                success: true,
                data: "result",
              });
            }
            res.status(201).json({status:"success",data:data})
        } catch (error) {
            next(error)
        }
    }

    async getNotification(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {
            const user = req.user as IJwtPayload;
            const data = await this.notificationUsecase.getNotificationforUser(user.user_id)
            res.status(200).json({status:"success",data:data})

        } catch (error) {
            next(error)
        }


    }

    async markNotificationRead(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {
            const {notificationid} = req.body;
            const user = req.user as IJwtPayload;
            const notification = await this.notificationUsecase.marksAsRead(notificationid);
            res.status(200).json({status:"success",data:notification})

        } catch (error) {
            next(error)
        }
    }

    async getNotificationCount(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {
            const user = req.user as IJwtPayload;
            const count = await this.notificationUsecase.getNotificationCount(user.user_id);
            res.status(200).json({status:"success",data:count})

        } catch (error) {
            next(error)
        }
    }

}