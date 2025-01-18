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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
class CommentController {
    constructor(commentUsecase) {
        this.commentUsecase = commentUsecase;
    }
    getPostComments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postid = req.params.id;
                const comments = yield this.commentUsecase.getAllComments(postid);
                return res.status(200).json({ status: "success", data: comments });
            }
            catch (error) {
                next(error);
            }
        });
    }
    addComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { postid, content } = req.body;
                const user = req.user;
                if (content && content.trim())
                    content = content.trim().slice(0, 100);
                if (!postid || !content) {
                    return res.status(400).json({ status: "fail", message: "Post ID and content are required" });
                }
                const comment = yield this.commentUsecase.createComment(user.user_id, postid, content);
                return res.status(201).json({ status: "success", data: comment });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.CommentController = CommentController;
