import { NextFunction, Request, Response } from "express";
import { ICommentUsecase } from "../interfaces/usecase/IComment.usecase";
import { AuthenticatedRequest } from "../frameworks/middlewares/auth.middleware";

export class CommentController{
    private commentUsecase: ICommentUsecase;
    constructor(commentUsecase: ICommentUsecase){
        this.commentUsecase = commentUsecase
    }

    async getPostCommenst(req: AuthenticatedRequest,res: Response,next: NextFunction){

    }
}