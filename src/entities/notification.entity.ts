import mongoose from "mongoose";
import IUser from "./user.entity";
import { NOTIFICATION_TYPE } from "../enums/notification.enums";

export interface INotification  {
    sender: string;
    recipient: string;
    type: NOTIFICATION_TYPE; // Enum for possible notification types
    tripid?: string;
    read?:boolean
    createdAt?: Date;
    updatedAt?: Date;
    senderDetails?: IUser
    
}
