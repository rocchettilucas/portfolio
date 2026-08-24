import { Redis } from "@upstash/redis";

// Vercel's Upstash integration writes one of two env pairs depending on when and how the
// store was attached, so both are read. `Redis.fromEnv()` is deliberately avoided: it
// throws when the vars are absent, and absent is the normal state locally and in any build
// that runs before the integration is added.
const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

let client: Redis | null = null;

/** The shared REST client, or null when the store has not been provisioned. */
export function getRedis(): Redis | null {
  if (!url || !token) return null;
  client ??= new Redis({ url, token });
  return client;
}
