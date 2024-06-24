import IConversation from "../entities/conversation.entity";
import { IConversationRepository } from "../interfaces/repositories/IConversation.repositories";
import { IConversationUsecase } from "../interfaces/usecase/IConversation.usecase";

export class ConversationUsecase implements IConversationUsecase{
    private conversationRepository: IConversationRepository;
    constructor(conversationRepository: IConversationRepository){
        this.conversationRepository = conversationRepository
    }
    getConversation(conversation_id: string): Promise<IConversation> {
        throw new Error("Method not implemented.");
    }
    async createConversation(member1: string,member2: string): Promise<IConversation> {
        const existingConversation = await this.conversationRepository.findIndividualConversation(member1,member1);
        if(existingConversation){
            return existingConversation
        }
        
        const newConversation = await this.conversationRepository.createIndividualConversation([member1,member2]);
        return newConversation
    }
    async getAllConversation(userid: string): Promise<IConversation[]> {
       const conversations =  await this.conversationRepository.findAll(userid);
        return conversations
    }
    
}