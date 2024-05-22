import mongoose from "mongoose";

const postLikeSchema = new mongoose.Schema({
    post_id:{
        type: mongoose.Types.ObjectId, ref: 'Post'
    },
    user_id:{
        type: mongoose.Types.ObjectId, ref: 'Users'
    }
},{timestamps: true});

export const PostLikeModel = mongoose.model('postLikes',postLikeSchema);