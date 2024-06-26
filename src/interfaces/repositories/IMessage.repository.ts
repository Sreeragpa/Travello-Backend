import { IMessage } from "../../entities/conversation.entity";

export interface IMessageRepository {
    getMessagesByConversationId(conversation_id: string,userid: string): Promise<IMessage[]>
    createMessage(conversation_id: string,senderid: string,text: string): Promise<IMessage>
    findLastMessage(conversation_id: string):Promise<IMessage | null>
}