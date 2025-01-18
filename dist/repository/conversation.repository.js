"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const conversation_model_1 = require("../frameworks/models/conversation.model");
class ConversationRepository {
    markAsRead(conversationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversation = yield conversation_model_1.ConversationModel.findById(conversationId);
            if (conversation) {
                const unreadMessageMap = new Map();
                conversation.members.forEach(memberId => {
                    if (memberId.toString() !== userId) {
                        unreadMessageMap.set(memberId.toString(), false);
                    }
                });
                conversation.unreadMessage = unreadMessageMap;
                yield conversation.save();
            }
        });
    }
    findById(conversation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversation = yield conversation_model_1.ConversationModel.findById(conversation_id);
            return conversation;
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield conversation_model_1.ConversationModel.find({ members: userId });
        });
    }
    MarkasUnRead(conversationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversation = yield conversation_model_1.ConversationModel.findById(conversationId);
                if (!conversation) {
                    throw new Error('Conversation not found');
                }
                const unreadMessageMap = new Map();
                conversation.members.forEach(memberId => {
                    if (memberId.toString() !== userId) {
                        unreadMessageMap.set(memberId.toString(), true);
                    }
                });
                conversation.unreadMessage = unreadMessageMap;
                yield conversation.save();
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUsersInConversation(conversationid) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDetails = yield conversation_model_1.ConversationModel.aggregate([
                {
                    $match: { _id: new mongoose_1.default.Types.ObjectId(conversationid) }
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
            ]);
            return userDetails[0];
        });
    }
    findOneConversationwithUserDetails(conversationid) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversation = yield conversation_model_1.ConversationModel.aggregate([
                {
                    $match: { _id: new mongoose_1.default.Types.ObjectId(conversationid) }
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
            return conversation[0];
        });
    }
    isUserInConversation(conversationid, userid) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new mongoose_1.default.Types.ObjectId(userid);
            const conversation = yield conversation_model_1.ConversationModel.findOne({ _id: conversationid, members: { $in: [user] } });
            return !!conversation;
        });
    }
    createGroupConversation(members, groupName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const objectIds = members.map(id => new mongoose_1.default.Types.ObjectId(id));
                const newConversation = new conversation_model_1.ConversationModel({
                    members: objectIds,
                    isGroup: true,
                    groupName: groupName
                });
                const savedConversation = yield newConversation.save();
                return savedConversation;
            }
            catch (error) {
                throw error;
            }
        });
    }
    joinToGroup(conversationId, memberId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const memberObjectId = new mongoose_1.default.Types.ObjectId(memberId);
                const updatedConversation = yield conversation_model_1.ConversationModel.findOneAndUpdate({ _id: conversationId, isGroup: true, members: { $ne: memberObjectId } }, { $push: { members: memberObjectId } }, { new: true });
                if (!updatedConversation) {
                    throw new Error("Conversation not found or member already in the group.");
                }
                return updatedConversation;
            }
            catch (error) {
                throw error;
            }
        });
    }
    createIndividualConversation(members) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const objectIds = members.map(id => new mongoose_1.default.Types.ObjectId(id));
                const newConversation = new conversation_model_1.ConversationModel({
                    members: objectIds
                });
                const savedConversation = yield newConversation.save();
                return savedConversation;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findAll(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversations = yield conversation_model_1.ConversationModel.aggregate([
                    {
                        $match: {
                            members: { $elemMatch: { $eq: new mongoose_1.default.Types.ObjectId(userid) } }
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
                console.log(conversations, "CONVOOO");
                return conversations;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findIndividualConversation(member1, member2) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const member1Id = new mongoose_1.default.Types.ObjectId(member1);
                const member2Id = new mongoose_1.default.Types.ObjectId(member2);
                const conversation = yield conversation_model_1.ConversationModel.findOne({
                    members: {
                        $all: [member1Id, member2Id]
                    },
                    isGroup: false,
                    $expr: { $eq: [{ $size: "$members" }, 2] }
                });
                return conversation;
            }
            catch (error) {
                console.error('Error finding individual conversation:', error);
                throw new Error('Error finding individual conversation');
            }
        });
    }
}
exports.ConversationRepository = ConversationRepository;
