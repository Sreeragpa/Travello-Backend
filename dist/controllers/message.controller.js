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
exports.MessageController = void 0;
class MessageController {
    constructor(messageUsecase) {
        this.messageUsecase = messageUsecase;
    }
    getMessages(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const conversationid = req.params.conversationid;
                if (!conversationid) {
                    res.status(400).json({ message: "Invalid Conversationid" });
                }
                const messages = yield this.messageUsecase.getMessages(user.user_id, conversationid);
                res.status(200).json({ status: "message", data: messages });
            }
            catch (error) {
                next(error);
            }
        });
    }
    sendMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const conversationid = req.body.conversationid;
                const text = req.body.text;
                if (!text || !text.trim()) {
                    res.status(400).json({ message: "Empty Message" });
                }
                if (!conversationid) {
                    res.status(400).json({ message: "Invalid Conversationid" });
                }
                const message = yield this.messageUsecase.sendMessage(user.user_id, conversationid, text);
                res.status(200).json({ status: "success", data: message });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.MessageController = MessageController;
