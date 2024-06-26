import express, { NextFunction, Request, Response } from "express";
import { ConversationRepository } from "../../repository/conversation.repository";
import { ConversationUsecase } from "../../usecase/conversation.usecase";
import { ConversationController } from "../../controllers/conversation.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { MessageRepository } from "../../repository/message.repository";
const router = express.Router();


const conversationRepository = new ConversationRepository();
const messageRepository = new MessageRepository()
const conversationUsecase = new ConversationUsecase(conversationRepository,messageRepository);
const conversationController = new ConversationController(conversationUsecase);

router.get('/get-conversation',authMiddleware,(req: Request,res: Response, next: NextFunction)=>{
    conversationController.getAllConversations(req,res,next)
})

router.post('/add-conversation',authMiddleware,(req: Request,res: Response, next: NextFunction)=>{
    conversationController.createConversation(req,res,next)
})

router.get('/get-conversation/:conversationid',authMiddleware,(req: Request,res: Response, next: NextFunction)=>{
    conversationController.getSingleConversation(req,res,next)
})

export default router