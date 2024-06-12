import mongoose from "mongoose";
import IFollow from "../../entities/follow.entity";

const FollowSchema = new mongoose.Schema({
    follower_id: { type: mongoose.Types.ObjectId, required: true },
    following_id: { type: mongoose.Types.ObjectId, required: true },

},{timestamps:true})

export const FollowModel = mongoose.model<IFollow>("follows",FollowSchema)