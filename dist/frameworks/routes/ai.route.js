"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ai_controller_1 = require("../../controllers/ai.controller");
const trip_repository_1 = require("../../repository/trip.repository");
const ai_usecase_1 = require("../../usecase/ai.usecase");
const router = express_1.default.Router();
const tripRepository = new trip_repository_1.TripRepository();
const aiUsecase = new ai_usecase_1.AiUsecase(tripRepository);
const aiController = new ai_controller_1.AiController(aiUsecase);
// POST /api/ai/trip-chat
router.post("/trip-chat", (req, res, next) => aiController.tripChat(req, res, next));
exports.default = router;
