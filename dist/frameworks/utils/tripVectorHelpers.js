"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTripDocument = buildTripDocument;
exports.getPointId = getPointId;
exports.getGeoPoint = getGeoPoint;
const crypto_1 = require("crypto");
function buildTripDocument(trip) {
    var _a, _b, _c;
    const lines = [
        ["Title", trip.title],
        ["From", (_a = trip.startingPoint) === null || _a === void 0 ? void 0 : _a.name],
        ["To", (_b = trip.destination) === null || _b === void 0 ? void 0 : _b.name],
        ["Description", trip.description],
        ["Tags", (_c = trip.tags) === null || _c === void 0 ? void 0 : _c.join(", ")],
    ];
    return lines
        .filter(([, value]) => value)
        .map(([label, value]) => `${label}: ${String(value).trim()}`)
        .join("\n");
}
function getPointId(tripId) {
    const hash = (0, crypto_1.createHash)("sha256").update(tripId).digest("hex");
    const variant = ((parseInt(hash[16], 16) & 0x3) | 0x8).toString(16);
    return [
        hash.slice(0, 8),
        hash.slice(8, 12),
        `5${hash.slice(13, 16)}`,
        `${variant}${hash.slice(17, 20)}`,
        hash.slice(20, 32),
    ].join("-");
}
function getGeoPoint(location) {
    const coordinates = location === null || location === void 0 ? void 0 : location.coordinates;
    if (!coordinates)
        return {};
    if (Array.isArray(coordinates.coordinates)) {
        const [lng, lat] = coordinates.coordinates;
        return { lat, lng };
    }
    return {
        lat: coordinates.latitude,
        lng: coordinates.longitude,
    };
}
