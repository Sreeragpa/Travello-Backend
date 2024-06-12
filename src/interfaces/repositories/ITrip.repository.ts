import mongoose, { Types } from "mongoose";
const {ObjectId} = Types 
import { ITrip } from "../../entities/trip.entity";

export interface ITripRepository{
    create(data: ITrip): Promise<ITrip>
    findTripsbyCreatorid(userid: string, creator_id:mongoose.Types.ObjectId[]):Promise<ITrip[]>
    hasUserJoinedTrip(userId: string, tripId: string): Promise<boolean>;
    addMember(memberid: string,tripid: string): Promise<boolean>
    isTripFull(tripId: string): Promise<boolean> 
}