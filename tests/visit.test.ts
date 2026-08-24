import { describe, it, expect, vi, afterEach } from "vitest";
import { recordVisit, VISITORS_KEY, type Counter } from "@/lib/visit";

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
