import IConversation from "../entities/conversation.entity";
import { IConversationRepository } from "../interfaces/repositories/IConversation.repositories";
import { IMessageRepository } from "../interfaces/repositories/IMessage.repository";
import { IConversationUsecase } from "../interfaces/usecase/IConversation.usecase";

export class ConversationUsecase implements IConversationUsecase{
    private conversationRepository: IConversationRepository;
    private messageRepository: IMessageRepository
    constructor(conversationRepository: IConversationRepository,messageRepository: IMessageRepository){
        this.conversationRepository = conversationRepository
        this.messageRepository = messageRepository
    }
    createGroupConversation(members: string[], groupName: string): Promise<IConversation[]> {
        throw new Error("Method not implemented.");
        // const newConversation 
    }
    async getConversationByid(userid: string,conversation_id: string): Promise<IConversation> {
        let conversation = await this.conversationRepository.findOneConversationwithUserDetails(conversation_id);
        if(!conversation){
            return conversation
        }
        const filteredMemberDetails = conversation.memberDetails?.filter((user) => user._id.toString() !== userid);


        return {
            ...conversation,
            memberDetails: filteredMemberDetails
        };
    }
    async createConversation(member1: string,member2: string): Promise<IConversation> {
        const existingConversation = await this.conversationRepository.findIndividualConversation(member1,member2);
        if(existingConversation){
            return existingConversation
        }
        
        const newConversation = await this.conversationRepository.createIndividualConversation([member1,member2]);
        return newConversation
    }
    async getAllConversation(userid: string): Promise<any> {
       let conversations =  await this.conversationRepository.findAll(userid);
        //  Filter out the fetching userdetails and fetching last message of conversation
        const conversationsWithLastMessage = await Promise.all(conversations.map(async (convo) => {

            const filteredMembers = convo.memberDetails?.filter(user => String(user._id) !== userid);
    
            // const lastMessage = await this.messageRepository.findLastMessage(convo._id as string); 

          
            return {
                ...convo,
                memberDetails: filteredMembers,
            };
        }));

        
        return conversationsWithLastMessage
    }

    async countUnreadConversations(userId: string): Promise<number> {
        const conversations = await this.conversationRepository.findByUserId(userId);
        let unreadCount = 0;

        conversations.forEach(conversation => {
            if (conversation.unreadMessage.has(userId) && conversation.unreadMessage.get(userId)) {
                unreadCount++;
            }
        });

        return unreadCount;
    }
    
}