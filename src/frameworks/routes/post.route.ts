import express, { NextFunction, Request, Response }  from "express";
import { PostRepository } from "../../repository/post.repository";
import { PostUsecase } from "../../usecase/post.usecase";
import { PostController } from "../../controllers/post.controller";
import { AuthenticatedRequest, authMiddleware } from "../middlewares/auth.middleware";
import { CloudinaryService } from "../utils/cloudinaryService";
import { FollowRepository } from "../../repository/follow.repository";
import { CommentRepository } from "../../repository/comment.repository";
import { NotificationRepository } from "../../repository/notification.repository";
import { NotificationUsecase } from "../../usecase/notification.usecase";
import { io } from "../../server";
import { userSocketMap } from "../configs/socketioHandlers";

const cloudinaryService = new CloudinaryService();
const router = express.Router();
const postRepository = new PostRepository();
const followRepostory = new FollowRepository();
const commentRepository = new CommentRepository();
const notificationRepository = new NotificationRepository();
const notificationUsecase = new NotificationUsecase(notificationRepository)

const postUsecase = new PostUsecase(postRepository,cloudinaryService,followRepostory,commentRepository,notificationUsecase);
const postController = new PostController(postUsecase);
// /api/posts
router.post('/add-post',authMiddleware,(req: Request,res: Response, next: NextFunction)=>{
    postController.createPost(req,res,next)
})
router.get('/get-post',authMiddleware,(req: Request,res: Response, next: NextFunction)=>{
    postController.getPosts(req,res,next)
})
router.get('/get-post/:id',authMiddleware,(req: Request,res: Response, next: NextFunction)=>{
    postController.getPosts(req,res,next)
})
router.get('/get-userpost',authMiddleware,(req: Request,res: Response, next: NextFunction)=>{
    postController.getUserPosts(req,res,next)
})
router.get('/get-userpost/:id',authMiddleware,(req: Request,res: Response, next: NextFunction)=>{
    postController.getUserPosts(req,res,next)
})
router.post('/like',authMiddleware,(req: Request, res: Response, next: NextFunction)=>{
    postController.likePost(req,res,next)
})
router.delete('/unlike',authMiddleware,(req: Request, res: Response, next: NextFunction)=>{
    postController.unlikePost(req,res,next)
})
router.put('/save-post',authMiddleware,(req: Request, res: Response, next: NextFunction)=>{
    postController.addToSaved(req,res,next)
})
router.delete('/unsave-post/:postid',authMiddleware,(req: Request, res: Response, next: NextFunction)=>{
    postController.removeSaved(req,res,next)
})

router.get('/saved-post',authMiddleware,(req: Request, res: Response, next: NextFunction)=>{
    postController.getSavedPosts(req,res,next)
})
router.get('/count',authMiddleware,(req: Request, res: Response, next: NextFunction)=>{
    postController.getPostCount(req,res,next)
})
router.get('/count/:profileid',authMiddleware,(req: Request, res: Response, next: NextFunction)=>{
    postController.getPostCount(req,res,next)
})


export default router