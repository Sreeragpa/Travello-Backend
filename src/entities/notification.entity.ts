import mongoose from "mongoose";
import IUser from "./user.entity";

export interface INotification  {
    sender: string;
    recipient: string;
    type: "JOINREQUEST" | "REQUEST"; // Enum for possible notification types
    tripid: string;
    read?:boolean
    createdAt?: Date;
    updatedAt?: Date;
    senderDetails?: IUser
    
}
