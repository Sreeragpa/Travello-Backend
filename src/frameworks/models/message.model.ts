import mongoose from "mongoose";
import { IMessage } from "../../entities/conversation.entity";

const messageSchema = new mongoose.Schema({
    conversation_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    sender:{
        type: mongoose.Types.ObjectId,
        required: true
    },
    text:{
        type: String
    }
},{timestamps: true});

export const MessageModel = mongoose.model<IMessage>('messages',messageSchema)