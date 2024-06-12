import mongoose from "mongoose";
import { INotification } from "../entities/notification.entity";
import { NotificationModel } from "../frameworks/models/notification.model";
import { INotificationRepository } from "../interfaces/repositories/INotification.repository";

export class NotificationRepository implements INotificationRepository {
    async markasRead(notificationid: string): Promise<INotification | null> {
       const updatedNotification =  await NotificationModel.findOneAndUpdate({_id:notificationid},{$set:{read:true}})
        return updatedNotification
    }
    async create(data: INotification): Promise<INotification> {
      try {
        const newNotification = new NotificationModel({
            sender:data.sender,
            type:data.type,
            recipient: data.recipient,
            tripid: data.tripid
        })
        const savedNotification =  await newNotification.save();
        return savedNotification
      } catch (error) {
        throw error
      }
     
    }
    async findByUserid(userid: string): Promise<INotification[]> {
        try {
            // const notifications = await NotificationModel.find({recipient:userid});
            const notifications = await NotificationModel.aggregate([
                {
                    $match: { recipient: new mongoose.Types.ObjectId(userid),read:false }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "sender",
                        foreignField: "_id",
                        as: "senderDetails"
                    }
                },
                {
                    $unwind: "$senderDetails"
                },
                {
                    $lookup: {
                        from: "trips",
                        localField: "tripid",
                        foreignField: "_id",
                        as: "tripDetails"
                    }
                },{
                    $unwind:"$tripDetails"
                }
              
            ]);
            console.log(notifications);
            
            return notifications;
        } catch (error) {
            throw error
        }
    }

}