import mongoose from "mongoose";
import IComment from "../../entities/comment.entity";

const commentSchema = new mongoose.Schema({
    post_id:{
        type:mongoose.Types.ObjectId,
    },
    content:{
        type: String,
    },
    author_id:{
        type: mongoose.Types.ObjectId,
        ref: "Users"
    }

},{timestamps: true})

export const CommentModel = mongoose.model<IComment>("Comments",commentSchema)