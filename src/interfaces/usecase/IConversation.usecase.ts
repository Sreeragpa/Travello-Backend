import IConversation from "../../entities/conversation.entity";

export interface IConversationUsecase{
    getConversationByid(userid: string,conversation_id: string): Promise<IConversation>;
    createConversation(member1:string, member2: string): Promise<IConversation>;
    getAllConversation(userid: string): Promise<IConversation[]>;
    createGroupConversation(members: string[],groupName: string): Promise<IConversation[]>
    countUnreadConversations(userId: string): Promise<number>
}