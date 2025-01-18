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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const notification_model_1 = require("../frameworks/models/notification.model");
class NotificationRepository {
    countByUserid(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            const notificationCount = yield notification_model_1.NotificationModel.countDocuments({ recipient: userid, read: false });
            return notificationCount;
        });
    }
    markasRead(notificationid) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedNotification = yield notification_model_1.NotificationModel.findOneAndUpdate({ _id: notificationid }, { $set: { read: true } });
            return updatedNotification;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newNotification = new notification_model_1.NotificationModel({
                    sender: data.sender,
                    type: data.type,
                    recipient: data.recipient,
                    tripid: data.tripid
                });
                const savedNotification = yield newNotification.save();
                return savedNotification;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findByUserid(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const notifications = await NotificationModel.find({recipient:userid});
                const pipeline = [
                    {
                        $match: { recipient: new mongoose_1.default.Types.ObjectId(userid), read: false }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'sender',
                            foreignField: '_id',
                            as: 'senderDetails'
                        }
                    },
                    {
                        $unwind: '$senderDetails'
                    },
                    {
                        $addFields: {
                            lookupTrips: { $eq: ['$type', 'JOINREQUEST'] },
                            lookupPosts: { $eq: ['$type', 'POSTLIKE'] }
                        }
                    },
                    {
                        $lookup: {
                            from: 'trips',
                            localField: 'tripid',
                            foreignField: '_id',
                            as: 'tripDetails',
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ['$lookupTrips', true] }
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $unwind: {
                            path: '$tripDetails',
                            preserveNullAndEmptyArrays: true
                        }
                    }
                ];
                const notifications = yield notification_model_1.NotificationModel.aggregate(pipeline);
                return notifications;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.NotificationRepository = NotificationRepository;
