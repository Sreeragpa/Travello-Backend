import { ITrip } from "../../entities/trip.entity";

export type TripChatLocation = {
  lat?: number;
  lng?: number;
  radius?: number;
};

export interface IAiUsecase {
  tripChat(
    message: string,
    location?: TripChatLocation
  ): Promise<{ reply: string; trips: ITrip[] }>;
}
