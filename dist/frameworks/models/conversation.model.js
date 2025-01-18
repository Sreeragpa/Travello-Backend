"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const conversationSchema = new mongoose_1.default.Schema({
    members: [{
            type: mongoose_1.default.Types.ObjectId
        }],
    isGroup: {
        type: Boolean,
        default: false
    },
    groupName: {
        type: String
    },
    unreadMessage: {
        type: Map,
        of: Boolean,
        default: {}
    }
}, { timestamps: true });
exports.ConversationModel = mongoose_1.default.model('conversations', conversationSchema);
