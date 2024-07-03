import { Document } from "mongoose";

export default interface IUser extends Document{
    _id: string
    username: string;
    name: string
    email: string;
    hostedTrips?: string[]; 
    posts?: string[]; 
    chats?: string[];
    // followers?: string[]; 
    // following?: string[]; 
    notifications?: string[]; 
    password?: string;
    profileimg?: string;
    bio: string;
    isFollowing:boolean;
    isBlocked: boolean
  }
