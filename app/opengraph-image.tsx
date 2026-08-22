import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const alt = `${site.name} — software engineer in Toronto`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 96,
          background: "#0B1526",
          color: "#E6ECF5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ width: 120, height: 4, background: "#5AEBCA", marginBottom: 36 }} />
        <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: -1 }}>{site.name}</div>
        <div style={{ fontSize: 32, color: "#8D9BB5", marginTop: 18 }}>
          Software engineer in Toronto · GasMap, WinLane.GG, RocSpace
        </div>
        <div style={{ fontSize: 26, color: "#5AEBCA", marginTop: 48 }}>lucasrocchetti.com</div>
      </div>
    ),
    size
  );
}
