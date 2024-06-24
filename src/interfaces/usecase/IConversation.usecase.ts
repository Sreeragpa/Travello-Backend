import IConversation from "../../entities/conversation.entity";

export interface IConversationUsecase{
    getConversation(conversation_id: string): Promise<IConversation>;
    createConversation(member1:string, member2: string): Promise<IConversation>;
    getAllConversation(userid: string): Promise<IConversation[]>
}