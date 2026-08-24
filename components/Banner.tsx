import type { CSSProperties } from "react";
import { banner } from "@/lib/banner";

/**
 * The hero's name, set in figlet block glyphs. The art is decoration — a screen reader
 * would read it as line noise — so the `<pre>` is hidden and the `<h1>` carries the real
 * name for assistive tech and for the document outline.
 *
 * Sizing is a container query, not a viewport one: the banner shrinks to fit whatever
 * column it is dropped into. `--banner-cols` is the glyph width of the block, and the
 * monospace cell advances ~0.6em, so `100cqw / (cols * 0.6)` is the largest font size that
 * still fits the widest row — capped at 14px so it never outgrows the design.
 *
 * The `<pre>` runs on the system monospace rather than JetBrains Mono; see `.banner pre`
 * in globals.css for why the block glyphs cannot use the site font.
 */
export default function Banner() {
  return (
    <h1 className="banner" style={{ "--banner-cols": String(banner.cols) } as CSSProperties}>
      <span className="sr-only">Lucas Rocchetti</span>
      <pre aria-hidden>{banner.words.join("\n")}</pre>
    </h1>
  );
}
