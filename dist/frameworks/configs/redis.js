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
exports.markUserOnline = markUserOnline;
exports.refreshUserPresence = refreshUserPresence;
exports.markUserOffline = markUserOffline;
exports.forceUserOffline = forceUserOffline;
exports.isUserOnline = isUserOnline;
exports.getOnlineUserIds = getOnlineUserIds;
const redis_1 = require("redis");
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const PRESENCE_TTL_SECONDS = Number(process.env.PRESENCE_TTL_SECONDS || 60);
let redisClient = null;
let redisConnectPromise = null;
function createRedisClient() {
    const client = (0, redis_1.createClient)({ url: REDIS_URL });
    client.on("error", (error) => {
        console.error("Redis client error:", error);
    });
    client.on("connect", () => {
        console.log("Redis client connected");
    });
    return client;
}
function getRedisClient() {
    return __awaiter(this, void 0, void 0, function* () {
        if (redisClient === null || redisClient === void 0 ? void 0 : redisClient.isOpen) {
            return redisClient;
        }
        if (!redisClient) {
            redisClient = createRedisClient();
        }
        if (!redisConnectPromise) {
            redisConnectPromise = redisClient.connect().then(() => redisClient);
        }
        try {
            return yield redisConnectPromise;
        }
        finally {
            redisConnectPromise = null;
        }
    });
}
function presenceKey(userId) {
    return `presence:user:${userId}`;
}
const onlineUsersKey = "presence:online-users";
function runPresenceOperation(operation, fallback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield getRedisClient();
            return yield operation(client);
        }
        catch (error) {
            console.warn("Presence store unavailable, falling back to in-memory response:", error);
            return fallback;
        }
    });
}
function markUserOnline(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield runPresenceOperation((client) => __awaiter(this, void 0, void 0, function* () {
            const key = presenceKey(userId);
            yield client.multi()
                .hIncrBy(key, "socketCount", 1)
                .hSet(key, "lastSeen", new Date().toISOString())
                .expire(key, PRESENCE_TTL_SECONDS)
                .sAdd(onlineUsersKey, userId)
                .exec();
        }), undefined);
    });
}
function refreshUserPresence(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield runPresenceOperation((client) => __awaiter(this, void 0, void 0, function* () {
            const key = presenceKey(userId);
            const socketCount = Number((yield client.hGet(key, "socketCount")) || 0);
            if (socketCount > 0) {
                yield client.multi()
                    .hSet(key, "lastSeen", new Date().toISOString())
                    .expire(key, PRESENCE_TTL_SECONDS)
                    .sAdd(onlineUsersKey, userId)
                    .exec();
            }
        }), undefined);
    });
}
function markUserOffline(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield runPresenceOperation((client) => __awaiter(this, void 0, void 0, function* () {
            const key = presenceKey(userId);
            const nextCount = Number(yield client.hIncrBy(key, "socketCount", -1));
            if (nextCount <= 0) {
                yield client.multi()
                    .del(key)
                    .sRem(onlineUsersKey, userId)
                    .exec();
                return;
            }
            yield client.multi()
                .hSet(key, "lastSeen", new Date().toISOString())
                .expire(key, PRESENCE_TTL_SECONDS)
                .sAdd(onlineUsersKey, userId)
                .exec();
        }), undefined);
    });
}
function forceUserOffline(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield runPresenceOperation((client) => __awaiter(this, void 0, void 0, function* () {
            yield client.multi()
                .del(presenceKey(userId))
                .sRem(onlineUsersKey, userId)
                .exec();
        }), undefined);
    });
}
function isUserOnline(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return runPresenceOperation((client) => __awaiter(this, void 0, void 0, function* () {
            const key = presenceKey(userId);
            const socketCount = Number((yield client.hGet(key, "socketCount")) || 0);
            return socketCount > 0;
        }), false);
    });
}
function getOnlineUserIds() {
    return __awaiter(this, void 0, void 0, function* () {
        return runPresenceOperation((client) => __awaiter(this, void 0, void 0, function* () {
            const members = yield client.sMembers(onlineUsersKey);
            if (members.length === 0) {
                return [];
            }
            const pipeline = client.multi();
            members.forEach((userId) => {
                pipeline.exists(presenceKey(userId));
            });
            const results = yield pipeline.exec();
            const onlineUserIds = [];
            const staleUserIds = [];
            members.forEach((userId, index) => {
                const existsResult = results === null || results === void 0 ? void 0 : results[index];
                const exists = Array.isArray(existsResult) ? Number(existsResult[1]) : Number(existsResult !== null && existsResult !== void 0 ? existsResult : 0);
                if (exists > 0) {
                    onlineUserIds.push(userId);
                }
                else {
                    staleUserIds.push(userId);
                }
            });
            if (staleUserIds.length > 0) {
                yield client.sRem(onlineUsersKey, staleUserIds);
            }
            return onlineUserIds;
        }), []);
    });
}
