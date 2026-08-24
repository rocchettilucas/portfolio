"use client";

import { useEffect, useRef, useState } from "react";
import { calculateSize, type AsciiSize } from "@/lib/ascii-size";
import { ASCII_TXT } from "@/lib/ascii/tone400";
import p400 from "@/lib/ascii/tone_400.json";
import p280 from "@/lib/ascii/tone_280.json";
import p220 from "@/lib/ascii/tone_220.json";

type Particle = { c: string; x: number; y: number; a: number };
type AsciiData = { size: number; fontSize: number; particles: Particle[] };

const DATA: Record<AsciiSize, AsciiData> = { 400: p400, 280: p280, 220: p220 };
type Rgb = readonly [number, number, number];

const ACCENT_FALLBACK: Rgb = [189, 147, 249]; // --accent #bd93f9
// Owner-requested brightness lift over Gazi's original alphas.
const ALPHA_GAIN = 1.15;

/**
 * The tint comes from the stylesheet, not from a second copy of the palette here: swapping
 * the `--accent-rgb` block in `globals.css` retints the portrait with it. `getComputedStyle`
 * is a layout read, so it happens once for the life of the page (the token is not themed at
 * runtime) rather than on every resize bucket change.
 */
let cachedAccent: Rgb | null = null;

function readAccent(): Rgb {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--accent-rgb");
  const parts = raw.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return ACCENT_FALLBACK;
  return [parts[0], parts[1], parts[2]];
}

function accent(): Rgb {
  cachedAccent ??= readAccent();
  return cachedAccent;
}

// Hover repulsion, tuned at size 400 and scaled by size/400 for the smaller buckets.
const RADIUS = 90; // px around the pointer that reacts
const MAX_PUSH = 14; // px a glyph sitting under the pointer is displaced
const EASE = 0.15; // per-frame approach to the target, position and alpha alike
const SETTLED_PX = 0.05; // closer to home than this and the glyph counts as parked
const SETTLED_ALPHA = 0.003;

/**
 * Builds the per-frame painter. Deliberately `fillText` with an `rgba(accent, a)` fill — the
 * exact call the static-only version made — so the resting frame is byte-identical to it.
 * A pre-rendered glyph atlas + `drawImage` was measured first and rejected: blitting a cell to
 * a fractional destination bilinear-resamples the 7px glyph and the portrait comes out visibly
 * soft (8.5% of subpixels changed, peak delta 96/255). `fillText` needs no such compromise and
 * is nowhere near the bottleneck — the browser caches glyph rasters, so all 1096 calls cost
 * 0.76ms/frame at DPR 2, under 5% of the 16.7ms budget. (`globalAlpha` over an opaque fill is
 * 2x faster again, but rounds differently where glyphs overlap and so loses the exact match.)
 */
