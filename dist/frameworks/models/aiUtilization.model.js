"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiUtilizationModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AiUtilizationSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
        index: true,
    },
    feature: {
        type: String,
        required: true,
        index: true,
    },
    provider: {
        type: String,
        enum: ["skipped", "gemini", "rapidapi", "none"],
        required: true,
        index: true,
    },
    model: { type: String },
    messageCharCount: { type: Number, required: true },
    replyCharCount: { type: Number, required: true },
    tripsReturnedCount: { type: Number, required: true },
    hadLocationFilter: { type: Boolean, required: true },
    promptTokens: { type: Number },
    completionTokens: { type: Number },
    totalTokens: { type: Number },
    durationMs: { type: Number, required: true },
    errorSummary: { type: String, maxlength: 2000 },
}, { timestamps: true, collection: "ai_utilizations" });
AiUtilizationSchema.index({ user: 1, createdAt: -1 });
exports.AiUtilizationModel = mongoose_1.default.model("AiUtilization", AiUtilizationSchema);
