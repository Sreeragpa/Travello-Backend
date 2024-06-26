import { IMessage } from "../../entities/conversation.entity";

export interface IMessageUsecase{
    getMessages(userid: string, conversation_id: string): Promise<IMessage[]>
    sendMessage(userid: string, conversation_id: string, text: string ): Promise<IMessage>
}