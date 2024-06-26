import { NextFunction, Request, Response } from "express";
import { IConversationUsecase } from "../interfaces/usecase/IConversation.usecase";
import { IJwtPayload } from "../interfaces/usecase/IUser.usecase";
import { AuthenticatedRequest } from "../frameworks/middlewares/auth.middleware";

export class ConversationController {
    private conversationUsecase: IConversationUsecase
    constructor(conversationUsecase: IConversationUsecase) {
        this.conversationUsecase = conversationUsecase
    }

    async getAllConversations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user as IJwtPayload;
            const result = await this.conversationUsecase.getAllConversation(user.user_id);
            res.status(200).json({ status: "success", data: result })
        } catch (error) {
            next(error)
        }
    }

    async createConversation(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {
            const user = req.user as IJwtPayload;
            const member1 = user.user_id;
            const member2 = req.body.member;
            if(!member1 || !member2){
                return res.status(400).json({ message: "Members are not Defined" });
            }
            const conversation = await this.conversationUsecase.createConversation(member1,member2);
            res.status(200).json({status:"success",data:conversation})
        } catch (error) {
            next(error)
        }

    }

    async getSingleConversation(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {
            const user = req.user as IJwtPayload;
            const conversationid = req.params.conversationid;
            const conversation = await this.conversationUsecase.getConversationByid(user.user_id,conversationid)
            conversation.currentUserId = user.user_id
            res.status(200).json({status:"success",data:conversation})
            
        } catch (error) {
            next(error)
        }
    }
}