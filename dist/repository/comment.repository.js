"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const comment_model_1 = require("../frameworks/models/comment.model");
class CommentRepository {
    getCommentsByPostId(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield comment_model_1.CommentModel.aggregate([
                { $match: { post_id: new mongoose_1.default.Types.ObjectId(postId) } },
                { $lookup: {
                        from: "users",
                        localField: "author_id",
                        foreignField: "_id",
                        as: "user"
                    } },
                { $sort: { createdAt: -1 } },
            ]);
            return comments;
        });
    }
    createComment(author_id, post_id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const newComment = new comment_model_1.CommentModel({
                author_id: author_id,
                post_id: post_id,
                content: content
            });
            const savedComment = yield newComment.save();
            return savedComment;
        });
    }
}
exports.CommentRepository = CommentRepository;
