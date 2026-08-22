"use client";

import { useEffect, useRef, useState } from "react";
import { calculateSize, type AsciiSize } from "@/lib/ascii-size";
import p400 from "@/lib/ascii/tone_400.json";
import p280 from "@/lib/ascii/tone_280.json";
import p220 from "@/lib/ascii/tone_220.json";

type Particle = { c: string; x: number; y: number; a: number };
type AsciiData = { size: number; fontSize: number; particles: Particle[] };

const DATA: Record<AsciiSize, AsciiData> = { 400: p400, 280: p280, 220: p220 };
const ACCENT = [90, 235, 202] as const; // --accent #5AEBCA
// Owner-requested brightness lift over Gazi's original alphas.
const ALPHA_GAIN = 1.15;

/**
 * Paints the portrait once. The image is static: no animation loop, no pointer input.
 * The CSS box belongs to `.ascii-portrait` in globals.css; this only sizes the backing store.
 */
function draw(canvas: HTMLCanvasElement, size: AsciiSize) {
  const { fontSize, particles } = DATA[size];
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, size, size);
  ctx.font = `${fontSize}px ui-monospace, Menlo, monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const p of particles) {
    ctx.fillStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${Math.min(1, p.a * ALPHA_GAIN)})`;
    ctx.fillText(p.c, p.x, p.y);
  }
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
    if (ref.current) draw(ref.current, size);
  }, [size]);

  return (
    <figure className="m-0 flex justify-center">
      <canvas ref={ref} width={400} height={400} aria-hidden="true" className="ascii-portrait" />
      <figcaption className="sr-only">Portrait of Lucas Rocchetti rendered in ASCII characters</figcaption>
    </figure>
  );
}
