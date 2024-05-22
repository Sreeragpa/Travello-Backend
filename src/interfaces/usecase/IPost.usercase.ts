import IPost from "../../entities/post.entity";

export interface IPostUsecase{
    createPost(data: IPost):Promise<IPost>
    editPost(postid: string, caption: string): Promise<IPost>
    deletePost(postid: string): Promise<IPost>
    getPosts(userid: string): Promise<IPost[]>
    likePost(userid: string , postid: string): Promise<any>
    unlikePost(userid: string , postid: string): Promise<any>
}

