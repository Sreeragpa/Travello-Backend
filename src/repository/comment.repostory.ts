import IComment from "../entities/comment.entity";
import { CommentModel } from "../frameworks/models/comment.model";
import { ICommentRepository } from "../interfaces/repositories/IComment.repository";

export class CommentRepository implements ICommentRepository{
    async getCommentsByPostId(postId: string): Promise<IComment[]> {
        const comments = await CommentModel.find({post_id:postId})
        return comments
    }
    async createComment(author_id: string, post_id: string, content: string): Promise<IComment> {
        const newComment = new CommentModel({
            author_id:author_id,
            post_id:post_id,
            content: content
        })

        const savedComment = await newComment.save()
        return savedComment
    }

}