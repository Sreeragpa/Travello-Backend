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
            const id = req.params.id;
            const posts = await this.postUsecase.getPosts(user.user_id,id);
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
            res.status(200).json({status:"success",data:like})
        } catch (error) {
            next(error)
        }
    }
    async unlikePost(req: AuthenticatedRequest,res: Response, next: NextFunction){
        try {
            const user = req.user as IJwtPayload;
            const postid = req.body.postid;
            const like = await this.postUsecase.unlikePost(user.user_id,postid);
            res.status(200).json({status:"success",data:like})
        } catch (error) {
            next(error)
        }
    }

    async getUserPosts(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {
            const user = req.user as IJwtPayload;
            const userId = req.params.id || user.user_id;
            const posts = await this.postUsecase.getUserPosts(userId);
            res.status(200).json({status:'success',data: posts})
        }catch(error){
            next(error)
        }
    }

    async getSinglePost(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {
            const postid = req.params.id;

        } catch (error) {
            next(error)
        }
    }

    async addToSaved(req:AuthenticatedRequest,res:Response,next: NextFunction){
        try {
            const user = req.user as IJwtPayload;
            const postid = req.body.postid;
            const savedPost = await this.postUsecase.savePost(user.user_id,postid);
            res.status(200).json({status:"success",data:savedPost})
        } catch (error) {
            next(error)
        }
    }

    async removeSaved(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {
            const user = req.user as IJwtPayload;
            const postid = req.params.postid;
            const unsavedPost = await this.postUsecase.unsavePost(user.user_id,postid);
            res.status(200).json({status:"success",data:unsavedPost})

        } catch (error) {
            next(error)
        }
    }

    async getSavedPosts(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {
            const user = req.user as IJwtPayload;
            const savedPosts = await this.postUsecase.getSavedPosts(user.user_id)
            res.status(200).json({status:"success",data:savedPosts})

        } catch (error) {
            next(error)
        }
    }

    async getPostCount(req: AuthenticatedRequest, res: Response, next: NextFunction){
        try {
            const user = req.user as IJwtPayload;
            const userId = req.params.profileid || user.user_id;
            const count = await this.postUsecase.getUserPostCount(userId);
            
            res.status(200).json({status:"success",data:{count:count}})
        } catch (error) {
            next(error)
        }
    }
}