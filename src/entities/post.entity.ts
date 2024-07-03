import { Document } from "mongoose";
import IUser from "./user.entity";

export default interface IPost{
    _id: string,
    creator_id: string,
    trip_id?: string,
    caption: string,
    images: string[],
    location: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
      },
    place: string,
    user?:IUser,
    same_user?:boolean

}

export interface ISave extends Document{
  user_id: string,
  post_id: string | IPost
}

export interface IPostLike {
  post_id: string;
  user_id: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

