"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    post_id: {
        type: mongoose_1.default.Types.ObjectId,
    },
    content: {
        type: String,
    },
    author_id: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Users"
    }
}, { timestamps: true });
exports.CommentModel = mongoose_1.default.model("Comments", commentSchema);
