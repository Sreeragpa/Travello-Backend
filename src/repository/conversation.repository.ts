import mongoose from "mongoose";
import IConversation from "../entities/conversation.entity";
import { ConversationModel } from "../frameworks/models/conversation.model";
import { IConversationRepository } from "../interfaces/repositories/IConversation.repositories";

export class ConversationRepository implements IConversationRepository {
    async isUserInConversation(conversationid: string, userid: string): Promise<boolean> {
        const user= new mongoose.Types.ObjectId(userid);
        const conversation = await ConversationModel.findOne({_id:conversationid, members: { $in: [user] }});
        return !!conversation
    }
    createGroupConversation(members: string[]): Promise<IConversation> {
        throw new Error("Method not implemented.");
    }
    async createIndividualConversation(members: string[]): Promise<IConversation> {
        try {
                 const objectIds = members.map(id => new mongoose.Types.ObjectId(id));
                 const newConversation = new ConversationModel({
                     members: objectIds
                 });

                 const savedConversation = await newConversation.save();
                 return savedConversation;

        } catch (error) {
            throw error
        }
    }
    async findAll(userid: string): Promise<IConversation[]> {
        try {
            const conversations = await ConversationModel.aggregate([
                {
                    $match: {
                        members: { $elemMatch: { $eq: new mongoose.Types.ObjectId(userid) } }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'members',
                        foreignField: '_id',
                        as: 'memberDetails'
                    }
                }
            ]);
            
            console.log(conversations);

            return conversations
        } catch (error) {
            throw error
        }
    }

    async findIndividualConversation(member1: string, member2: string): Promise<IConversation | null> {
        try {
            const member1Id = new mongoose.Types.ObjectId(member1);
            const member2Id = new mongoose.Types.ObjectId(member2);

            const conversation = await ConversationModel.findOne({
                members: {
                    $all: [member1Id, member2Id]
                },
                isGroup: false,
                $expr: { $eq: [{ $size: "$members" }, 2] }
            });

            return conversation;
        } catch (error) {
            console.error('Error finding individual conversation:', error);
            throw new Error('Error finding individual conversation');
        }
    }

}