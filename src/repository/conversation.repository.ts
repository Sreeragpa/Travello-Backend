import mongoose from "mongoose";
import IConversation from "../entities/conversation.entity";
import { ConversationModel } from "../frameworks/models/conversation.model";
import { IConversationRepository } from "../interfaces/repositories/IConversation.repositories";
import IUser from "../entities/user.entity";

export class ConversationRepository implements IConversationRepository {

    async markAsRead(conversationId: string, userId: string): Promise<void> {
        const conversation = await ConversationModel.findById(conversationId);
    
        if (conversation) {
            const unreadMessageMap = new Map<string, boolean>();
    
            conversation.members.forEach(memberId => {
                if (memberId.toString() !== userId) {
                    unreadMessageMap.set(memberId.toString(), false);
                }
            });
    
            conversation.unreadMessage = unreadMessageMap;
            await conversation.save();
        }
    }
    
    async findById(conversation_id: string): Promise<IConversation | null> {
        const conversation = await ConversationModel.findById(conversation_id);
        return conversation
    }
    async findByUserId(userId: string): Promise<IConversation[]> {
        return await ConversationModel.find({ members: userId })
    }
   
    async MarkasUnRead(conversationId: string, userId: string): Promise<void> {
        try {
            const conversation = await ConversationModel.findById(conversationId);
    
            if (!conversation) {
                throw new Error('Conversation not found');
            }
    
            const unreadMessageMap = new Map<string, boolean>();
    
            conversation.members.forEach(memberId => {
                if (memberId.toString() !== userId ) {
                    unreadMessageMap.set(memberId.toString(), true);
                } 
    
            });
    
            conversation.unreadMessage = unreadMessageMap;
            await conversation.save();
        } catch (error) {
            throw error;
        }
    }
    
    async getUsersInConversation(conversationid: string): Promise<IConversation> {
        const userDetails = await ConversationModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(conversationid) }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'members',
                    foreignField: '_id',
                    as: 'memberDetails'
                }
            },
            {
                $project: {
                    "memberDetails._id": 1,
                    "memberDetails.name": 1,
                    "memberDetails.profileimg": 1
                }
            }
        ])        

        return userDetails[0]
    }
    async findOneConversationwithUserDetails(conversationid: string): Promise<IConversation> {
        const conversation = await ConversationModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(conversationid) }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'members',
                    foreignField: '_id',
                    as: 'memberDetails'
                }
            }
        ])

        return conversation[0]
    }
    async isUserInConversation(conversationid: string, userid: string): Promise<boolean> {
        const user = new mongoose.Types.ObjectId(userid);
        const conversation = await ConversationModel.findOne({ _id: conversationid, members: { $in: [user] } });
        return !!conversation
    }
    async createGroupConversation(members: string[], groupName: string): Promise<IConversation> {
        try {
            const objectIds = members.map(id => new mongoose.Types.ObjectId(id));
            const newConversation = new ConversationModel({
                members: objectIds,
                isGroup: true,
                groupName: groupName
            });

            const savedConversation = await newConversation.save();
            return savedConversation;

        } catch (error) {
            throw error;
        }
    }
    async joinToGroup(conversationId: string, memberId: string): Promise<IConversation> {

        try {
            const memberObjectId = new mongoose.Types.ObjectId(memberId);

            const updatedConversation = await ConversationModel.findOneAndUpdate(
                { _id: conversationId, isGroup: true, members: { $ne: memberObjectId } },
                { $push: { members: memberObjectId } },
                { new: true }
            );

            if (!updatedConversation) {
                throw new Error("Conversation not found or member already in the group.");
            }

            return updatedConversation;

        } catch (error) {
            throw error;
        }
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
                },
                {
                    $lookup: {
                        from: 'messages',
                        let: { conversationId: '$_id' },
                        pipeline: [
                            { $match: { $expr: { $eq: ['$conversation_id', '$$conversationId'] } } },
                            { $sort: { createdAt: -1 } },
                            { $limit: 1 }
                        ],
                        as: 'latestMessage'
                    }
                },
                {
                    $unwind: {
                        path: '$latestMessage',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $sort: {
                        'latestMessage.createdAt': -1
                    }
                }
            ]);
    
            console.log(conversations,"CONVOOO");


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