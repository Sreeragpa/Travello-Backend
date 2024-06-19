import mongoose from "mongoose";
import { INotification } from "../../entities/notification.entity";

const NotificationSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Types.ObjectId
    },
    recipient:{
        type: mongoose.Types.ObjectId
    },
    type:{
        type:String,
        enum:["JOINREQUEST","REQUEST","POSTLIKE","FOLLOW"]
    },
    tripid:{
        type: mongoose.Types.ObjectId
    },
    read:{
        type: Boolean,
        default: false
    }
},{ timestamps: true });

export const NotificationModel = mongoose.model<INotification>("notification",NotificationSchema)