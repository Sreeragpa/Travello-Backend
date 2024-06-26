import { IMessage } from "../entities/conversation.entity";
import { ErrorCode } from "../enums/errorCodes.enum";
import { IConversationRepository } from "../interfaces/repositories/IConversation.repositories";
import { IMessageRepository } from "../interfaces/repositories/IMessage.repository";
import { IMessageUsecase } from "../interfaces/usecase/IMessage.usecase";
import { io } from "../server";
export class MessageUsecase implements IMessageUsecase{
    private messageRepository:IMessageRepository
    private conversationRepository: IConversationRepository
    constructor(messageRepository: IMessageRepository,conversationRepository: IConversationRepository){
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
    }
    async sendMessage(userid: string, conversation_id: string,text: string): Promise<IMessage> {
        const isValid = await this.conversationRepository.isUserInConversation(conversation_id,userid);
        if(!isValid){
            throw new Error(ErrorCode.CONVERSATION_DOESNOT_EXIST)
        }
        const message = await this.messageRepository.createMessage(conversation_id,userid,text);
        io.to(conversation_id).emit("message", { status: 'success', data: message });
        const usersinCoversation = await this.conversationRepository.getUsersInConversation(conversation_id);
            // if(usersinCoversation?.memberDetails){
            //     const users= usersinCoversation.memberDetails
            //     for (const user of users) {
            //         this.server.to(user._id).emit('newMessageCount', newMessageCount);
            //       }
            
            // }
        return message

    }

    async getMessages(userid: string, conversation_id: string): Promise<IMessage[]> {
            // Checking whether a conversation exists with userid 
            const isValid = await this.conversationRepository.isUserInConversation(conversation_id,userid);
            
            if(!isValid){
                throw new Error(ErrorCode.CONVERSATION_DOESNOT_EXIST)
            }

            const messages = await this.messageRepository.getMessagesByConversationId(conversation_id,userid);
            return messages;
    }


    
}