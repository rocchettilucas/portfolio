"use client";
import { useRef, useState } from "react";
import Box from "@/components/terminal/Box";
import Section from "@/components/terminal/Section";
import { experience } from "@/lib/data";

/**
 * `experience` — one box holding a list of employers and the panel for whichever is selected.
 * Switching tabs swaps the panel in place: there is no route, no query string and no fade,
 * so the reader can walk three roles without ever leaving the page or waiting on one.
 *
 * 769px is the same breakpoint About uses. Above it the employers stack in a 200px column
 * with a hairline down its right edge and the selected one marked by a 2px bar on its left;
 * below it that column becomes a swipeable row (the nav's `.strip`) and the bar moves to the
 * bottom edge, which is the only place a horizontal tab can carry it.
 */
export default function Experience() {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const role = experience[selected];

  // Both axes are handled regardless of layout: the same buttons are a column above 769px
  // and a row below it, and which arrow a reader reaches for follows what they can see.
  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const last = experience.length - 1;
    let next: number;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        next = selected === last ? 0 : selected + 1;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        next = selected === 0 ? last : selected - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }
    event.preventDefault();
    setSelected(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <Section id="experience" command="experience" label="Experience">
      <Box>
        <div className="grid gap-6 min-[769px]:grid-cols-[200px_1fr] min-[769px]:gap-8">
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="Employers"
            onKeyDown={onKeyDown}
            // `.strip` hides the scrollbar on the phone row; above 769px the row is a column
            // again and the hairline that separated nav items becomes the column's edge.
            className="strip flex min-[769px]:block min-[769px]:overflow-x-visible min-[769px]:border-r min-[769px]:border-border"
          >
            {experience.map((r, i) => (
              <button
                key={r.company}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`exp-tab-${i}`}
                aria-selected={i === selected}
                aria-controls={`exp-panel-${i}`}
                // One stop for the whole list: arrows move between the tabs, Tab leaves them.
                tabIndex={i === selected ? 0 : -1}
                onClick={() => setSelected(i)}
                className={`whitespace-nowrap border-b-2 px-4 py-2 text-left text-[13px] transition-colors duration-200 min-[769px]:border-b-0 min-[769px]:border-l-2 ${
                  i === selected
                    ? "border-accent bg-[var(--accent-tint)] text-accent"
                    : "border-transparent text-muted-strong hover:bg-[var(--accent-tint)] hover:text-fg"
                }`}
              >
                {r.short}
              </button>
            ))}
          </div>

          {/* Only the selected panel is rendered, so the min-height is what keeps the page from
              growing and shrinking under the reader as they move down the list. 228px is the
              tallest of the three at the column's full width: three bullets that each wrap to
              two lines (6 × 24px + two 8px gaps), under the title, the dates and the 16px above
              the list. Below 769px it is dropped — the panel is the only thing under the row
              there, and nothing sits beneath it to be pushed around. */}
          <div
            role="tabpanel"
            id={`exp-panel-${selected}`}
            aria-labelledby={`exp-tab-${selected}`}
            tabIndex={0}
            className="min-w-0 min-[769px]:min-h-[228px]"
          >
            <h3 className="text-[15px] font-bold">
              {role.title}{" "}
              <span className="text-accent">
                @{" "}
                {role.site ? (
                  <a href={role.site} target="_blank" rel="noopener noreferrer" className="text-cyan">
                    {role.company}
                  </a>
                ) : (
                  role.company
                )}
              </span>
            </h3>
            <p className="mt-1 text-muted-strong">{role.dates}</p>
            <ul className="mt-4 grid gap-2">
              {role.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="relative pl-5 before:absolute before:left-0 before:top-0 before:text-accent before:content-['▹']"
                >
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Box>
    </Section>
  );
}
