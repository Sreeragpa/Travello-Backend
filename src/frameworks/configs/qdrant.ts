import { QdrantClient } from "@qdrant/js-client-rest";
import { TripModel } from "../models/trip.model";
import { generateEmbedding, getExpectedEmbeddingDimensions, defaultEmbeddingModel } from "../utils/openaiEmbedding";
import { buildTripDocument, getGeoPoint, getPointId, TripVectorSource } from "../utils/tripVectorHelpers";

const qdrantUrl = process.env.QDRANT_URL;
const qdrantApiKey = process.env.QDRANT_API_KEY;
const tripCollectionName = process.env.QDRANT_TRIP_COLLECTION || "trips";
const configuredVectorSize = Number(process.env.QDRANT_TRIP_VECTOR_SIZE);
const tripVectorSize =
  Number.isFinite(configuredVectorSize) && configuredVectorSize > 0
    ? configuredVectorSize
    : getExpectedEmbeddingDimensions(defaultEmbeddingModel);

function getRequiredQdrantUrl(): string {
  if (!qdrantUrl) {
    throw new Error(
      "Qdrant URL is not defined. Make sure to set the QDRANT_URL environment variable."
    );
  }
  return qdrantUrl;
}

let qdrantClient: QdrantClient | null = null;

export function getQdrantClient() {
  if (!qdrantClient) {
    qdrantClient = new QdrantClient({
      url: getRequiredQdrantUrl(),
      apiKey: qdrantApiKey,
    });
  }

  return qdrantClient;
}

export function getTripCollectionName() {
  return tripCollectionName;
}

function extractVectorSize(collectionInfo: unknown): number | null {
  const vectors = (collectionInfo as any)?.config?.params?.vectors;

  if (!vectors) return null;

  if (typeof vectors === "number") {
    return vectors;
  }

  if (typeof vectors === "object" && !Array.isArray(vectors) && typeof vectors.size === "number") {
    return vectors.size;
  }

  return null;
}

async function seedTripVectors() {
  const qdrantClient = getQdrantClient();
  const trips = (await TripModel.find().lean()) as TripVectorSource[];

  if (!trips.length) {
    console.log("Qdrant trip seed skipped: no trips found in MongoDB.");
    return;
  }

  let indexed = 0;

  for (const trip of trips) {
    if (!trip?._id) continue;

    const vector = await generateEmbedding(buildTripDocument(trip));
    if (!vector) continue;

    const startingPoint = getGeoPoint(trip.startingPoint);
    const destination = getGeoPoint(trip.destination);

    await qdrantClient.upsert(tripCollectionName, {
      wait: true,
      points: [
        {
          id: getPointId(String(trip._id)),
          vector,
          payload: {
            tripId: String(trip._id),
            creatorId: trip.creator_id ? String(trip.creator_id) : undefined,
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

    indexed += 1;
  }

  console.log(
    `Seeded ${indexed}/${trips.length} trip vectors into Qdrant collection "${tripCollectionName}".`
  );
}

async function ensureTripCollection() {
  const qdrantClient = getQdrantClient();
  let collectionInfo: any = null;
  let collectionExists = false;

  try {
    collectionInfo = await qdrantClient.getCollection(tripCollectionName);
    collectionExists = true;
  } catch (error: any) {
    if (error?.status !== 404) {
      throw error;
    }
  }

  const existingVectorSize = collectionExists ? extractVectorSize(collectionInfo) : null;
  const pointCount = Number(collectionInfo?.points_count ?? 0);
  const mismatch = existingVectorSize !== null && existingVectorSize !== tripVectorSize;

  if (!collectionExists || mismatch) {
    if (mismatch) {
      console.warn(
        `Qdrant collection "${tripCollectionName}" has vector size ${existingVectorSize}, but the app generates ${tripVectorSize}-dimensional embeddings using ${defaultEmbeddingModel}. Rebuilding the collection from MongoDB.`
      );
      await qdrantClient.deleteCollection(tripCollectionName);
    }

    await qdrantClient.createCollection(tripCollectionName, {
      vectors: {
        size: tripVectorSize,
        distance: "Cosine",
      },
    });

    console.log(
      `Qdrant collection ready: ${tripCollectionName} (size=${tripVectorSize})`
    );

    await seedTripVectors();
    return;
  }

  if (pointCount === 0) {
    console.log(
      `Qdrant collection "${tripCollectionName}" is empty. Seeding trip vectors from MongoDB.`
    );
    await seedTripVectors();
    return;
  }

  console.log(
    `Qdrant collection ready: ${tripCollectionName} (size=${tripVectorSize}, points=${pointCount})`
  );
}

export async function connectQdrant() {
  if (!qdrantUrl) {
    console.warn("Qdrant disabled: QDRANT_URL is not defined.");
    return;
  }

  let attempt = 0;

  // Startup-only connectivity check + retry loop.
  // This should not crash the process at import-time (only when you actually try to connect).
  while (true) {
    try {
      const qdrantClient = getQdrantClient();
      await qdrantClient.getCollections();
      await ensureTripCollection();
      console.log("Qdrant connected");
      return;
    } catch (error) {
      attempt += 1;
      const backoffMs = Math.min(60_000, 1000 * 2 ** Math.min(attempt, 6)); // max ~64s then clamp
      console.error(
        `Failed to connect to Qdrant (attempt ${attempt}). Retrying in ${Math.round(
          backoffMs / 1000
        )}s.`,
        error
      );
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }
}
