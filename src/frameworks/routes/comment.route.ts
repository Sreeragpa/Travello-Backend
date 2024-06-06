import express, { NextFunction, Request, Response }  from "express";
import { CommentRepository } from "../../repository/comment.repository";
import { CommentUsecase } from "../../usecase/comment.usecase";
import { CommentController } from "../../controllers/comment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
const router = express.Router();

const commentRepository = new CommentRepository();
const commentUsecase = new CommentUsecase(commentRepository);
const commentController = new CommentController(commentUsecase)

router.get('/get-comment/:id',authMiddleware,(req: Request, res: Response, next: NextFunction)=>{
    commentController.getPostComments(req,res,next)
})
router.post('/add-comment',authMiddleware,(req: Request, res: Response, next: NextFunction)=>{
    commentController.addComment(req,res,next)
})


export default router