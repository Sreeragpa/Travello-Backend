import mongoose from "mongoose";
import { IMessage } from "../entities/conversation.entity";
import { MessageModel } from "../frameworks/models/message.model";
import { IMessageRepository } from "../interfaces/repositories/IMessage.repository";

export class MessageRepository implements IMessageRepository {
    async findLastMessage(conversation_id: string): Promise<IMessage | null> {
        
        const message = await MessageModel.findOne({conversation_id: conversation_id}).sort({ createdAt: -1 });
        return message

    }
    async getMessagesByConversationId(conversation_id: string,userid: string): Promise<IMessage[]> {
        try {
        //    const messages = await MessageModel.find({conversation_id: conversation_id});
           
           const messages = await MessageModel.aggregate([
            {
                $match:{
                    conversation_id: new mongoose.Types.ObjectId(conversation_id)
                }
            },
            {
                $lookup:{
                    from:"users",
                    localField:"sender",
                    foreignField:"_id",
                    as:"senderDetails"
                }
            },
            {
                $unwind: "$senderDetails"
            }
           ])
           return messages
        } catch (error) {
            throw error
        }
    }
    async createMessage(conversation_id: string, senderid: string, text: string): Promise<IMessage> {
        try {
            const newMessage = new MessageModel({
                conversation_id: conversation_id,
                sender: senderid,
                text: text
            });
            

            const savedMessage = await newMessage.save();

            const messageWithSenderDetails = await MessageModel.aggregate([
                {
                    $match: {
                        _id: savedMessage._id
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "sender",
                        foreignField: "_id",
                        as: "senderDetails"
                    }
                },
                {
                    $unwind: "$senderDetails"
                }
            ]);

            if (messageWithSenderDetails.length > 0) {
                return messageWithSenderDetails[0];
            } else {
                throw new Error("Failed to fetch sender details.");
            }

        } catch (error) {
            throw error
        }
    }

}