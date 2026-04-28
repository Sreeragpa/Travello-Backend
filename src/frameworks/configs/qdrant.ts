import { QdrantClient } from "@qdrant/js-client-rest";

const qdrantUrl = process.env.QDRANT_URL;
const qdrantApiKey = process.env.QDRANT_API_KEY;
const tripCollectionName = process.env.QDRANT_TRIP_COLLECTION || "trips";
const tripVectorSize = Number(process.env.QDRANT_TRIP_VECTOR_SIZE || 1536);

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

async function ensureTripCollection() {
  const qdrantClient = getQdrantClient();
  const collections = await qdrantClient.getCollections();
  const exists = collections.collections?.some(
    (c) => c.name === tripCollectionName
  );
  if (exists) return;

  await qdrantClient.createCollection(tripCollectionName, {
    vectors: {
      size: tripVectorSize,
      distance: "Cosine",
    },
  });
  console.log(
    `Qdrant collection created: ${tripCollectionName} (size=${tripVectorSize})`
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
