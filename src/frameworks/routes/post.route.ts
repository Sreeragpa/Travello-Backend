import express, { NextFunction, Request, Response }  from "express";
import { PostRepository } from "../../repository/post.repository";
import { PostUsecase } from "../../usecase/post.usecase";
import { PostController } from "../../controllers/post.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { CloudinaryService } from "../utils/cloudinaryService";
import { FollowRepository } from "../../repository/follow.repository";

const cloudinaryService = new CloudinaryService();
const router = express.Router();
const postRepository = new PostRepository();
const followRepostory = new FollowRepository()
const postUsecase = new PostUsecase(postRepository,cloudinaryService,followRepostory);
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
router.post('/like',authMiddleware,(req: Request, res: Response, next: NextFunction)=>{
    postController.likePost(req,res,next)
})
router.delete('/unlike',authMiddleware,(req: Request, res: Response, next: NextFunction)=>{
    postController.unlikePost(req,res,next)
})


export default router