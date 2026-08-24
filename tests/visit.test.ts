import { describe, it, expect, vi, afterEach } from "vitest";
import { recordVisit, VISITORS_KEY, type Counter } from "@/lib/visit";

// `getRedis` is re-imported per case: it caches both the client and the "these credentials
// are unusable" flag at module scope, so the module has to be fresh for each one.
async function loadGetRedis() {
  vi.resetModules();
  return (await import("@/lib/redis")).getRedis;
}

// A stand-in for the Upstash client. `recordVisit` only ever needs INCR and GET, so the
// whole Redis path is exercised here without a live database — the calls array is what
// proves a repeat visit never increments.
function fakeCounter(initial: number) {
  const calls: string[] = [];
  let value = initial;
  const counter: Counter = {
    async incr(key) {
      calls.push(`incr:${key}`);
      value += 1;
      return value;
    },
    async get(key) {
      calls.push(`get:${key}`);
      return value;
    },
  };
  return { counter, calls };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("recordVisit", () => {
  it("increments and asks for a cookie on a first visit", async () => {
    const { counter, calls } = fakeCounter(1203);
    expect(await recordVisit(counter, false)).toEqual({ count: 1204, setCookie: true });
    expect(calls).toEqual([`incr:${VISITORS_KEY}`]);
  });

  it("reads without incrementing when the visitor already has the cookie", async () => {
    const { counter, calls } = fakeCounter(1204);
    expect(await recordVisit(counter, true)).toEqual({ count: 1204, setCookie: false });
    expect(calls).toEqual([`get:${VISITORS_KEY}`]);
  });

  it("reports 0 when the key does not exist yet", async () => {
    const counter: Counter = {
      async incr() {
        throw new Error("should not increment");
      },
      async get() {
        return null;
      },
    };
    expect(await recordVisit(counter, true)).toEqual({ count: 0, setCookie: false });
  });

  it("returns a null count with no counter configured", async () => {
    expect(await recordVisit(null, false)).toEqual({ count: null, setCookie: false });
    expect(await recordVisit(null, true)).toEqual({ count: null, setCookie: false });
  });

  it("swallows a counter failure and logs it once", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const counter: Counter = {
      async incr() {
        throw new Error("upstash down");
      },
      async get() {
        throw new Error("upstash down");
      },
    };
    expect(await recordVisit(counter, false)).toEqual({ count: null, setCookie: false });
    expect(await recordVisit(counter, true)).toEqual({ count: null, setCookie: false });
    expect(error).toHaveBeenCalledTimes(2);
  });
});

describe("getRedis", () => {
  it("returns null when the store is not provisioned", async () => {
    const getRedis = await loadGetRedis();
    for (const key of [
      "UPSTASH_REDIS_REST_URL",
      "UPSTASH_REDIS_REST_TOKEN",
      "KV_REST_API_URL",
      "KV_REST_API_TOKEN",
    ]) {
      vi.stubEnv(key, "");
    }
    expect(getRedis()).toBeNull();
  });

  it("returns null for a URL the client refuses, instead of throwing", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const getRedis = await loadGetRedis();
    // The Upstash dashboard shows a `redis://` connection string next to the REST URL, so
    // this is the pasting mistake most likely to reach production. The client throws
    // `UrlError` on it at construction time — which, uncaught, would 500 every request to
    // a route whose entire contract is that it always answers 200.
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "redis://default:pw@some-host.upstash.io:6379");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");

    expect(getRedis()).toBeNull();
    expect(getRedis()).toBeNull();
    // Once, not once per request — a misconfigured deploy must not flood the logs.
    expect(error).toHaveBeenCalledTimes(1);
  });

  it("falls back to the KV_* pair and reuses one client", async () => {
    const getRedis = await loadGetRedis();
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    vi.stubEnv("KV_REST_API_URL", "https://example.upstash.io");
    vi.stubEnv("KV_REST_API_TOKEN", "token");

    const first = getRedis();
    expect(first).not.toBeNull();
    expect(getRedis()).toBe(first);
  });
});
