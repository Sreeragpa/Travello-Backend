import IPost from "../entities/post.entity";
import { CloudinaryService } from "../frameworks/utils/cloudinaryService";
import { IPostRepository } from "../interfaces/repositories/IPost.repository";
import { IPostUsecase } from "../interfaces/usecase/IPost.usercase";


export class PostUsecase implements IPostUsecase{
    private postRepository: IPostRepository
    private cloudinaryService: CloudinaryService
    constructor(postRepository: IPostRepository, cloudinaryService: CloudinaryService){
        this.postRepository = postRepository
        this.cloudinaryService = cloudinaryService
    }
    async likePost(userid: string, postid: string): Promise<any> {
        try {
            const result = await this.postRepository.likePost(userid,postid);
            if(result){
                return result
            }else{
                throw new Error("Error like not Submitted")
            }
        } catch (error) {
            throw error
        }
    }
    async unlikePost(userid: string, postid: string): Promise<any> {
        try {
            const result = await this.postRepository.unlikePost(userid,postid);
            if(result){
                return result
            }else{
                throw new Error("Error unlike not Submitted")
            }
        } catch (error) {
            throw error
        }
    }
    async getPosts(userid: string): Promise<IPost[]> {
        try {
            const posts = await this.postRepository.findAll();

            
            const postsWithLikeInfo = await Promise.all(posts.map(async post =>{
                const isLiked = await this.postRepository.isPostLikedByUser(userid,post._id);
                return {...post,isLiked}
            }))
            return postsWithLikeInfo
        } catch (error) {
            throw error
        }
    }
    async createPost(data: IPost): Promise<IPost> {
        try {
            const uploadedImages = await Promise.all(data.images.map(image =>
                this.cloudinaryService.uploadImage(image)
            ));
        
            data.images = uploadedImages;
            const post = await this.postRepository.create(data);
            return post;
        } catch (error) {
            throw error
        }
   
    }
    editPost(postid: string, caption: string): Promise<IPost> {
        throw new Error("Method not implemented.");
    }
    deletePost(postid: string): Promise<IPost> {
        throw new Error("Method not implemented.");
    }

}