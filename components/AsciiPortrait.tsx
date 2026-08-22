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

/** Paints the portrait once. The image is static: no animation loop, no pointer input. */
function draw(canvas: HTMLCanvasElement, size: AsciiSize) {
  const { fontSize, particles } = DATA[size];
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, size, size);
  ctx.font = `${fontSize}px ui-monospace, Menlo, monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const p of particles) {
    ctx.fillStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${p.a})`;
    ctx.fillText(p.c, p.x, p.y);
  }
}

export default function AsciiPortrait() {
  const ref = useRef<HTMLCanvasElement>(null);
  // Starts at the desktop bucket so the server-rendered canvas is 400×400.
  const [size, setSize] = useState<AsciiSize>(400);

  useEffect(() => {
    let t: number | undefined;
    const update = () => setSize(calculateSize(window.innerWidth));
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

  // The canvas renders at 400 until the first effect measures the viewport; clamping the figure
  // keeps that first frame from overflowing a narrow screen horizontally.
  return (
    <figure className="m-0 flex max-w-full justify-center overflow-hidden">
      <canvas
        ref={ref}
        width={size}
        height={size}
        aria-hidden="true"
        className="block"
        style={{ width: size, height: size }}
      />
      <figcaption className="sr-only">Portrait of Lucas Rocchetti rendered in ASCII characters</figcaption>
    </figure>
  );
}
