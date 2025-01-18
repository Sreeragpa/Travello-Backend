"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const conversation_repository_1 = require("../../repository/conversation.repository");
const conversation_usecase_1 = require("../../usecase/conversation.usecase");
const conversation_controller_1 = require("../../controllers/conversation.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const message_repository_1 = require("../../repository/message.repository");
const router = express_1.default.Router();
const conversationRepository = new conversation_repository_1.ConversationRepository();
const messageRepository = new message_repository_1.MessageRepository();
const conversationUsecase = new conversation_usecase_1.ConversationUsecase(conversationRepository, messageRepository);
const conversationController = new conversation_controller_1.ConversationController(conversationUsecase);
router.get('/get-conversation', auth_middleware_1.authMiddleware, (req, res, next) => {
    conversationController.getAllConversations(req, res, next);
});
router.post('/add-conversation', auth_middleware_1.authMiddleware, (req, res, next) => {
    conversationController.createConversation(req, res, next);
});
router.get('/get-conversation/:conversationid', auth_middleware_1.authMiddleware, (req, res, next) => {
    conversationController.getSingleConversation(req, res, next);
});
router.get('/unread-conversation/count', auth_middleware_1.authMiddleware, (req, res, next) => {
    conversationController.countUnreadConversations(req, res, next);
});
exports.default = router;
