import mongoose, { Types } from "mongoose";
const {ObjectId} = Types 
import { IEditTrip, ITrip } from "../../entities/trip.entity";

export interface ITripRepository{
    create(data: ITrip): Promise<ITrip>
    findTripsbyCreatorid(userid: string, creator_id:mongoose.Types.ObjectId[]):Promise<ITrip[]>
    hasUserJoinedTrip(userId: string, tripId: string): Promise<boolean>;
    addMember(memberid: string,tripid: string): Promise<boolean>
    isTripFull(tripId: string): Promise<boolean> 
    count(userid: string): Promise<number>
    findUserTrips(userid: string): Promise<ITrip[]>
    findTripById(userid: string,tripid: string): Promise<ITrip[]>
    findNearbyTrips(userid: string,userLocation: IUserLocation, maxDistance: number): Promise<ITrip[]>
    findOneandUpdate(userid: string,tripid: string,updateFields:Partial<IEditTrip>): Promise<ITrip | null>
    searchTrip(searchKey: string): Promise<ITrip[]>


}


export type IUserLocation = [number,number]