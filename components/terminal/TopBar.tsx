"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { SECTIONS } from "@/lib/sections";

// Scroll offset below which the hero still owns the viewport, so no section is marked active.
const HERO_CLEAR = 200;

// Nothing listens for this yet — the command palette (a later task) mounts the handler.
// Firing it into the void is harmless and keeps the bar free of palette internals.
function openPalette() {
  window.dispatchEvent(new CustomEvent("palette:open"));
}

export default function TopBar() {
  // The sections only exist on the home page: off it the nav links have to carry a path
  // back to `/`, and there is nothing for the observer to watch.
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState("");

  useEffect(() => {
    if (!onHome) return;
    const sections = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
        else if (window.scrollY < HERO_CLEAR) setActive("");
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((s) => io.observe(s));

    // The observer only fires on threshold crossings, so it never reports the hero coming
    // back into view; clear the active item from a scroll listener instead.
    let frame = 0;
    const clearNearTop = () => {
      frame = 0;
      if (window.scrollY < HERO_CLEAR) setActive("");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(clearNearTop);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    clearNearTop();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [onHome]);

  return (
    <header className="bar bar-top">
      <div className="bar-inner gap-4 text-[13px] max-sm:gap-3">
        <Link
          href="/"
          aria-label={`${site.name} — home`}
          className="flex shrink-0 items-center gap-2 text-fg hover:text-accent"
        >
          <Image src="/logo.png" alt="" width={20} height={20} priority />
          <span aria-hidden className="whitespace-nowrap">
            <span className="max-[860px]:hidden">lucas@portfolio:</span>~<span className="prompt">$</span>
          </span>
        </Link>

        {/* Below 860px this is a swipeable strip rather than a wrapped or truncated list. */}
        <nav aria-label="Main" className="strip flex min-w-0 flex-1 items-center gap-4 max-sm:gap-3">
          {SECTIONS.map((id) => (
            <a
              key={id}
              href={onHome ? `#${id}` : `/#${id}`}
              aria-current={active === id ? "location" : undefined}
              // --muted is only 3.6:1 on the ground, so nav labels take --muted-strong;
              // --muted stays for the hint button, which is a hint and not a destination.
              className={`whitespace-nowrap ${active === id ? "text-pink" : "text-muted-strong hover:text-fg"}`}
            >
              {id}
            </a>
          ))}
        </nav>

        {/* Two buttons, one per breakpoint, because the accessible name differs: the wide
            one is already self-describing, and `>_` needs a spoken label. Only ever one of
            them is displayed, so only one is in the tab order. 860px is where the full
            prompt, all six labels and the wide hint stop fitting on one line. */}
        <button
          type="button"
          onClick={openPalette}
          className="shrink-0 whitespace-nowrap text-muted hover:text-fg max-[860px]:hidden"
        >
          press / for commands
        </button>
        <button
          type="button"
          onClick={openPalette}
          aria-label="Open command palette"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-muted hover:text-fg min-[860px]:hidden"
        >
          <span aria-hidden>&gt;_</span>
        </button>
      </div>
    </header>
  );
}
