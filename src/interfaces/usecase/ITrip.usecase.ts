import { ITrip } from "../../entities/trip.entity";

export interface ITripUsecase{
    createTrip(data: ITrip): Promise<ITrip>
    getTripsbyFollowing(userid: string): Promise<ITrip[]>
}