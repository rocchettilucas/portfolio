import { site } from "@/lib/site";

// Static prerender: `new Date()` would freeze at build time anyway, so the year is an
// explicit constant to bump rather than a clock that silently lies.
const YEAR = 2026;

export default function Footer() {
  return (
    <footer className="px-5 pb-10 pt-16 text-center text-sm text-muted">
      <p>Built and designed by {site.name}.</p>
      <p>© {YEAR}</p>
    </footer>
  );
}
