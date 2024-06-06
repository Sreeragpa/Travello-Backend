import mongoose from "mongoose";
import { ISave } from "../../entities/post.entity";

const SavesSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Types.ObjectId
    },
    post_id:{
        type:mongoose.Types.ObjectId,
        ref: 'Post'
    }

})

export const SaveModel = mongoose.model<ISave>('saves',SavesSchema)