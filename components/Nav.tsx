"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

const LINKS = [
  { id: "software", label: "Software" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

// Scroll offset below which the hero still owns the viewport, so no section is marked active.
const HERO_CLEAR = 200;

export default function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!onHome) return;
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
      else if (window.scrollY < HERO_CLEAR) setActive("");
    }, { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] });
    sections.forEach((s) => io.observe(s));

    // The observer only fires on threshold crossings, so it never reports the
    // hero coming back into view; clear the underline from a scroll listener.
    let frame = 0;
    const clearNearTop = () => {
      frame = 0;
      if (window.scrollY < HERO_CLEAR) setActive("");
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(clearNearTop); };
    window.addEventListener("scroll", onScroll, { passive: true });
    clearNearTop();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [onHome]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btnRef.current?.focus(); } };
    // Rotating or resizing past the `md` breakpoint hides the toggle, so close with it.
    const mq = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = () => { if (mq.matches) setOpen(false); };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onBreakpoint);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onBreakpoint);
      document.body.style.overflow = "";
    };
  }, [open]);

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-rule bg-bg/85 backdrop-blur-md">
      <nav aria-label="Main" className="relative mx-auto flex h-full max-w-[1000px] items-center justify-between px-10 max-md:px-5">
        <Link href="/" className="flex items-center gap-2.5 text-[15px] font-medium text-text hover:text-accent" aria-label={`${site.name} — home`}>
          <Image src="/logo.png" alt="" width={32} height={32} priority />
          <span>{site.name}</span>
        </Link>
        <div className="flex items-center gap-6 max-md:hidden">
          {LINKS.map((l) => (
            <a key={l.id} href={href(l.id)} aria-current={active === l.id ? "location" : undefined}
               className={`py-2 text-sm border-b-2 ${active === l.id ? "border-accent text-text" : "border-transparent text-muted hover:text-accent"}`}>
              {l.label}
            </a>
          ))}
          <a href={site.resumePath} target="_blank" rel="noopener noreferrer" className="btn-outline py-1.5">Résumé</a>
        </div>
        <button ref={btnRef} type="button" className="hidden h-11 w-11 items-center justify-center text-text max-md:flex"
                aria-label="Menu" aria-expanded={open}
                // The panel is only in the DOM while open, so the reference only points at it then.
                aria-controls={open ? "mobile-menu" : undefined} onClick={() => setOpen((o) => !o)}>
          <span aria-hidden className="text-2xl leading-none">{open ? "×" : "≡"}</span>
        </button>
        {open && (
          <div id="mobile-menu" className="absolute inset-x-0 top-full border-t border-rule bg-bg px-5 py-4 md:hidden">
            {LINKS.map((l) => (
              <a key={l.id} href={href(l.id)} onClick={() => setOpen(false)} className="block py-3 text-base text-text">{l.label}</a>
            ))}
            <a href={site.resumePath} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="btn-outline mt-2 py-2.5">Résumé</a>
          </div>
        )}
      </nav>
    </header>
  );
}
