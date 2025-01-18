"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostLikeModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const postLikeSchema = new mongoose_1.default.Schema({
    post_id: {
        type: mongoose_1.default.Types.ObjectId, ref: 'Post'
    },
    user_id: {
        type: mongoose_1.default.Types.ObjectId, ref: 'Users'
    }
}, { timestamps: true });
exports.PostLikeModel = mongoose_1.default.model('postLikes', postLikeSchema);
