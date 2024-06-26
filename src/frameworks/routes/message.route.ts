import express, { NextFunction, Request, Response } from "express";
import { MessageRepository } from "../../repository/message.repository";
import { MessageUsecase } from "../../usecase/message.usecase";
import { ConversationRepository } from "../../repository/conversation.repository";
import { MessageController } from "../../controllers/message.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
const router = express.Router();

const messageRepository = new MessageRepository();
const conversationRepository = new ConversationRepository()
const messageUsecase = new MessageUsecase(messageRepository,conversationRepository);
const messageController = new MessageController(messageUsecase)

router.get('/get-message/:conversationid',authMiddleware,(req: Request,res: Response, next: NextFunction)=>{
    messageController.getMessages(req,res,next)
})

router.post('/send-message',authMiddleware,(req: Request, res: Response, next: NextFunction)=>{
    messageController.sendMessage(req,res,next)
})

export default router