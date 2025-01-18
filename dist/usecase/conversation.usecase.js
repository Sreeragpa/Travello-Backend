"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationUsecase = void 0;
class ConversationUsecase {
    constructor(conversationRepository, messageRepository) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
    }
    createGroupConversation(members, groupName) {
        throw new Error("Method not implemented.");
        // const newConversation 
    }
    getConversationByid(userid, conversation_id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let conversation = yield this.conversationRepository.findOneConversationwithUserDetails(conversation_id);
            if (!conversation) {
                return conversation;
            }
            const filteredMemberDetails = (_a = conversation.memberDetails) === null || _a === void 0 ? void 0 : _a.filter((user) => user._id.toString() !== userid);
            return Object.assign(Object.assign({}, conversation), { memberDetails: filteredMemberDetails });
        });
    }
    createConversation(member1, member2) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingConversation = yield this.conversationRepository.findIndividualConversation(member1, member2);
            if (existingConversation) {
                return existingConversation;
            }
            const newConversation = yield this.conversationRepository.createIndividualConversation([member1, member2]);
            return newConversation;
        });
    }
    getAllConversation(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            let conversations = yield this.conversationRepository.findAll(userid);
            //  Filter out the fetching userdetails and fetching last message of conversation
            const conversationsWithLastMessage = yield Promise.all(conversations.map((convo) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const filteredMembers = (_a = convo.memberDetails) === null || _a === void 0 ? void 0 : _a.filter(user => String(user._id) !== userid);
                // const lastMessage = await this.messageRepository.findLastMessage(convo._id as string); 
                return Object.assign(Object.assign({}, convo), { memberDetails: filteredMembers });
            })));
            return conversationsWithLastMessage;
        });
    }
    countUnreadConversations(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversations = yield this.conversationRepository.findByUserId(userId);
            let unreadCount = 0;
            conversations.forEach(conversation => {
                if (conversation.unreadMessage.has(userId) && conversation.unreadMessage.get(userId)) {
                    unreadCount++;
                }
            });
            return unreadCount;
        });
    }
}
exports.ConversationUsecase = ConversationUsecase;
