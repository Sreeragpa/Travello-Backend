import { NextFunction, Request, Response, json } from "express";
import { IPostUsecase } from "../interfaces/usecase/IPost.usercase";
import { AuthenticatedRequest } from "../frameworks/middlewares/auth.middleware";
import IPost from "../entities/post.entity";
import IUser from "../entities/user.entity";
import { IJwtPayload } from "../interfaces/usecase/IUser.usecase";


export class PostController{
    private postUsecase: IPostUsecase;
    constructor(postUsecase: IPostUsecase){
        this.postUsecase = postUsecase
    }

    async createPost(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {
            
        const user = req.user as IJwtPayload;
        const images = req.body.images;  
        const caption = req.body.caption.trim();
        const {location,place} = req.body;
        
        // res.status(200).json({data:"hehehehehehh"})
        const data:IPost = {
            _id:'',
            creator_id: user.user_id,
            caption: caption,
            images: images,
            location: location,
            place: place
        }

    
        const result = await this.postUsecase.createPost(data);
        res.status(201).json({ status: 'success', data: result });
    
        } catch (error) {
            next(error)
        }
        
    }

    async getPosts(req: AuthenticatedRequest,res: Response, next: NextFunction){
        try {
            const user = req.user as IJwtPayload;
            const posts = await this.postUsecase.getPosts(user.user_id);
            res.status(200).json({ status: 'success', data: posts });

        } catch (error) {
            next(error)
        }
    }

    async likePost(req: AuthenticatedRequest,res: Response, next: NextFunction){
        try {
            const user = req.user as IJwtPayload;
            const postid = req.body.postid;
            const like = await this.postUsecase.likePost(user.user_id,postid);
            res.status(200).json({status:"success",data:"Like Success"})
        } catch (error) {
            next(error)
        }
    }
    async unlikePost(req: AuthenticatedRequest,res: Response, next: NextFunction){
        try {
            const user = req.user as IJwtPayload;
            const postid = req.body.postid;
            const like = await this.postUsecase.unlikePost(user.user_id,postid);
            res.status(200).json({status:"success",data:"UnLike Success"})
        } catch (error) {
            next(error)
        }
    }
}