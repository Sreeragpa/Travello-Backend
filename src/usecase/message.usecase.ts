import { IMessage } from "../entities/conversation.entity";
import { ErrorCode } from "../enums/errorCodes.enum";
import { userSocketMap } from "../frameworks/configs/socketioHandlers";
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

         // Update unread message map for all users except the sender

        await this.conversationRepository.MarkasUnRead(conversation_id, userid);



        // Send Notification to all users in that conversation
            usersinCoversation.memberDetails?.forEach((user)=>{
                io.to( userSocketMap[user._id]).emit('newMessageNotification', { conversation_id, message });
            })
            
        return message

    }

    async getMessages(userid: string, conversation_id: string): Promise<IMessage[]> {
            // Checking whether a conversation exists with userid 
            const isValid = await this.conversationRepository.isUserInConversation(conversation_id,userid);
            
            if(!isValid){
                throw new Error(ErrorCode.CONVERSATION_DOESNOT_EXIST)
            }
     

            const messages = await this.messageRepository.getMessagesByConversationId(conversation_id,userid);
            // Marking Conversation as Read for User
            await this.conversationRepository.markAsRead(conversation_id as string, userid);
            io.to( userSocketMap[userid]).emit('newMessageNotification', { conversation_id, });
            return messages;
    }


    
}