import { Redis } from "@upstash/redis";

// The client is cached, but the env is read on every call rather than at module load: at
// import time the route module may be evaluated before the runtime has finished populating
// `process.env`, and reading late costs two property lookups.
//
// `||` rather than `??` on purpose. A defined-but-empty `UPSTASH_REDIS_REST_URL` — easy to
// end up with in a Vercel project that has been wired twice — is not a value, and `??`
// would keep it and skip a perfectly good `KV_*` pair.
function credentials(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

let client: Redis | null = null;
// Set once the credentials have been proven unusable. The environment cannot change under
// a running process, so there is nothing to retry and nothing more to say about it.
let unusable = false;

/**
 * The shared REST client, or null when the store is not usable — whether that is because it
 * was never provisioned or because the credentials it was given are malformed. Never throws.
 */
export function getRedis(): Redis | null {
  if (unusable) return null;
  const creds = credentials();
  if (!creds) return null;
  try {
    // `new Redis()` validates the URL and throws `UrlError` on anything that is not https —
    // notably the `redis://` connection string sitting right next to the REST URL in the
    // Upstash dashboard. Letting that escape would 500 a route whose whole contract is that
    // it always answers 200, so the constructor is treated as fallible like any I/O.
    client ??= new Redis(creds);
  } catch (error) {
    unusable = true;
    console.error("visit counter: unusable Redis credentials", error);
    return null;
  }
  return client;
}
