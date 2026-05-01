"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const OtpSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expiry: {
        type: Date,
        expires: 0
    }
}, { timestamps: true });
// OtpSchema.index({expiry:1},{ expireAfterSeconds: 0 })
OtpSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });
exports.OtpModel = mongoose_1.default.model("Otp", OtpSchema);
