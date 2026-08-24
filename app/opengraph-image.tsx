import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const alt = `${site.name} — software engineer in Toronto`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#1a1b26";
const FG = "#f8f8f2";
const MUTED_STRONG = "#8b98c9";
const BORDER = "rgba(248,248,242,0.12)";
const ACCENT = "#bd93f9";
const PINK = "#ff79c6";
const CYAN = "#8be9fd";
const MONO = "JetBrains Mono";

// Satori reads WOFF (not WOFF2), so the .woff copies from @fontsource are what get
// embedded. Build-time-only read for the prerendered card: no font file is committed
// and nothing here is ever served to a browser.
const FONT_DIR = path.join(
  process.cwd(),
  "node_modules",
  "@fontsource",
  "jetbrains-mono",
  "files"
);

function loadFont(weight: 400 | 700) {
  return readFile(path.join(FONT_DIR, `jetbrains-mono-latin-${weight}-normal.woff`));
}

export default async function OG() {
  const [regular, bold] = await Promise.all([loadFont(400), loadFont(700)]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: BG,
          padding: 48,
          fontFamily: MONO,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: `1px solid ${BORDER}`,
            borderRadius: 4,
            padding: 48,
          }}
        >
          {/* Same prompt the site's own top bar shows. */}
          <div style={{ display: "flex", fontSize: 24, color: FG }}>
            <span>lucas@portfolio:~</span>
            <span style={{ color: PINK }}>$</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 28 }}>
              <span style={{ color: PINK }}>$</span>
              <span style={{ color: ACCENT }}>&nbsp;whoami</span>
            </div>
            <div style={{ fontSize: 64, fontWeight: 700, color: FG, marginTop: 20 }}>
              {site.name}
            </div>
            <div style={{ fontSize: 28, color: MUTED_STRONG, marginTop: 20 }}>
              Software Engineer · Toronto, Canada
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", fontSize: 24, color: CYAN }}>
            lucasrocchetti.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: MONO, data: regular, weight: 400, style: "normal" },
        { name: MONO, data: bold, weight: 700, style: "normal" },
      ],
    }
  );
}
