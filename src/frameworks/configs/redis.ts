import { createClient } from "redis";

type RedisClientType = ReturnType<typeof createClient>;

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const PRESENCE_TTL_SECONDS = Number(process.env.PRESENCE_TTL_SECONDS || 60);

let redisClient: RedisClientType | null = null;
let redisConnectPromise: Promise<RedisClientType> | null = null;

function createRedisClient(): RedisClientType {
  const client = createClient({ url: REDIS_URL });

  client.on("error", (error) => {
    console.error("Redis client error:", error);
  });

  client.on("connect", () => {
    console.log("Redis client connected");
  });

  return client;
}

async function getRedisClient(): Promise<RedisClientType> {
  if (redisClient?.isOpen) {
    return redisClient;
  }

  if (!redisClient) {
    redisClient = createRedisClient();
  }

  if (!redisConnectPromise) {
    redisConnectPromise = redisClient.connect().then(() => redisClient as RedisClientType);
  }

  try {
    return await redisConnectPromise;
  } finally {
    redisConnectPromise = null;
  }
}

function presenceKey(userId: string): string {
  return `presence:user:${userId}`;
}

const onlineUsersKey = "presence:online-users";

async function runPresenceOperation<T>(operation: (client: RedisClientType) => Promise<T>, fallback: T): Promise<T> {
  try {
    const client = await getRedisClient();
    return await operation(client);
  } catch (error) {
    console.warn("Presence store unavailable, falling back to in-memory response:", error);
    return fallback;
  }
}

export async function markUserOnline(userId: string): Promise<void> {
  await runPresenceOperation(async (client) => {
    const key = presenceKey(userId);
    await client.multi()
      .hIncrBy(key, "socketCount", 1)
      .hSet(key, "lastSeen", new Date().toISOString())
      .expire(key, PRESENCE_TTL_SECONDS)
      .sAdd(onlineUsersKey, userId)
      .exec();
  }, undefined);
}

export async function refreshUserPresence(userId: string): Promise<void> {
  await runPresenceOperation(async (client) => {
    const key = presenceKey(userId);
    const socketCount = Number(await client.hGet(key, "socketCount") || 0);
    if (socketCount > 0) {
      await client.multi()
        .hSet(key, "lastSeen", new Date().toISOString())
        .expire(key, PRESENCE_TTL_SECONDS)
        .sAdd(onlineUsersKey, userId)
        .exec();
    }
  }, undefined);
}

export async function markUserOffline(userId: string): Promise<void> {
  await runPresenceOperation(async (client) => {
    const key = presenceKey(userId);
    const nextCount = Number(await client.hIncrBy(key, "socketCount", -1));

    if (nextCount <= 0) {
      await client.multi()
        .del(key)
        .sRem(onlineUsersKey, userId)
        .exec();
      return;
    }

    await client.multi()
      .hSet(key, "lastSeen", new Date().toISOString())
      .expire(key, PRESENCE_TTL_SECONDS)
      .sAdd(onlineUsersKey, userId)
      .exec();
  }, undefined);
}

export async function forceUserOffline(userId: string): Promise<void> {
  await runPresenceOperation(async (client) => {
    await client.multi()
      .del(presenceKey(userId))
      .sRem(onlineUsersKey, userId)
      .exec();
  }, undefined);
}

export async function isUserOnline(userId: string): Promise<boolean> {
  return runPresenceOperation(async (client) => {
    const key = presenceKey(userId);
    const socketCount = Number(await client.hGet(key, "socketCount") || 0);
    return socketCount > 0;
  }, false);
}

export async function getOnlineUserIds(): Promise<string[]> {
  return runPresenceOperation(async (client) => {
    const members = await client.sMembers(onlineUsersKey);
    if (members.length === 0) {
      return [];
    }

    const pipeline = client.multi();
    members.forEach((userId) => {
      pipeline.exists(presenceKey(userId));
    });

    const results = await pipeline.exec();
    const onlineUserIds: string[] = [];
    const staleUserIds: string[] = [];

    members.forEach((userId, index) => {
      const existsResult = results?.[index];
      const exists = Array.isArray(existsResult) ? Number(existsResult[1]) : Number(existsResult ?? 0);

      if (exists > 0) {
        onlineUserIds.push(userId);
      } else {
        staleUserIds.push(userId);
      }
    });

    if (staleUserIds.length > 0) {
      await client.sRem(onlineUsersKey, staleUserIds);
    }

    return onlineUserIds;
  }, []);
}
