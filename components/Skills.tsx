"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Cloud, Terminal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { skills } from "@/lib/data";
import Image from "next/image";

// Map to devicon classes, using the "colored" variant for original brand colors
const iconMap: Record<string, string> = {
  python: "devicon-python-plain colored",
  java: "devicon-java-plain colored",
  cplusplus: "devicon-cplusplus-plain colored",
  csharp: "devicon-csharp-plain colored",
  javascript: "devicon-javascript-plain colored",
  typescript: "devicon-typescript-plain colored",
  sql: "devicon-azuresqldatabase-plain colored",
  html5: "devicon-html5-plain colored",
  css3: "devicon-css3-plain colored",
  react: "devicon-react-original colored",
  nodejs: "devicon-nodejs-plain colored",
  fastapi: "devicon-fastapi-plain colored",
  tailwindcss: "devicon-tailwindcss-original colored",
  pandas: "devicon-pandas-plain colored",
  numpy: "devicon-numpy-plain colored",
  scikitlearn: "devicon-scikitlearn-plain colored",
  pytorch: "devicon-pytorch-plain colored",
  git: "devicon-git-plain colored",
  github: "devicon-github-original",
  docker: "devicon-docker-plain colored",
  supabase: "devicon-supabase-plain colored",
  postgresql: "devicon-postgresql-plain colored",
  amazonwebservices: "devicon-amazonwebservices-plain-wordmark colored",
  vercel: "devicon-vercel-original",
  linux: "devicon-linux-plain colored",
  bash: "devicon-bash-plain colored",
  rust: "devicon-rust-original",
  pytest: "devicon-pytest-plain colored",
  macos: "devicon-apple-original",
  windows: "devicon-windows11-original",
};

// Skills without a devicon fall back to a lucide icon
const lucideMap: Record<string, LucideIcon> = {
  cicd: GitBranch,
  render: Cloud,
  unix: Terminal,
};

