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
      else if (window.scrollY < 200) setActive("");
    }, { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] });
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [onHome]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btnRef.current?.focus(); } };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-rule bg-bg/85 backdrop-blur-md">
      <nav aria-label="Main" className="mx-auto flex h-full max-w-[1000px] items-center justify-between px-10 max-md:px-5">
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
                aria-label="Menu" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
          <span aria-hidden className="text-2xl leading-none">{open ? "×" : "≡"}</span>
        </button>
      </nav>
      {open && (
        <div id="mobile-menu" className="border-t border-rule bg-bg px-5 py-4 md:hidden">
          {LINKS.map((l) => (
            <a key={l.id} href={href(l.id)} onClick={() => setOpen(false)} className="block py-3 text-base text-text">{l.label}</a>
          ))}
          <a href={site.resumePath} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="btn-outline mt-2">Résumé</a>
        </div>
      )}
    </header>
  );
}
