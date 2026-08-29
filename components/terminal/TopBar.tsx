"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ComponentType, type SVGProps } from "react";
import { site, socialHref } from "@/lib/site";
import { SECTIONS } from "@/lib/sections";
import VisitorCount from "@/components/VisitorCount";
import {
  BriefcaseIcon,
  FolderIcon,
  GitHubIcon,
  HomeIcon,
  LinkedInIcon,
  MailIcon,
  UserIcon,
} from "@/components/icons";

// Scroll offset below which the hero still owns the viewport, so no section is marked active.
const HERO_CLEAR = 200;
// Fraction of the viewport height below the top edge where a section counts as reached.
const ACTIVE_LINE = 0.35;

// Keyed by section id, not by position, so SECTIONS can gain or lose an entry without
// touching the render. An id with no glyph falls back to the folder rather than leaving a
// hole where the icon should be — at 900px and up the label carries the meaning either way.
const ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  about: UserIcon,
  work: FolderIcon,
  experience: BriefcaseIcon,
  contact: MailIcon,
};

export default function TopBar() {
  // The sections only exist on the home page: off it the nav links have to carry a path
  // back to `/`, and there is nothing to track.
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState("");
  // Non-zero from a nav click until the scroll it started has settled (see `update`): the
  // id of the timeout that lifts the pin. Time-based rather than event-based because a click
  // on a section already in view starts no scroll at all, and a pin nothing lifts is a bug.
  const pinRef = useRef(0);
  const pin = (ms: number) => {
    window.clearTimeout(pinRef.current);
    pinRef.current = window.setTimeout(() => {
      pinRef.current = 0;
    }, ms);
  };

  useEffect(() => {
    if (!onHome) return;
    const sections = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    // Computed from scroll position, not an IntersectionObserver. An observer callback only
    // carries the entries whose visibility *changed*, so "the most visible section" picked
    // from one callback is really "the section that most recently crossed a threshold" —
    // scrolling down slowly through Experience left Skills marked active the moment its top
    // edge entered the band. Here the active item is simply the last section whose top has
    // scrolled past a line a third of the way down the viewport, which is what a reader's
    // eye calls "the section I'm in".
    let frame = 0;
    const update = () => {
      frame = 0;
      // A click on a nav item is the reader saying where they are; the position rule can
      // disagree with that near the end of the page (two short sections sharing the last
      // screenful), so it stays out of the way until the smooth scroll has finished.
      if (pinRef.current) return;
      if (window.scrollY < HERO_CLEAR) {
        setActive("");
        return;
      }
      // At the end of the document the last section may never reach the line — the page
      // simply cannot scroll that far — so the bottom of the page counts as being in it.
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atEnd && sections.length) {
        setActive(sections[sections.length - 1].id);
        return;
      }
      const line = window.scrollY + window.innerHeight * ACTIVE_LINE;
      let current = "";
      for (const s of sections) {
        if (s.offsetTop <= line) current = s.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (pinRef.current) {
        // Smooth scrolling fires a stream of events; the pin lifts once they stop.
        pin(200);
        return;
      }
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(pinRef.current);
      pinRef.current = 0;
      if (frame) cancelAnimationFrame(frame);
    };
  }, [onHome]);

  return (
    <header className="bar bar-top">
      {/* The gaps are minimums, not the spacing: the nav is `flex-1` and centres itself in
          whatever is left, so a small floor here buys the icon row room on a 390px phone
          without changing how the bar looks anywhere it is not tight. */}
      <div className="bar-inner gap-1 text-[13px] sm:gap-4">
        {/* A plain anchor on purpose: the name is "start over" — a full load of `/`, palette
            closed, typed line reset, counter re-read — where the `home` item beside it only
            scrolls. py-1 takes the 20.8px line box up to a 28.8px target inside a bar whose
            own height is fixed at 40px, so nothing below moves. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a full reload is the point */}
        <a href="/" className="shrink-0 whitespace-nowrap py-1 text-fg hover:text-accent">
          {site.name.toLowerCase()}
        </a>

        {/* Centred, like the reference. `strip` is insurance rather than the layout: the
            labels are hidden below 900px, so this only ever scrolls if a section is added
            to a viewport that was already exactly full. */}
        <nav
          aria-label="Main"
          className="strip flex min-w-0 flex-1 items-center justify-center gap-0.5 sm:gap-1"
        >
          <a
            href={onHome ? "#top" : "/#top"}
            aria-current={onHome && active === "" ? "location" : undefined}
            aria-label="Home"
            className="nav-item whitespace-nowrap"
            onClick={(e) => {
              if (!onHome) return;
              e.preventDefault();
              setActive("");
              pin(700);
              window.scrollTo({ top: 0, behavior: "smooth" });
              if (window.location.hash) history.replaceState(null, "", "/");
            }}
          >
            <HomeIcon width={16} height={16} aria-hidden />
            <span>home</span>
          </a>
          {SECTIONS.map((id) => {
            const Icon = ICONS[id] ?? FolderIcon;
            // The label span is display:none below 900px, so the accessible name has to
            // come from somewhere that survives that. An aria-label identical to the
            // visible text is the one spelling that stays correct at both widths.
            const label = id.charAt(0).toUpperCase() + id.slice(1);
            return (
              <a
                key={id}
                href={onHome ? `#${id}` : `/#${id}`}
                aria-current={active === id ? "location" : undefined}
                onClick={() => {
                  if (!onHome) return;
                  setActive(id);
                  pin(700);
                }}
                aria-label={label}
                className="nav-item whitespace-nowrap"
              >
                <Icon width={16} height={16} aria-hidden />
                <span>{id}</span>
              </a>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 text-muted-strong sm:gap-3">
          {/* The counter is a readout, not a destination, so it gets its own chip and a
              hairline between it and the two links instead of sitting in their row. It is
              ~120px at 12px mono — the one optional item wide enough to push the icon row
              into a scroll on a phone — so it leaves at the same 900px the nav labels do.
              `empty:hidden` because VisitorCount renders nothing when there is no count,
              and an empty chip would still draw its border. */}
          <span className="chip max-[899px]:hidden empty:hidden">
            <VisitorCount />
          </span>
          <span aria-hidden className="h-4 w-px bg-border max-[899px]:hidden" />
          <a
            href={socialHref("GitHub")}
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-6 w-6 items-center justify-center text-muted-strong transition-colors duration-200 hover:text-accent"
          >
            <GitHubIcon width={18} height={18} />
          </a>
          <a
            href={socialHref("LinkedIn")}
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-6 w-6 items-center justify-center text-muted-strong transition-colors duration-200 hover:text-accent"
          >
            <LinkedInIcon width={18} height={18} />
          </a>
          <a
            href={socialHref("Email")}
            aria-label="Email"
            className="inline-flex h-6 w-6 items-center justify-center text-muted-strong transition-colors duration-200 hover:text-accent"
          >
            <MailIcon width={18} height={18} />
          </a>
        </div>
      </div>
    </header>
  );
}
