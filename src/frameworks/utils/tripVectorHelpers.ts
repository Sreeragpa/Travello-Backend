import { createHash } from "crypto";
import { ITrip } from "../../entities/trip.entity";

export type TripVectorSource = Pick<
  ITrip,
  "title" | "startingPoint" | "destination" | "description" | "tags"
> & {
  _id?: string;
  creator_id?: string;
  startDate?: Date;
  endDate?: Date;
};

export function buildTripDocument(trip: TripVectorSource) {
  const lines = [
    ["Title", trip.title],
    ["From", trip.startingPoint?.name],
    ["To", trip.destination?.name],
    ["Description", trip.description],
    ["Tags", trip.tags?.join(", ")],
  ];

  return lines
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${String(value).trim()}`)
    .join("\n");
}

export function getPointId(tripId: string) {
  const hash = createHash("sha256").update(tripId).digest("hex");
  const variant = ((parseInt(hash[16], 16) & 0x3) | 0x8).toString(16);

  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    `5${hash.slice(13, 16)}`,
    `${variant}${hash.slice(17, 20)}`,
    hash.slice(20, 32),
  ].join("-");
}

export function getGeoPoint(location?: ITrip["startingPoint"] | ITrip["destination"]) {
  const coordinates = location?.coordinates as any;
  if (!coordinates) return {};

  if (Array.isArray(coordinates.coordinates)) {
    const [lng, lat] = coordinates.coordinates;
    return { lat, lng };
  }

  return {
    lat: coordinates.latitude,
    lng: coordinates.longitude,
  };
}
