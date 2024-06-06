import mongoose from "mongoose";
import { ISave } from "../../entities/post.entity";

const postLikeSchema = new mongoose.Schema({
    post_id:{
        type: mongoose.Types.ObjectId, ref: 'Post'
    },
    user_id:{
        type: mongoose.Types.ObjectId, ref: 'Users'
    }
},{timestamps: true});

export const PostLikeModel = mongoose.model<ISave>('postLikes',postLikeSchema);