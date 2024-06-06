import IPost, { ISave } from "../../entities/post.entity";


export interface IPostRepository {
    create(data: IPost): Promise<IPost>;
    update(id: string, data: Partial<IPost>): Promise<IPost | null>;
    findById(id: string): Promise<IPost | null>;
    findAll(): Promise<IPost[]>;    
    findOne(postid: string): Promise<IPost[]>;
    likePost(userid: string, postid: string): Promise<any>;
    unlikePost(userid: string, postid: string): Promise<any>;
    isPostLikedByUser(userid: string, postid: string): Promise<Boolean>;
    findPostByUser(userid: string): Promise<IPost[]>
    savePost(userid: string, postid: string): Promise<ISave>
    unSavePost(userid: string, postid: string): Promise<ISave | null>
    findSavedPost(userid: string): Promise<ISave[] | null>
    findSave(userid: string, postid: string): Promise<ISave | null>
}