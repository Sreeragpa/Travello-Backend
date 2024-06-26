import IConversation from "../../entities/conversation.entity";
import IUser from "../../entities/user.entity";

export interface IConversationRepository{
    createIndividualConversation(members:string[]): Promise<IConversation>
    createGroupConversation(members:string[]): Promise<IConversation>
    findAll(userid: string): Promise<IConversation[]>
    findIndividualConversation(member1: string, member2: string): Promise<IConversation | null>
    isUserInConversation(conversationid: string,userid: string): Promise<boolean>
    findOneConversationwithUserDetails(conversationid: string): Promise<IConversation>
    getUsersInConversation(conversationid: string):Promise<IConversation>
}