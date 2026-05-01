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
exports.MessageRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const message_model_1 = require("../frameworks/models/message.model");
class MessageRepository {
    findLastMessage(conversation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield message_model_1.MessageModel.findOne({ conversation_id: conversation_id }).sort({ createdAt: -1 });
            return message;
        });
    }
    getMessagesByConversationId(conversation_id, userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //    const messages = await MessageModel.find({conversation_id: conversation_id});
                const messages = yield message_model_1.MessageModel.aggregate([
                    {
                        $match: {
                            conversation_id: new mongoose_1.default.Types.ObjectId(conversation_id)
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
                return messages;
            }
            catch (error) {
                throw error;
            }
        });
    }
    createMessage(conversation_id, senderid, text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newMessage = new message_model_1.MessageModel({
                    conversation_id: conversation_id,
                    sender: senderid,
                    text: text
                });
                const savedMessage = yield newMessage.save();
                const messageWithSenderDetails = yield message_model_1.MessageModel.aggregate([
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
                }
                else {
                    throw new Error("Failed to fetch sender details.");
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.MessageRepository = MessageRepository;
