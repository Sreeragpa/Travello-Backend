import IPost from "../entities/post.entity";
import { CloudinaryService } from "../frameworks/utils/cloudinaryService";
import { IPostRepository } from "../interfaces/repositories/IPost.repository";
import { IPostUsecase } from "../interfaces/usecase/IPost.usercase";
import { FollowRepository } from "../repository/follow.repository";


export class PostUsecase implements IPostUsecase{
    private postRepository: IPostRepository
    private cloudinaryService: CloudinaryService
    private followRepository: FollowRepository
    constructor(postRepository: IPostRepository, cloudinaryService: CloudinaryService, followRepository: FollowRepository){
        this.postRepository = postRepository
        this.cloudinaryService = cloudinaryService
        this.followRepository = followRepository
    }
    async getUserPosts(userid: string): Promise<IPost[]> {
        try {
            const userPosts = await this.postRepository.findPostByUser(userid);
            return userPosts
        } catch (error) {
            throw error
        }
        throw new Error("Method not implemented.");
    }
    async likePost(userid: string, postid: string): Promise<any> {
        try {
            const isLiked = await this.postRepository.isPostLikedByUser(userid,postid)
            if(!isLiked){
                const result = await this.postRepository.likePost(userid,postid);
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
            const isLiked = await this.postRepository.isPostLikedByUser(userid,postid)
            if(isLiked){
                const result = await this.postRepository.unlikePost(userid,postid);
                return result
            }

                throw new Error("Error unlike not Submitted")

        } catch (error) {
            throw error
        }
    }
    async getPosts(userid: string,postid: string | null): Promise<IPost[]> {
        try {
            let posts:IPost[] = [];
            if(postid){
                posts = await this.postRepository.findOne(postid)
            }else{
                posts = await this.postRepository.findAll();
            }

            
            const postsWithLikeInfo = await Promise.all(posts.map(async post =>{
                const isLiked = await this.postRepository.isPostLikedByUser(userid,post._id);
                return {...post,isLiked}
            }))

            const postsWithFollowInfo = await Promise.all(postsWithLikeInfo.map(async post =>{
                const isFollowing = await this.followRepository.isUserFollowing(userid,post.creator_id)
                return {...post,isFollowing}
            }))
            return postsWithFollowInfo
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