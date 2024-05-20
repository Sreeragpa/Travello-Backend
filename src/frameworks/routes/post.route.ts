import express, { NextFunction, Request, Response }  from "express";
import { PostRepository } from "../../repository/post.repository";
import { PostUsecase } from "../../usecase/post.usecase";
import { PostController } from "../../controllers/post.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { CloudinaryService } from "../utils/cloudinaryService";

const cloudinaryService = new CloudinaryService();
const router = express.Router();
const postRepository = new PostRepository();
const postUsecase = new PostUsecase(postRepository,cloudinaryService);
const postController = new PostController(postUsecase);
// /api/posts
router.post('/add-post',authMiddleware,(req: Request,res: Response, next: NextFunction)=>{
    postController.createPost(req,res,next)
})
router.get('/get-post',authMiddleware,(req: Request,res: Response, next: NextFunction)=>{
    postController.getPosts(req,res,next)
})


export default router