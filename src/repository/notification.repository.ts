import mongoose, { PipelineStage } from "mongoose";
import { INotification } from "../entities/notification.entity";
import { NotificationModel } from "../frameworks/models/notification.model";
import { INotificationRepository } from "../interfaces/repositories/INotification.repository";

export class NotificationRepository implements INotificationRepository {
    async countByUserid(userid: string): Promise<number> {
        const notificationCount = await NotificationModel.countDocuments({recipient:userid,read: false});
        return notificationCount
    }
    async markasRead(notificationid: string): Promise<INotification | null> {
        const updatedNotification = await NotificationModel.findOneAndUpdate({ _id: notificationid }, { $set: { read: true } })
        return updatedNotification
    }
    async create(data: INotification): Promise<INotification> {
        try {
            const newNotification = new NotificationModel({
                sender: data.sender,
                type: data.type,
                recipient: data.recipient,
                tripid: data.tripid
            })
            const savedNotification = await newNotification.save();
            return savedNotification.toJSON()
        } catch (error) {
            throw error
        }

    }
    async findByUserid(userid: string): Promise<INotification[]> {
        try {
            // const notifications = await NotificationModel.find({recipient:userid});
            const pipeline: PipelineStage[] = [
                {
                    $match: { recipient: new mongoose.Types.ObjectId(userid), read: false }
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
    
     
    
            const notifications = await NotificationModel.aggregate<INotification>(pipeline);

            return notifications;
        } catch (error) {
            throw error
        }
    }

}