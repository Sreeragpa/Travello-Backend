"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    conversation_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    sender: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    text: {
        type: String
    }
}, { timestamps: true });
exports.MessageModel = mongoose_1.default.model('messages', messageSchema);
