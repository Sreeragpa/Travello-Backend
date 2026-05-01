"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_repository_1 = require("../../repository/comment.repository");
const comment_usecase_1 = require("../../usecase/comment.usecase");
const comment_controller_1 = require("../../controllers/comment.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
const commentRepository = new comment_repository_1.CommentRepository();
const commentUsecase = new comment_usecase_1.CommentUsecase(commentRepository);
const commentController = new comment_controller_1.CommentController(commentUsecase);
router.get('/get-comment/:id', auth_middleware_1.authMiddleware, (req, res, next) => {
    commentController.getPostComments(req, res, next);
});
router.post('/add-comment', auth_middleware_1.authMiddleware, (req, res, next) => {
    commentController.addComment(req, res, next);
});
exports.default = router;
