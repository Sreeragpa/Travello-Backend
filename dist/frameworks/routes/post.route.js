"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_repository_1 = require("../../repository/post.repository");
const post_usecase_1 = require("../../usecase/post.usecase");
const post_controller_1 = require("../../controllers/post.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const cloudinaryService_1 = require("../utils/cloudinaryService");
const follow_repository_1 = require("../../repository/follow.repository");
const comment_repository_1 = require("../../repository/comment.repository");
const notification_repository_1 = require("../../repository/notification.repository");
const notification_usecase_1 = require("../../usecase/notification.usecase");
const cloudinaryService = new cloudinaryService_1.CloudinaryService();
const router = express_1.default.Router();
const postRepository = new post_repository_1.PostRepository();
const followRepostory = new follow_repository_1.FollowRepository();
const commentRepository = new comment_repository_1.CommentRepository();
const notificationRepository = new notification_repository_1.NotificationRepository();
const notificationUsecase = new notification_usecase_1.NotificationUsecase(notificationRepository);
const postUsecase = new post_usecase_1.PostUsecase(postRepository, cloudinaryService, followRepostory, commentRepository, notificationUsecase);
const postController = new post_controller_1.PostController(postUsecase);
// /api/posts
router.post('/add-post', auth_middleware_1.authMiddleware, (req, res, next) => {
    postController.createPost(req, res, next);
});
router.get('/get-post', auth_middleware_1.authMiddleware, (req, res, next) => {
    postController.getPosts(req, res, next);
});
router.get('/get-post/:id', auth_middleware_1.authMiddleware, (req, res, next) => {
    postController.getPosts(req, res, next);
});
router.get('/get-userpost', auth_middleware_1.authMiddleware, (req, res, next) => {
    postController.getUserPosts(req, res, next);
});
router.get('/get-userpost/:id', auth_middleware_1.authMiddleware, (req, res, next) => {
    postController.getUserPosts(req, res, next);
});
router.post('/like', auth_middleware_1.authMiddleware, (req, res, next) => {
    postController.likePost(req, res, next);
});
router.delete('/unlike', auth_middleware_1.authMiddleware, (req, res, next) => {
    postController.unlikePost(req, res, next);
});
router.put('/save-post', auth_middleware_1.authMiddleware, (req, res, next) => {
    postController.addToSaved(req, res, next);
});
router.delete('/unsave-post/:postid', auth_middleware_1.authMiddleware, (req, res, next) => {
    postController.removeSaved(req, res, next);
});
router.get('/saved-post', auth_middleware_1.authMiddleware, (req, res, next) => {
    postController.getSavedPosts(req, res, next);
});
router.get('/count', auth_middleware_1.authMiddleware, (req, res, next) => {
    postController.getPostCount(req, res, next);
});
router.get('/count/:profileid', auth_middleware_1.authMiddleware, (req, res, next) => {
    postController.getPostCount(req, res, next);
});
exports.default = router;
