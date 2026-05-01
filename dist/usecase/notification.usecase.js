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
exports.NotificationUsecase = void 0;
const server_1 = require("../server");
const socketioHandlers_1 = require("../frameworks/configs/socketioHandlers");
class NotificationUsecase {
    constructor(notificationRepository, userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }
    getNotificationCount(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            const notificationCount = yield this.notificationRepository.countByUserid(userid);
            return notificationCount;
        });
    }
    marksAsRead(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notification = yield this.notificationRepository.markasRead(id);
                return notification;
            }
            catch (error) {
                throw error;
            }
        });
    }
    createNotification(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notification = yield this.notificationRepository.create(data);
                //   Socketio Notification to the recieved User
                const followedUserSocketId = socketioHandlers_1.userSocketMap[data.recipient];
                const { username } = yield this.userRepository.getUsername(data.sender);
                const notificationdata = Object.assign(Object.assign({}, notification), { username });
                if (followedUserSocketId) {
                    server_1.io.to(followedUserSocketId).emit("notification", {
                        success: true,
                        data: notificationdata,
                    });
                }
                return notification;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getNotificationforUser(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifications = yield this.notificationRepository.findByUserid(userid);
                return notifications;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.NotificationUsecase = NotificationUsecase;
