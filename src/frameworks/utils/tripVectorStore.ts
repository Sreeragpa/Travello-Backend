import { getQdrantClient, getTripCollectionName } from "../configs/qdrant";
import { ITrip } from "../../entities/trip.entity";
import { generateEmbedding } from "./openaiEmbedding";
import { buildTripDocument, getGeoPoint, getPointId } from "./tripVectorHelpers";

type SearchOptions = {
  lat?: number;
  lng?: number;
  radius?: number;
};

function toGeoPoint(
  location?: { lat?: number; lng?: number }
): { lat: number; lon: number } | undefined {
  if (
    location?.lat === undefined ||
    location?.lng === undefined ||
    !Number.isFinite(location.lat) ||
    !Number.isFinite(location.lng)
  ) {
    return undefined;
  }

  return {
    lat: location.lat,
    lon: location.lng,
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
  const location = toGeoPoint(startingPoint);

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
          ...(location ? { location } : {}),
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
    const radiusInMeters = (options.radius || 30) * 1000;

    filter = {
      must: [
        {
          key: "location",
          geo_radius: {
            center: {
              lat: options.lat,
              lon: options.lng,
            },
            radius: radiusInMeters,
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
