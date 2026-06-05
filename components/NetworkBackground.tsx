"use client";

import { useEffect, useRef } from "react";

type Pt = { x: number; y: number; vx: number; vy: number };

function hexToRgb(hex: string) {
  const m = hex.replace("#", "").trim().match(/^([0-9a-f]{6})$/i);
  if (!m) return null;
  const int = parseInt(m[1], 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const context = el.getContext("2d");
    if (!context) return;

    const cv: HTMLCanvasElement = el;
    const ctx: CanvasRenderingContext2D = context;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const accentVar = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim();
    const rgb = hexToRgb(accentVar) ?? { r: 59, g: 130, b: 246 };
    const stroke = (a: number) => `rgba(${rgb.r},${rgb.g},${rgb.b},${a})`;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const maxDist = 130;
    const mouseRadius = 170;
    const mouse = { x: -9999, y: -9999 };

    let width = 0;
    let height = 0;
    let nodes: Pt[] = [];
    let raf = 0;

    function resize() {
      const rect = cv.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      cv.width = Math.floor(width * dpr);
      cv.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(90, Math.max(26, Math.floor((width * height) / 16000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, width, height);

      if (!prefersReduced) {
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x <= 0 || n.x >= width) n.vx *= -1;
          if (n.y <= 0 || n.y >= height) n.vy *= -1;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxDist) {
            ctx.strokeStyle = stroke((1 - dist / maxDist) * 0.16);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        const mdx = a.x - mouse.x;
        const mdy = a.y - mouse.y;
        const mdist = Math.hypot(mdx, mdy);
        if (mdist < mouseRadius) {
          ctx.strokeStyle = stroke((1 - mdist / mouseRadius) * 0.45);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        const near = Math.hypot(n.x - mouse.x, n.y - mouse.y) < mouseRadius;
        ctx.fillStyle = stroke(near ? 0.9 : 0.6);
        ctx.beginPath();
        ctx.arc(n.x, n.y, near ? 2.4 : 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    function onMove(e: MouseEvent) {
      const rect = cv.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.x = x >= 0 && x <= width ? x : -9999;
      mouse.y = y >= 0 && y <= height ? y : -9999;
    }

    resize();
    frame();

    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    window.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />;
}
