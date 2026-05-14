import { ITrip } from "../../entities/trip.entity";

export type TripChatLocation = {
  lat?: number;
  lng?: number;
  radius?: number;
};

export type TripChatContext = {
  userId?: string;
};

export interface IAiUsecase {
  tripChat(
    message: string,
    location?: TripChatLocation,
    context?: TripChatContext
  ): Promise<{ reply: string; trips: ITrip[] }>;
}
