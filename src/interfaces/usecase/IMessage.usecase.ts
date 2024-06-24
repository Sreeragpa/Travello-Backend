import { IMessage } from "../../entities/conversation.entity";

export interface IMessageUsecase{
    getMessages(userid: string, conversation_id: string): Promise<IMessage[]>
}