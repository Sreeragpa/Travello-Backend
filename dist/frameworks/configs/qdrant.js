"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQdrantClient = getQdrantClient;
exports.getTripCollectionName = getTripCollectionName;
exports.connectQdrant = connectQdrant;
const js_client_rest_1 = require("@qdrant/js-client-rest");
const trip_model_1 = require("../models/trip.model");
const openaiEmbedding_1 = require("../utils/openaiEmbedding");
const tripVectorHelpers_1 = require("../utils/tripVectorHelpers");
const qdrantUrl = process.env.QDRANT_URL;
const qdrantApiKey = process.env.QDRANT_API_KEY;
const tripCollectionName = process.env.QDRANT_TRIP_COLLECTION || "trips";
const configuredVectorSize = Number(process.env.QDRANT_TRIP_VECTOR_SIZE);
const tripVectorSize = Number.isFinite(configuredVectorSize) && configuredVectorSize > 0
    ? configuredVectorSize
    : (0, openaiEmbedding_1.getExpectedEmbeddingDimensions)(openaiEmbedding_1.defaultEmbeddingModel);
function getRequiredQdrantUrl() {
    if (!qdrantUrl) {
        throw new Error("Qdrant URL is not defined. Make sure to set the QDRANT_URL environment variable.");
    }
    return qdrantUrl;
}
let qdrantClient = null;
function getQdrantClient() {
    if (!qdrantClient) {
        qdrantClient = new js_client_rest_1.QdrantClient({
            url: getRequiredQdrantUrl(),
            apiKey: qdrantApiKey,
        });
    }
    return qdrantClient;
}
function getTripCollectionName() {
    return tripCollectionName;
}
function extractVectorSize(collectionInfo) {
    var _a, _b;
    const vectors = (_b = (_a = collectionInfo === null || collectionInfo === void 0 ? void 0 : collectionInfo.config) === null || _a === void 0 ? void 0 : _a.params) === null || _b === void 0 ? void 0 : _b.vectors;
    if (!vectors)
        return null;
    if (typeof vectors === "number") {
        return vectors;
    }
    if (typeof vectors === "object" && !Array.isArray(vectors) && typeof vectors.size === "number") {
        return vectors.size;
    }
    return null;
}
function seedTripVectors() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const qdrantClient = getQdrantClient();
        const trips = (yield trip_model_1.TripModel.find().lean());
        if (!trips.length) {
            console.log("Qdrant trip seed skipped: no trips found in MongoDB.");
            return;
        }
        let indexed = 0;
        for (const trip of trips) {
            if (!(trip === null || trip === void 0 ? void 0 : trip._id))
                continue;
            const vector = yield (0, openaiEmbedding_1.generateEmbedding)((0, tripVectorHelpers_1.buildTripDocument)(trip));
            if (!vector)
                continue;
            const startingPoint = (0, tripVectorHelpers_1.getGeoPoint)(trip.startingPoint);
            const destination = (0, tripVectorHelpers_1.getGeoPoint)(trip.destination);
            yield qdrantClient.upsert(tripCollectionName, {
                wait: true,
                points: [
                    {
                        id: (0, tripVectorHelpers_1.getPointId)(String(trip._id)),
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
                            destinationName: (_a = trip.destination) === null || _a === void 0 ? void 0 : _a.name,
                            startingPointName: (_b = trip.startingPoint) === null || _b === void 0 ? void 0 : _b.name,
                            startDate: trip.startDate,
                            endDate: trip.endDate,
                            tags: trip.tags || [],
                        },
                    },
                ],
            });
            indexed += 1;
        }
        console.log(`Seeded ${indexed}/${trips.length} trip vectors into Qdrant collection "${tripCollectionName}".`);
    });
}
function ensureTripCollection() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const qdrantClient = getQdrantClient();
        let collectionInfo = null;
        let collectionExists = false;
        try {
            collectionInfo = yield qdrantClient.getCollection(tripCollectionName);
            collectionExists = true;
        }
        catch (error) {
            if ((error === null || error === void 0 ? void 0 : error.status) !== 404) {
                throw error;
            }
        }
        const existingVectorSize = collectionExists ? extractVectorSize(collectionInfo) : null;
        const pointCount = Number((_a = collectionInfo === null || collectionInfo === void 0 ? void 0 : collectionInfo.points_count) !== null && _a !== void 0 ? _a : 0);
        const mismatch = existingVectorSize !== null && existingVectorSize !== tripVectorSize;
        if (!collectionExists || mismatch) {
            if (mismatch) {
                console.warn(`Qdrant collection "${tripCollectionName}" has vector size ${existingVectorSize}, but the app generates ${tripVectorSize}-dimensional embeddings using ${openaiEmbedding_1.defaultEmbeddingModel}. Rebuilding the collection from MongoDB.`);
                yield qdrantClient.deleteCollection(tripCollectionName);
            }
            yield qdrantClient.createCollection(tripCollectionName, {
                vectors: {
                    size: tripVectorSize,
                    distance: "Cosine",
                },
            });
            console.log(`Qdrant collection ready: ${tripCollectionName} (size=${tripVectorSize})`);
            yield seedTripVectors();
            return;
        }
        if (pointCount === 0) {
            console.log(`Qdrant collection "${tripCollectionName}" is empty. Seeding trip vectors from MongoDB.`);
            yield seedTripVectors();
            return;
        }
        console.log(`Qdrant collection ready: ${tripCollectionName} (size=${tripVectorSize}, points=${pointCount})`);
    });
}
function connectQdrant() {
    return __awaiter(this, void 0, void 0, function* () {
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
                yield qdrantClient.getCollections();
                yield ensureTripCollection();
                console.log("Qdrant connected");
                return;
            }
            catch (error) {
                attempt += 1;
                const backoffMs = Math.min(60000, 1000 * 2 ** Math.min(attempt, 6)); // max ~64s then clamp
                console.error(`Failed to connect to Qdrant (attempt ${attempt}). Retrying in ${Math.round(backoffMs / 1000)}s.`, error);
                yield new Promise((resolve) => setTimeout(resolve, backoffMs));
            }
        }
    });
}
