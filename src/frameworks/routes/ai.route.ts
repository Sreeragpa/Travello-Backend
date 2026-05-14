import express, { NextFunction, Response } from "express";
import { AiController } from "../../controllers/ai.controller";
import { AiUtilizationRepository } from "../../repository/aiUtilization.repository";
import { TripRepository } from "../../repository/trip.repository";
import { AiUsecase } from "../../usecase/ai.usecase";
import {
  AuthenticatedRequest,
  authMiddleware,
} from "../middlewares/auth.middleware";

const router = express.Router();

const tripRepository = new TripRepository();
const aiUtilizationRepository = new AiUtilizationRepository();
const aiUsecase = new AiUsecase(tripRepository, aiUtilizationRepository);
const aiController = new AiController(aiUsecase);

// POST /api/ai/trip-chat
router.post(
  "/trip-chat",
  authMiddleware,
  (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
    aiController.tripChat(req, res, next)
);

export default router;

