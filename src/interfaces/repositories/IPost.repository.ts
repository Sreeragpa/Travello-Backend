import IPost from "../../entities/post.entity";


export interface IPostRepository {
    create(data: IPost): Promise<IPost>;
    update(id: string, data: Partial<IPost>): Promise<IPost | null>;
    findById(id: string): Promise<IPost | null>;
    findAll(): Promise<IPost[]>;
}