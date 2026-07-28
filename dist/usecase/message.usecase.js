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
exports.MessageUsecase = void 0;
const errorCodes_enum_1 = require("../enums/errorCodes.enum");
const socketioHandlers_1 = require("../frameworks/configs/socketioHandlers");
const socket_1 = require("../frameworks/configs/socket");
class MessageUsecase {
    constructor(messageRepository, conversationRepository) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
    }
    sendMessage(userid, conversation_id, text) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const isValid = yield this.conversationRepository.isUserInConversation(conversation_id, userid);
            if (!isValid) {
                throw new Error(errorCodes_enum_1.ErrorCode.CONVERSATION_DOESNOT_EXIST);
            }
            const message = yield this.messageRepository.createMessage(conversation_id, userid, text);
            (_a = (0, socket_1.getSocketIO)()) === null || _a === void 0 ? void 0 : _a.to(conversation_id).emit("message", { status: 'success', data: message });
            const usersinCoversation = yield this.conversationRepository.getUsersInConversation(conversation_id);
            // Update unread message map for all users except the sender
            yield this.conversationRepository.MarkasUnRead(conversation_id, userid);
            // Send Notification to all users in that conversation
            (_b = usersinCoversation.memberDetails) === null || _b === void 0 ? void 0 : _b.forEach((user) => {
                var _a;
                (_a = (0, socket_1.getSocketIO)()) === null || _a === void 0 ? void 0 : _a.to(socketioHandlers_1.userSocketMap[user._id]).emit('newMessageNotification', { conversation_id, message });
            });
            return message;
        });
    }
    getMessages(userid, conversation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Checking whether a conversation exists with userid 
            const isValid = yield this.conversationRepository.isUserInConversation(conversation_id, userid);
            if (!isValid) {
                throw new Error(errorCodes_enum_1.ErrorCode.CONVERSATION_DOESNOT_EXIST);
            }
            const messages = yield this.messageRepository.getMessagesByConversationId(conversation_id, userid);
            // Marking Conversation as Read for User
            yield this.conversationRepository.markAsRead(conversation_id, userid);
            (_a = (0, socket_1.getSocketIO)()) === null || _a === void 0 ? void 0 : _a.to(socketioHandlers_1.userSocketMap[userid]).emit('newMessageNotification', { conversation_id, });
            return messages;
        });
    }
}
exports.MessageUsecase = MessageUsecase;
