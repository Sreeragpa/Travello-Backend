"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const NotificationSchema = new mongoose_1.default.Schema({
    sender: {
        type: mongoose_1.default.Types.ObjectId
    },
    recipient: {
        type: mongoose_1.default.Types.ObjectId
    },
    type: {
        type: String,
        enum: ["JOINREQUEST", "REQUEST", "POSTLIKE", "FOLLOW"]
    },
    tripid: {
        type: mongoose_1.default.Types.ObjectId
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
exports.NotificationModel = mongoose_1.default.model("notification", NotificationSchema);
