import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Fixed date, bumped by hand: `new Date()` would claim a fresh change on every build.
const lastModified = new Date("2026-08-22");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/projects`, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];
}
