import IConversation from "../../entities/conversation.entity";
import IUser from "../../entities/user.entity";

export interface IConversationRepository{
    createIndividualConversation(members:string[]): Promise<IConversation>
    createGroupConversation(members:string[],groupName: string): Promise<IConversation>
    findAll(userid: string): Promise<IConversation[]>
    findIndividualConversation(member1: string, member2: string): Promise<IConversation | null>
    isUserInConversation(conversationid: string,userid: string): Promise<boolean>
    findOneConversationwithUserDetails(conversationid: string): Promise<IConversation>
    getUsersInConversation(conversationid: string):Promise<IConversation>
    joinToGroup(conversationId: string, memberId: string): Promise<IConversation>
    findById(conversation_id:string): Promise<IConversation | null>
    findByUserId(userId: string): Promise<IConversation[]>
    markAsRead(conversationId: string, userId: string): Promise<void>
    MarkasUnRead(conversationId: string, userId: string): Promise<void>
}