import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../frameworks/middlewares/auth.middleware";
import { IMessageUsecase } from "../interfaces/usecase/IMessage.usecase";
import { IJwtPayload } from "../interfaces/usecase/IUser.usecase";

export class MessageController{
    private messageUsecase: IMessageUsecase
    constructor(messageUsecase: IMessageUsecase){
        this.messageUsecase = messageUsecase
    }

    async getMessages(req: AuthenticatedRequest, res: Response, next: NextFunction){
        const user = req.user as IJwtPayload;
    
    }
}