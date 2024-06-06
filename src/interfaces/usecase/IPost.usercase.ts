import IPost, { ISave } from "../../entities/post.entity";

export interface IPostUsecase{
    createPost(data: IPost):Promise<IPost>
    editPost(postid: string, caption: string): Promise<IPost>
    deletePost(postid: string): Promise<IPost>
    getPosts(userid: string,postid: string | null): Promise<IPost[]>
    likePost(userid: string , postid: string): Promise<any>
    unlikePost(userid: string , postid: string): Promise<any>
    getUserPosts(userid: string): Promise<IPost[]>
    savePost(userid: string, postid:string): Promise<ISave | null>
    unsavePost(userid: string, postid:string): Promise<ISave | null>
    getSavedPosts(userid: string): Promise<IPost[] | null>
}

