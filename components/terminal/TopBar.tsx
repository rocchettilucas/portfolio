"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentType, type SVGProps } from "react";
import { site, socialHref } from "@/lib/site";
import { SECTIONS } from "@/lib/sections";
import VisitorCount from "@/components/VisitorCount";
import {
  BriefcaseIcon,
  CodeIcon,
  FolderIcon,
  GitHubIcon,
  GraduationIcon,
  LinkedInIcon,
  MailIcon,
  UserIcon,
} from "@/components/icons";

// Scroll offset below which the hero still owns the viewport, so no section is marked active.
const HERO_CLEAR = 200;

// Keyed by section id, not by position, so SECTIONS can gain or lose an entry without
// touching the render. An id with no glyph falls back to the folder rather than leaving a
// hole where the icon should be — at 900px and up the label carries the meaning either way.
const ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  about: UserIcon,
  projects: FolderIcon,
  experience: BriefcaseIcon,
  skills: CodeIcon,
  education: GraduationIcon,
  contact: MailIcon,
};

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
      {/* The gaps are minimums, not the spacing: the nav is `flex-1` and centres itself in
          whatever is left, so a small floor here buys the icon row room on a 390px phone
          without changing how the bar looks anywhere it is not tight. */}
      <div className="bar-inner gap-1 text-[13px] sm:gap-4">
        <Link
          href="/"
          // py-1 takes the 20.8px line box up to a 28.8px target inside a bar whose own
          // height is fixed at 40px, so nothing below moves.
          className="shrink-0 whitespace-nowrap py-1 text-fg hover:text-accent"
        >
          {site.name.toLowerCase()}
        </Link>

        {/* Centred, like the reference. `strip` is insurance rather than the layout: the
            labels are hidden below 900px, so this only ever scrolls if a section is added
            to a viewport that was already exactly full. */}
        <nav
          aria-label="Main"
          className="strip flex min-w-0 flex-1 items-center justify-center gap-0.5 sm:gap-1"
        >
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
          {/* `visitors: 1,024` is ~117px at 13px mono — the one item in the bar that is
              both optional and wide enough to push the icon row into a scroll on a phone,
              so it leaves at the same 900px the nav labels do. */}
          {/* `empty:hidden` because VisitorCount renders nothing when there is no count to
              show, and a zero-width flex item would still leave its gap behind. */}
          <span className="max-[899px]:hidden empty:hidden">
            <VisitorCount />
          </span>
          <a
            href={socialHref("GitHub")}
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-6 w-6 items-center justify-center text-muted-strong hover:text-fg"
          >
            <GitHubIcon width={18} height={18} />
          </a>
          <a
            href={socialHref("LinkedIn")}
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-6 w-6 items-center justify-center text-muted-strong hover:text-fg"
          >
            <LinkedInIcon width={18} height={18} />
          </a>
        </div>
      </div>
    </header>
  );
}
