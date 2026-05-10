import express, { NextFunction, Request, Response } from "express";
import { AiController } from "../../controllers/ai.controller";
import { TripRepository } from "../../repository/trip.repository";
import { AiUsecase } from "../../usecase/ai.usecase";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

const tripRepository = new TripRepository();
const aiUsecase = new AiUsecase(tripRepository);
const aiController = new AiController(aiUsecase);

// POST /api/ai/trip-chat
router.post(
  "/trip-chat",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    aiController.tripChat(req, res, next)
);

export default router;

