import { NextResponse, type NextRequest } from "next/server";
import { getRedis } from "@/lib/redis";
import { recordVisit, type Counter } from "@/lib/visit";

// Every request has to consult the cookie and the live total, so there is nothing here to
// prerender or cache.
export const dynamic = "force-dynamic";

const VISIT_COOKIE = "lr_visited";
const ONE_DAY = 86400;

// `Redis.get` is generic and infers `unknown` without a type argument; pinning it to
// number here is the whole adapter.
function asCounter(redis: ReturnType<typeof getRedis>): Counter | null {
  if (!redis) return null;
  return {
    incr: (key) => redis.incr(key),
    get: (key) => redis.get<number>(key),
  };
}

export async function POST(req: NextRequest) {
  const hasCookie = Boolean(req.cookies.get(VISIT_COOKIE));
  const { count, setCookie } = await recordVisit(asCounter(getRedis()), hasCookie);

  const res = NextResponse.json({ count }, { headers: { "Cache-Control": "no-store" } });
  if (setCookie) {
    // Scoped to this route so it never rides along on page or asset requests, and short
    // enough that the total counts a returning visitor again the next day.
    res.cookies.set({
      name: VISIT_COOKIE,
      value: "1",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/api/visit",
      maxAge: ONE_DAY,
    });
  }
  return res;
}
