import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Fixed date, bumped by hand: `new Date()` would claim a fresh change on every build.
const lastModified = new Date("2026-08-24");

// Single-page site — v3 folded `/projects` back into the one scrollable page.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url, lastModified, changeFrequency: "monthly", priority: 1 }];
}
