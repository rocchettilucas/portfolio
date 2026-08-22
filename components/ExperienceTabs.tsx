"use client";

import { useId, useRef, useState } from "react";
import type { Role } from "@/lib/data";

export default function ExperienceTabs({ roles }: { roles: Role[] }) {
  const [i, setI] = useState(0);
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent) => {
    const n = roles.length;
    let next = i;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % n;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    setI(next);
    tabs.current[next]?.focus();
  };

  const r = roles[i];

  return (
    <div className="grid grid-cols-[200px_1fr] gap-10 max-md:grid-cols-1 max-md:gap-6">
      <div
        role="tablist"
        // Below md the rail lays out horizontally, but both arrow axes move the selection,
        // so the declared orientation stays vertical rather than tracking the breakpoint.
        aria-orientation="vertical"
        aria-label="Employers"
        onKeyDown={onKey}
        className="flex flex-col border-l border-rule max-md:flex-row max-md:overflow-x-auto max-md:border-b max-md:border-l-0"
      >
        {roles.map((role, idx) => (
          <button
            key={role.company}
            ref={(el) => {
              tabs.current[idx] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${idx}`}
            aria-selected={idx === i}
            // Only the selected panel is rendered, so only the selected tab can point at one.
            aria-controls={idx === i ? `${base}-panel-${idx}` : undefined}
            tabIndex={idx === i ? 0 : -1}
            onClick={() => setI(idx)}
            className={`-ml-px border-l-2 px-5 py-3 text-left text-[15px] transition-colors max-md:-mb-px max-md:ml-0 max-md:whitespace-nowrap max-md:border-b-2 max-md:border-l-0 ${
              idx === i
                ? "border-accent bg-[var(--accent-tint)] text-accent"
                : "border-transparent text-muted hover:bg-[var(--accent-tint)] hover:text-accent"
            }`}
          >
            {role.company}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${base}-panel-${i}`}
        aria-labelledby={`${base}-tab-${i}`}
        // A panel whose only link is absent holds nothing focusable, so it takes focus itself.
        tabIndex={r.site ? undefined : 0}
        className="min-h-[260px]"
      >
        <h3 className="text-[22px] font-medium">
          {r.title}{" "}
          <span className="text-accent">
            @{" "}
            {r.site ? (
              <a href={r.site} target="_blank" rel="noopener noreferrer">
                {r.company}
              </a>
            ) : (
              r.company
            )}
          </span>
        </h3>
        <p className="mt-1 mb-5 text-sm text-muted">{r.dates}</p>
        <ul className="space-y-3">
          {r.bullets.map((b) => (
            <li
              key={b}
              className="relative pl-7 text-[16px] leading-relaxed text-muted before:absolute before:left-0 before:text-accent before:content-['▹']"
            >
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
