import { createHash } from "crypto";
import { getQdrantClient, getTripCollectionName } from "../configs/qdrant";
import { ITrip } from "../../entities/trip.entity";
import { generateEmbedding } from "./openaiEmbedding";

type SearchOptions = {
  lat?: number;
  lng?: number;
  radius?: number;
};

function buildTripDocument(trip: ITrip) {
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

function getPointId(tripId: string) {
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

function getGeoPoint(location?: ITrip["startingPoint"]) {
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

export async function upsertTripVector(trip: ITrip): Promise<boolean> {
  if (!trip?._id) return false;

  const vector = await generateEmbedding(buildTripDocument(trip));
  if (!vector) return false;

  const qdrantClient = getQdrantClient();
  const collection = getTripCollectionName();
  const id = String(trip._id);
  const startingPoint = getGeoPoint(trip.startingPoint);
  const destination = getGeoPoint(trip.destination);

  await qdrantClient.upsert(collection, {
    wait: true,
    points: [
      {
        id: getPointId(id),
        vector,
        payload: {
          tripId: id,
          creatorId: String(trip.creator_id),
          title: trip.title,
          description: trip.description,
          startingLat: startingPoint.lat,
          startingLng: startingPoint.lng,
          destinationLat: destination.lat,
          destinationLng: destination.lng,
          destinationName: trip.destination?.name,
          startingPointName: trip.startingPoint?.name,
          startDate: trip.startDate,
          endDate: trip.endDate,
          tags: trip.tags || [],
        },
      },
    ],
  });

  return true;
}

export async function searchTripIdsByText(
  query: string,
  limit = 8,
  options?: SearchOptions
): Promise<string[]> {
  const queryEmbedding = await generateEmbedding(query);
  if (!queryEmbedding) return [];

  let filter: any = undefined;

  if (options?.lat !== undefined && options?.lng !== undefined) {
    const range = options.radius || 1;

    filter = {
      must: [
        {
          key: "startingLat",
          range: {
            gte: options.lat - range,
            lte: options.lat + range,
          },
        },
        {
          key: "startingLng",
          range: {
            gte: options.lng - range,
            lte: options.lng + range,
          },
        },
      ],
    };
  }

  const qdrantClient = getQdrantClient();
  const results = await qdrantClient.search(getTripCollectionName(), {
    vector: queryEmbedding,
    limit,
    ...(filter && { filter }),
  });

  return results
    .map((r: any) => r.payload?.tripId || r.id)
    .filter(Boolean)
    .map((id: any) => String(id));
}
