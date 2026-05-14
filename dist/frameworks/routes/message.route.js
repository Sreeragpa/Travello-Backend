"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_repository_1 = require("../../repository/message.repository");
const message_usecase_1 = require("../../usecase/message.usecase");
const conversation_repository_1 = require("../../repository/conversation.repository");
const message_controller_1 = require("../../controllers/message.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
const messageRepository = new message_repository_1.MessageRepository();
const conversationRepository = new conversation_repository_1.ConversationRepository();
const messageUsecase = new message_usecase_1.MessageUsecase(messageRepository, conversationRepository);
const messageController = new message_controller_1.MessageController(messageUsecase);
router.get('/get-message/:conversationid', auth_middleware_1.authMiddleware, (req, res, next) => {
    messageController.getMessages(req, res, next);
});
router.post('/send-message', auth_middleware_1.authMiddleware, (req, res, next) => {
    messageController.sendMessage(req, res, next);
});
exports.default = router;
