import mongoose from "mongoose";

const FollowSchema = new mongoose.Schema({
    follower_id: { type: String, required: true },
    following_id: { type: String, required: true },

},{timestamps:true})

export const FollowModel = mongoose.model("follows",FollowSchema)