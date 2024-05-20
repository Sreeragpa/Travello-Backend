import IPost from "../../entities/post.entity";

export interface IPostUsecase{
    createPost(data: IPost):Promise<IPost>
    editPost(postid: string, caption: string): Promise<IPost>
    deletePost(postid: string): Promise<IPost>
    getPosts(): Promise<IPost[]>
}

