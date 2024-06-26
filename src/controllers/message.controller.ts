import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../frameworks/middlewares/auth.middleware";
import { IMessageUsecase } from "../interfaces/usecase/IMessage.usecase";
import { IJwtPayload } from "../interfaces/usecase/IUser.usecase";
import { IConversationRepository } from "../interfaces/repositories/IConversation.repositories";

export class MessageController {
    private messageUsecase: IMessageUsecase

    constructor(messageUsecase: IMessageUsecase) {
        this.messageUsecase = messageUsecase
    }

    async getMessages(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user as IJwtPayload;
            const conversationid = req.params.conversationid;
            if (!conversationid) {
                res.status(400).json({ message: "Invalid Conversationid" })
            }

            const messages = await this.messageUsecase.getMessages(user.user_id, conversationid)
            res.status(200).json({status:"message",data:messages})
        } catch (error) {
            next(error)
        }

    }

    async sendMessage(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {
            const user = req.user as IJwtPayload;
            const conversationid = req.body.conversationid;
            const text = req.body.text;
            if(!text || !text.trim()){
                res.status(400).json({ message: "Empty Message" })
            }
            if (!conversationid) {
                res.status(400).json({ message: "Invalid Conversationid" })
            }

            const message = await this.messageUsecase.sendMessage(user.user_id,conversationid,text)
            res.status(200).json({status:"success",data:message})
        } catch (error) {
            next(error)
        }
    }
}