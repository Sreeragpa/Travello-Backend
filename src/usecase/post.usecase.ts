import { INotification } from "../entities/notification.entity";
import IPost, { IPostLike, ISave } from "../entities/post.entity";
import { NOTIFICATION_TYPE } from "../enums/notification.enums";
import { CloudinaryService } from "../frameworks/utils/cloudinaryService";
import { ICommentRepository } from "../interfaces/repositories/IComment.repository";
import { IFollowRepository } from "../interfaces/repositories/IFollow.repository";
import { INotificationRepository } from "../interfaces/repositories/INotification.repository";
import { IPostRepository } from "../interfaces/repositories/IPost.repository";
import { INotificationUsecase } from "../interfaces/usecase/INotification.usecase";
import { IPostUsecase } from "../interfaces/usecase/IPost.usercase";
import { FollowRepository } from "../repository/follow.repository";

export class PostUsecase implements IPostUsecase {
    private postRepository: IPostRepository;
    private cloudinaryService: CloudinaryService;
    private followRepository: IFollowRepository;
    private commentRepository: ICommentRepository;
    private notificationUsecase: INotificationUsecase
    constructor(
        postRepository: IPostRepository,
        cloudinaryService: CloudinaryService,
        followRepository: IFollowRepository,
        commentRepository: ICommentRepository,
        notificationUsecase: INotificationUsecase
    ) {
        this.postRepository = postRepository;
        this.cloudinaryService = cloudinaryService;
        this.followRepository = followRepository;
        this.commentRepository = commentRepository;
        this.notificationUsecase = notificationUsecase;

    }
    async getUserPostCount(userid: string): Promise<number> {
        try {
            const postCount = await this.postRepository.count(userid);
            return postCount;
        } catch (error) {
            throw error;
        }
    }
    async getSavedPosts(userid: string): Promise<IPost[] | null> {
        const savedPosts = await this.postRepository.findSavedPost(userid);

        const postDetails =
            savedPosts?.map((item) => item.post_id as IPost) || null;



        return postDetails;
    }
    async unsavePost(userid: string, postid: string): Promise<ISave | null> {
        try {
            const unsavedPost = await this.postRepository.unSavePost(userid, postid);
            return unsavedPost;
        } catch (error) {
            throw error;
        }
    }
    async savePost(userid: string, postid: string): Promise<ISave | null> {
        try {
            const existingSave = await this.postRepository.findSave(userid, postid);
            if (existingSave) {
                return existingSave;
            }
            const data = await this.postRepository.savePost(userid, postid);
            return data;
        } catch (error) {
            throw error;
        }
    }
    async getUserPosts(userid: string): Promise<IPost[]> {
        try {
            const userPosts = await this.postRepository.findPostByUser(userid);
            return userPosts;
        } catch (error) {
            throw error;
        }
    }
    async likePost(userid: string, postid: string): Promise<IPostLike> {
        try {
            const isLiked = await this.postRepository.isPostLikedByUser(
                userid,
                postid
            );
            if (!isLiked) {
                const result = await this.postRepository.likePost(userid, postid);
                const post = await this.postRepository.findOne(result.post_id)
                const recipient = post[0].creator_id
                
                const notification: INotification = {
                    sender: userid,
                    recipient: recipient,
                    type: NOTIFICATION_TYPE.POSTLIKE,
                }
                const notifications = await this.notificationUsecase.createNotification(notification)
                

                return result;
            } else {
                throw new Error("Error like not Submitted");
            }
        } catch (error) {
            throw error;
        }
    }
    async unlikePost(userid: string, postid: string): Promise<any> {
        try {
            const isLiked = await this.postRepository.isPostLikedByUser(
                userid,
                postid
            );
            if (isLiked) {
                const result = await this.postRepository.unlikePost(userid, postid);
                return result;
            }

            throw new Error("Error unlike not Submitted");
        } catch (error) {
            throw error;
        }
    }
    async getPosts(userid: string, postid: string | null): Promise<IPost[]> {
        try {
            let posts: IPost[] = [];
            if (postid) {
                posts = await this.postRepository.findOne(postid);
            } else {
                posts = await this.postRepository.findAll();
            }

            const postsWithAllInfo = await Promise.all(
                posts.map(async (post) => {
                    const [isLiked, isFollowing, isSaved, likedUsers,comments] = await Promise.all(
                        [
                            await this.postRepository.isPostLikedByUser(userid, post._id),
                            await this.followRepository.isUserFollowing(
                                userid,
                                post.creator_id
                            ),
                            (await this.postRepository.findSave(userid, post._id))
                                ? true
                                : false,
                            await this.postRepository.getlikedUsers(userid, post._id),
                            await this.commentRepository.getCommentsByPostId(post._id)
                        ]
                    );
                    return { ...post, isLiked, isFollowing, isSaved, likedUsers,comments };
                })
            );

            postsWithAllInfo.forEach((post) => {
                if (post.user?._id.toString() === userid) {
                    post.same_user = true;
                }
            });
  

            return postsWithAllInfo;
        } catch (error) {
            throw error;
        }
    }
    async createPost(data: IPost): Promise<IPost> {
        try {
            const uploadedImages = await Promise.all(
                data.images.map((image) => this.cloudinaryService.uploadImage(image))
            );

            data.images = uploadedImages;
            const post = await this.postRepository.create(data);
            return post;
        } catch (error) {
            throw error;
        }
    }
    editPost(postid: string, caption: string): Promise<IPost> {
        throw new Error("Method not implemented.");
    }
    deletePost(postid: string): Promise<IPost> {
        throw new Error("Method not implemented.");
    }
}