type Edge = { a: number; b: number };
type Vec = { x: number; y: number };
type Param = { phx: number; phy: number; spx: number; spy: number; amp: number };

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const base = useRef<(Vec | null)[]>([]);
  const params = useRef<Param[]>([]);
  const scales = useRef<number[]>([]);
  const hoveredRef = useRef<number | null>(null);
  const rafRef = useRef(0);

  const [edges, setEdges] = useState<Edge[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hovered, setHovered] = useState<number | null>(null);

  const compute = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    // clear transforms so we measure true layout positions
    chipRefs.current.forEach((el) => {
      if (el) el.style.transform = "none";
    });
    const c = container.getBoundingClientRect();
    setSize({ w: c.width, h: c.height });

    const centers: (Vec | null)[] = chipRefs.current.map((el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left - c.left + r.width / 2, y: r.top - c.top + r.height / 2 };
    });
    base.current = centers;

    if (params.current.length !== skills.length) {
      params.current = skills.map(() => ({
        phx: Math.random() * Math.PI * 2,
        phy: Math.random() * Math.PI * 2,
        spx: 0.0004 + Math.random() * 0.0004,
        spy: 0.0004 + Math.random() * 0.0004,
        amp: 4 + Math.random() * 4,
      }));
      scales.current = skills.map(() => 1);
    }

    const next: Edge[] = [];
    const seen = new Set<string>();
    centers.forEach((center, i) => {
      if (!center) return;
      const neighbors = centers
        .map((o, j) => (o && j !== i ? { j, d: Math.hypot(o.x - center.x, o.y - center.y) } : null))
        .filter((v): v is { j: number; d: number } => v !== null)
        .sort((p, q) => p.d - q.d)
        .slice(0, 2);
      for (const { j } of neighbors) {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) continue;
        seen.add(key);
        next.push({ a: i, b: j });
      }
    });
    setEdges(next);
  }, []);

  // Measure on mount, resize, and after the icon font loads
  useEffect(() => {
    compute();
    const container = containerRef.current;
    const ro = container ? new ResizeObserver(compute) : null;
    if (container && ro) ro.observe(container);
    document.fonts?.ready.then(compute).catch(() => {});
    return () => ro?.disconnect();
  }, [compute]);

  // Animation loop: drift nodes and keep the lines attached
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const offset = (p: Param | undefined, t: number): Vec => {
      if (!p || reduced) return { x: 0, y: 0 };
      return { x: Math.sin(t * p.spx + p.phx) * p.amp, y: Math.cos(t * p.spy + p.phy) * p.amp };
    };

    const tick = () => {
      const t = performance.now();
      const centers = base.current;

      for (let i = 0; i < chipRefs.current.length; i++) {
        const el = chipRefs.current[i];
        if (!el || !centers[i]) continue;
        const o = offset(params.current[i], t);
        const target = hoveredRef.current === i ? 1.12 : 1;
        scales.current[i] = (scales.current[i] ?? 1) + (target - (scales.current[i] ?? 1)) * 0.15;
        el.style.transform = `translate(${o.x.toFixed(2)}px, ${o.y.toFixed(2)}px) scale(${scales.current[i].toFixed(3)})`;
      }

      for (let k = 0; k < edges.length; k++) {
        const ln = lineRefs.current[k];
        const e = edges[k];
        const ba = centers[e.a];
        const bb = centers[e.b];
        if (!ln || !ba || !bb) continue;
        const oa = offset(params.current[e.a], t);
        const ob = offset(params.current[e.b], t);
        ln.setAttribute("x1", (ba.x + oa.x).toFixed(2));
        ln.setAttribute("y1", (ba.y + oa.y).toFixed(2));
        ln.setAttribute("x2", (bb.x + ob.x).toFixed(2));
        ln.setAttribute("y2", (bb.y + ob.y).toFixed(2));
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [edges]);

  const isConnected = (i: number) =>
    hovered !== null &&
    (hovered === i ||
      edges.some((e) => (e.a === hovered && e.b === i) || (e.b === hovered && e.a === i)));

  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4">
            <Image
              src="/memoji/skills.png"
              alt="Memoji with laptop"
              width={320}
              height={320}
              className="w-14 h-14"
              unoptimized
            />
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Skills<span className="text-accent">.</span>
              </h2>
              <p className="text-muted mt-1">Technologies I work with</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
          onMouseLeave={() => {
            hoveredRef.current = null;
            setHovered(null);
          }}
        >
          <svg
            className="pointer-events-none absolute inset-0"
            width={size.w}
            height={size.h}
            aria-hidden
          >
            {edges.map((e, idx) => {
              const active = hovered !== null && (e.a === hovered || e.b === hovered);
              return (
                <line
                  key={idx}
                  ref={(el) => {
                    lineRefs.current[idx] = el;
                  }}
                  stroke="var(--accent)"
                  strokeWidth={1}
                  strokeOpacity={active ? 0.65 : 0.14}
                  style={{ transition: "stroke-opacity 0.2s" }}
                />
              );
            })}
          </svg>

          <div className="relative flex flex-wrap justify-center gap-3 sm:gap-4">
            {skills.map((skill, i) => {
              const FallbackIcon = lucideMap[skill.icon];
              const dim = hovered !== null && !isConnected(i);
              const active = hovered === i;
              return (
                <div
                  key={skill.name}
                  ref={(el) => {
                    chipRefs.current[i] = el;
                  }}
                  onMouseEnter={() => {
                    hoveredRef.current = i;
                    setHovered(i);
                  }}
                  className={`relative z-10 flex cursor-default items-center gap-2.5 rounded-full border bg-card px-4 py-2.5 transition-[border-color,box-shadow,opacity] duration-200 will-change-transform ${
                    active
                      ? "border-accent shadow-lg shadow-accent/20"
                      : "border-card-border hover:border-accent/50"
                  } ${dim ? "opacity-40" : "opacity-100"}`}
                >
                  {FallbackIcon ? (
                    <FallbackIcon size={20} className="text-accent" aria-hidden="true" />
                  ) : (
                    <i className={`${iconMap[skill.icon] || "devicon-devicon-plain"} text-xl`} aria-hidden="true" />
                  )}
                  <span
                    className={`text-[15px] font-medium transition-colors ${
                      active ? "text-foreground" : "text-muted"
                    }`}
                  >
                    {skill.name}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
