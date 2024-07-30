import mongoose from "mongoose";
import IComment from "../entities/comment.entity";
import { CommentModel } from "../frameworks/models/comment.model";
import { ICommentRepository } from "../interfaces/repositories/IComment.repository";

export class CommentRepository implements ICommentRepository{
    async getCommentsByPostId(postId: string): Promise<IComment[]> {
        const comments = await CommentModel.aggregate([
            { $match: { post_id: new mongoose.Types.ObjectId(postId) } },
            {$lookup:{
                from:"users",
                localField:"author_id",
                foreignField:"_id",
                as:"user"
            }},
            { $sort: { createdAt: -1 } }, 
          ]);
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