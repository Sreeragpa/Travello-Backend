import express, { NextFunction, Request, Response } from "express";
import { AIUsecase } from "../../usecase/ai.usecase";
import { getGrokService } from "../utils/geminiService";
import AIController from "../../controllers/ai.controller";

const grokService = getGrokService();
const aiUsecase = new AIUsecase(grokService);
const aiController = new AIController(aiUsecase);
const router = express.Router();

router.post('/chat/grok', aiController.grokChat.bind(aiController));

export default router;