"use client";
import { useEffect, useState } from "react";

// The bottom bar's all-time visitor total. It is a client component for one reason: the
// count has to come from a POST (the request is what increments), which a server component
// cannot make on the reader's behalf without giving up static rendering of the whole page.

type Count = number | null;

// One POST per page load, no matter how many times React mounts this. StrictMode runs
// effects twice in development, and a module-level promise is the only guard that survives
// between those two mounts — a ref or state is recreated with the component. The promise is
// deliberately never cleared: a second mount in the same document should reuse the answer
// rather than count the same reader twice.
let inFlight: Promise<Count> | null = null;

function fetchCount(): Promise<Count> {
  inFlight ??= fetch("/api/visit", { method: "POST", cache: "no-store" })
    .then((res) => (res.ok ? res.json() : null))
    .then((body: { count?: unknown } | null) =>
      typeof body?.count === "number" ? body.count : null,
    )
    // A counter that cannot be read is not an error worth surfacing; the element just
    // disappears, exactly as it does when Redis is not configured at all.
    .catch(() => null);
  return inFlight;
}

export default function VisitorCount() {
  const [count, setCount] = useState<Count | "loading">("loading");

  useEffect(() => {
    let active = true;
    fetchCount().then((value) => {
      if (active) setCount(value);
    });
    return () => {
      active = false;
    };
  }, []);

  // Nothing to show and nothing coming: render no element at all rather than a permanent
  // em dash, so the bar closes the gap instead of advertising a broken counter.
  if (count === null) return null;

  return (
    <span aria-live="off">visitors: {count === "loading" ? "—" : count.toLocaleString("en-CA")}</span>
  );
}
