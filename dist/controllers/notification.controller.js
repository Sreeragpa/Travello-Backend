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
exports.NotificationController = void 0;
const notification_enums_1 = require("../enums/notification.enums");
const server_1 = require("../server");
class NotificationController {
    constructor(notificationUsecase) {
        this.notificationUsecase = notificationUsecase;
    }
    sendNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                console.log(req.body);
                const { recipient, type, tripId } = req.body;
                const sender = user.id;
                const notificationdata = {
                    sender: sender,
                    recipient: recipient,
                    type: notification_enums_1.NOTIFICATION_TYPE.JOINREQUEST,
                    tripid: tripId,
                };
                const data = yield this.notificationUsecase.createNotification(notificationdata);
                const followedUserSocketId = 'userSocketMap[followingid];';
                if (followedUserSocketId) {
                    server_1.io.to(followedUserSocketId).emit("notification", {
                        success: true,
                        data: "result",
                    });
                }
                res.status(201).json({ status: "success", data: data });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const data = yield this.notificationUsecase.getNotificationforUser(user.user_id);
                res.status(200).json({ status: "success", data: data });
            }
            catch (error) {
                next(error);
            }
        });
    }
    markNotificationRead(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { notificationid } = req.body;
                const user = req.user;
                const notification = yield this.notificationUsecase.marksAsRead(notificationid);
                res.status(200).json({ status: "success", data: notification });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getNotificationCount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const count = yield this.notificationUsecase.getNotificationCount(user.user_id);
                res.status(200).json({ status: "success", data: count });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.NotificationController = NotificationController;
