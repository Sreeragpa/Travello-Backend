import { INotification } from "../../entities/notification.entity";
import { IEditTrip, ITrip } from "../../entities/trip.entity";
import { IUserLocation } from "../repositories/ITrip.repository";

export interface ITripUsecase{
    createTrip(data: ITrip): Promise<ITrip>
    getTripsbyFollowing(userid: string): Promise<ITrip[]>
    joinTripRequest(data: INotification): Promise<INotification>
    acceptJoinRequest(notificationid: string, creatorid: string,memberid: string, tripid: string): Promise<string>
    getUserTripCount(userid: string): Promise<number>
    getUserTrips(userid: string): Promise<ITrip[]>
    getSingleTrip(userid: string,tripid: string): Promise<ITrip[]>
    getTripsNearby(userid: string,userLocation: IUserLocation, maxDistance: number): Promise<ITrip[]>
    editTrip(userid:string,tripid: string,updateFields:Partial<IEditTrip>): Promise<ITrip>
    searchTrip(searchKey: string): Promise<ITrip[]>
}