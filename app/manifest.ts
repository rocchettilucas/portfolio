import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Lucas",
    start_url: "/",
    display: "standalone",
    background_color: "#0B1526",
    theme_color: "#0B1526",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
