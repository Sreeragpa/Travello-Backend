import mongoose from "mongoose";
import IConversation from "../../entities/conversation.entity";

const conversationSchema = new mongoose.Schema({
    members:[{
        type: mongoose.Types.ObjectId
    }],
    isGroup:{
        type: Boolean,
        default: false
    },
    groupName:{
        type: String
    },
    unreadMessage: {
        type: Map,
        of: Boolean,
        default: {}
    }

},{timestamps: true});

export const ConversationModel = mongoose.model<IConversation>('conversations',conversationSchema)