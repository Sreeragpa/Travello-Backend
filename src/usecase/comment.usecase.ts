import IComment from "../entities/comment.entity";
import { ICommentRepository } from "../interfaces/repositories/IComment.repository";
import { ICommentUsecase } from "../interfaces/usecase/IComment.usecase";

export class CommentUsecase implements ICommentUsecase{
    private commentRepository: ICommentRepository
    constructor(commentRepository: ICommentRepository){
        this.commentRepository = commentRepository
    }
    async getAllComments(post_id: string): Promise<IComment[]> {
      return await this.commentRepository.getCommentsByPostId(post_id)
    }
    async createComment(author_id: string, post_id: string, content: string): Promise<IComment> {
        
        return await this.commentRepository.createComment(author_id,post_id,content)
    }
}