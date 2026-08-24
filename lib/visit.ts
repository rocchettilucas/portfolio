// The visitor counter's decision logic, kept free of both Next and Upstash so the whole
// thing is testable with a five-line fake. The route handler owns the cookie and the
// response; this owns the single question of whether a request is a new visitor.

// The narrow slice of a Redis client the counter needs. `@upstash/redis` satisfies this
// structurally, which is what keeps the network client out of the unit tests.
export type Counter = {
  incr(key: string): Promise<number>;
  get(key: string): Promise<number | null>;
};

export const VISITORS_KEY = "visitors:total";

export type Visit = {
  /** The all-time total, or null when there is nothing to show — the UI hides itself. */
  count: number | null;
  /** True only when this request incremented, i.e. the caller should mark the browser. */
  setCookie: boolean;
};

// A missing counter and a failing counter are the same thing to the caller: no number, no
// cookie, still a 200. The counter is a nice-to-have in a footer; it must never be able to
// take the page down or write a cookie for an increment that did not happen.
const HIDDEN: Visit = { count: null, setCookie: false };

export async function recordVisit(counter: Counter | null, hasCookie: boolean): Promise<Visit> {
  if (!counter) return HIDDEN;
  try {
    if (hasCookie) {
      // A returning browser only reads. `null` means nobody has visited since the key was
      // created, which reads as 0 rather than as a broken counter.
      const count = await counter.get(VISITORS_KEY);
      return { count: count ?? 0, setCookie: false };
    }
    return { count: await counter.incr(VISITORS_KEY), setCookie: true };
  } catch (error) {
    console.error("visit counter unavailable", error);
    return HIDDEN;
  }
}
