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
exports.upsertTripVector = upsertTripVector;
exports.searchTripIdsByText = searchTripIdsByText;
const qdrant_1 = require("../configs/qdrant");
const openaiEmbedding_1 = require("./openaiEmbedding");
const tripVectorHelpers_1 = require("./tripVectorHelpers");
function upsertTripVector(trip) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        if (!(trip === null || trip === void 0 ? void 0 : trip._id))
            return false;
        const vector = yield (0, openaiEmbedding_1.generateEmbedding)((0, tripVectorHelpers_1.buildTripDocument)(trip));
        if (!vector)
            return false;
        const qdrantClient = (0, qdrant_1.getQdrantClient)();
        const collection = (0, qdrant_1.getTripCollectionName)();
        const id = String(trip._id);
        const startingPoint = (0, tripVectorHelpers_1.getGeoPoint)(trip.startingPoint);
        const destination = (0, tripVectorHelpers_1.getGeoPoint)(trip.destination);
        yield qdrantClient.upsert(collection, {
            wait: true,
            points: [
                {
                    id: (0, tripVectorHelpers_1.getPointId)(id),
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
                        destinationName: (_a = trip.destination) === null || _a === void 0 ? void 0 : _a.name,
                        startingPointName: (_b = trip.startingPoint) === null || _b === void 0 ? void 0 : _b.name,
                        startDate: trip.startDate,
                        endDate: trip.endDate,
                        tags: trip.tags || [],
                    },
                },
            ],
        });
        return true;
    });
}
function searchTripIdsByText(query_1) {
    return __awaiter(this, arguments, void 0, function* (query, limit = 8, options) {
        const queryEmbedding = yield (0, openaiEmbedding_1.generateEmbedding)(query);
        if (!queryEmbedding)
            return [];
        let filter = undefined;
        if ((options === null || options === void 0 ? void 0 : options.lat) !== undefined && (options === null || options === void 0 ? void 0 : options.lng) !== undefined) {
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
        const qdrantClient = (0, qdrant_1.getQdrantClient)();
        const results = yield qdrantClient.search((0, qdrant_1.getTripCollectionName)(), Object.assign({ vector: queryEmbedding, limit }, (filter && { filter })));
        return results
            .map((r) => { var _a; return ((_a = r.payload) === null || _a === void 0 ? void 0 : _a.tripId) || r.id; })
            .filter(Boolean)
            .map((id) => String(id));
    });
}
