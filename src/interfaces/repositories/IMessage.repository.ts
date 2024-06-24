import { IMessage } from "../../entities/conversation.entity";

export interface IMessageRepository {
    getMessagesByConversationId(conversation_id: string): Promise<IMessage[] | undefined>
    createMessage(conversation_id: string,senderid: string,text: string): Promise<IMessage>
}