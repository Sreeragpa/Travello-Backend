import { INotification } from "../../entities/notification.entity";
import { ITrip } from "../../entities/trip.entity";

export interface ITripUsecase{
    createTrip(data: ITrip): Promise<ITrip>
    getTripsbyFollowing(userid: string): Promise<ITrip[]>
    joinTripRequest(data: INotification): Promise<INotification>
    acceptJoinRequest(notificationid: string, creatorid: string,memberid: string, tripid: string): Promise<string>
}