function makePainter(
  ctx: CanvasRenderingContext2D,
  size: AsciiSize,
  fontSize: number,
  chars: string[],
  n: number,
  x: Float32Array,
  y: Float32Array,
  a: Float32Array,
  glyph: Uint8Array,
  tint: Rgb,
) {
  ctx.font = `${fontSize}px ui-monospace, Menlo, monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  return () => {
    ctx.clearRect(0, 0, size, size);
    for (let i = 0; i < n; i++) {
      ctx.fillStyle = `rgba(${tint[0]},${tint[1]},${tint[2]},${a[i]})`;
      ctx.fillText(chars[glyph[i]], x[i], y[i]);
    }
  };
}

export default function AsciiPortrait() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState<AsciiSize>(400);

  useEffect(() => {
    let t: number | undefined;
    // clientWidth excludes the scrollbar, so the bucket always agrees with the CSS media queries.
    const update = () => setSize(calculateSize(document.documentElement.clientWidth));
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(update, 150);
    };
    update();
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const { fontSize, particles } = DATA[size];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Flatten the particle objects once. `home` is the resting state the portrait always
    // returns to; `cur` is what actually gets painted.
    const chars = [...new Set(particles.map((p) => p.c))];
    const slot = new Map(chars.map((c, i) => [c, i]));
    const n = particles.length;
    const homeX = new Float32Array(n);
    const homeY = new Float32Array(n);
    const homeA = new Float32Array(n);
    const glyph = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      const p = particles[i];
      homeX[i] = p.x;
      homeY[i] = p.y;
      homeA[i] = Math.min(1, p.a * ALPHA_GAIN);
      glyph[i] = slot.get(p.c) ?? 0;
    }
    const curX = Float32Array.from(homeX);
    const curY = Float32Array.from(homeY);
    const curA = Float32Array.from(homeA);

    const paint = makePainter(ctx, size, fontSize, chars, n, curX, curY, curA, glyph, accent());
    paint();

    // Gate: pointer devices that can actually hover, and only where motion is welcome.
    // Everywhere else the single static draw above is the whole story, exactly as before.
    const hoverable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hoverable || reduced) return;

    const scale = size / 400;
    const radius = RADIUS * scale;
    const push = MAX_PUSH * scale;
    let raf = 0;
    let px = 0;
    let py = 0;
    let inside = false;

    /** Eases every glyph one frame toward its target. Returns true while anything is off home. */
    const advance = () => {
      let moving = false;
      for (let i = 0; i < n; i++) {
        let tx = homeX[i];
        let ty = homeY[i];
        let ta = homeA[i];
        if (inside) {
          const dx = tx - px;
          const dy = ty - py;
          const d = Math.hypot(dx, dy);
          if (d < radius) {
            const f = 1 - d / radius;
            const s = f * f * (3 - 2 * f); // smoothstep, so there is no hard edge at the radius
            if (d > 0.001) {
              tx += (dx / d) * push * s; // pushed radially away from the pointer
              ty += (dy / d) * push * s;
            }
            ta += (1 - ta) * s; // and brightened toward full accent
          }
        }
        const nx = curX[i] + (tx - curX[i]) * EASE;
        const ny = curY[i] + (ty - curY[i]) * EASE;
        const na = curA[i] + (ta - curA[i]) * EASE;
        curX[i] = nx;
        curY[i] = ny;
        curA[i] = na;
        if (
          !moving &&
          (Math.abs(nx - homeX[i]) > SETTLED_PX ||
            Math.abs(ny - homeY[i]) > SETTLED_PX ||
            Math.abs(na - homeA[i]) > SETTLED_ALPHA)
        ) {
          moving = true;
        }
      }
      if (!inside && !moving) {
        // Snap off the last hundredth of a pixel so the resting frame is the original one.
        curX.set(homeX);
        curY.set(homeY);
        curA.set(homeA);
      }
      return moving;
    };

    const tick = () => {
      raf = 0;
      const moving = advance();
      paint();
      // No idle animation: the loop lives only while the pointer is here or things are settling.
      if (inside || moving) raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      // The CSS box is exactly `size`, so client coords map 1:1 onto particle coords.
      const rect = canvas.getBoundingClientRect();
      px = e.clientX - rect.left;
      py = e.clientY - rect.top;
      inside = true;
      wake();
    };
    const onLeave = () => {
      inside = false;
      wake(); // keep running just long enough to ease everything home
    };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointercancel", onLeave);
    return () => {
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointercancel", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [size]);

  return (
    <figure className="m-0 flex justify-center">
      <canvas ref={ref} width={400} height={400} aria-hidden="true" className="ascii-portrait" />
      {/* Inert whenever JS runs — the canvas above is the real portrait then (spec §7).
          Without JS the canvas can never be painted, so it is hidden and the <pre> takes its place. */}
      <noscript>
        <style>{`.ascii-portrait{display:none}`}</style>
        <pre aria-hidden="true" className="ascii-fallback">
          {ASCII_TXT}
        </pre>
      </noscript>
      <figcaption className="sr-only">Portrait of Lucas Rocchetti rendered in ASCII characters</figcaption>
    </figure>
  );
}
