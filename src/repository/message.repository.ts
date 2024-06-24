import { IMessage } from "../entities/conversation.entity";
import { MessageModel } from "../frameworks/models/message.model";
import { IMessageRepository } from "../interfaces/repositories/IMessage.repository";

export class MessageRepository implements IMessageRepository {
    async getMessagesByConversationId(conversation_id: string): Promise<IMessage[] | undefined> {
        try {
           const messages = await MessageModel.find({conversation_id: conversation_id});
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
            return savedMessage
        } catch (error) {
            throw error
        }
    }

}