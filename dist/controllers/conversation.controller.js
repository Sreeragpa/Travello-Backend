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
exports.ConversationController = void 0;
class ConversationController {
    constructor(conversationUsecase) {
        this.conversationUsecase = conversationUsecase;
    }
    getAllConversations(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const result = yield this.conversationUsecase.getAllConversation(user.user_id);
                res.status(200).json({ status: "success", data: result });
            }
            catch (error) {
                next(error);
            }
        });
    }
    createConversation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const member1 = user.user_id;
                const member2 = req.body.member;
                if (!member1 || !member2) {
                    return res.status(400).json({ message: "Members are not Defined" });
                }
                const conversation = yield this.conversationUsecase.createConversation(member1, member2);
                res.status(200).json({ status: "success", data: conversation });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getSingleConversation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const conversationid = req.params.conversationid;
                const conversation = yield this.conversationUsecase.getConversationByid(user.user_id, conversationid);
                conversation.currentUserId = user.user_id;
                res.status(200).json({ status: "success", data: conversation });
            }
            catch (error) {
                next(error);
            }
        });
    }
    countUnreadConversations(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const unreadConversationCount = yield this.conversationUsecase.countUnreadConversations(user.user_id);
                res.status(200).json({ status: "message", data: unreadConversationCount });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ConversationController = ConversationController;
