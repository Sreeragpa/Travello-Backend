import mongoose from "mongoose";

const AiUtilizationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true, collection: "ai_utilizations" }
);

AiUtilizationSchema.index({ user: 1, createdAt: -1 });

export const AiUtilizationModel = mongoose.model(
  "AiUtilization",
  AiUtilizationSchema
);
