export const site = {
  name: "Lucas Rocchetti",
  url: "https://lucasrocchetti.com",
  email: "lucasrocchetti@outlook.com",
  // Rendered by the bottom status bar as `v2.0.0`. Bump it with the site, not the package.
  version: "2.1.0",
  socials: [
    { label: "GitHub", href: "https://github.com/rocchettilucas" },
    { label: "LinkedIn", href: "https://linkedin.com/in/lucasrocchetti" },
    { label: "Email", href: "mailto:lucasrocchetti@outlook.com" },
  ] as const,
  description: "Software engineer in Toronto building apps and developer tools — GasMap, RocSpace, WinLane.GG.",
};

// The hero's typed line, cycled one after another by components/TypedRoles.tsx. Copy lives
// here with the rest of the site's words rather than inside the component that animates it;
// the first entry is what the server renders, so it is also the line seen without JS.
export const ROLES = [
  "Software Engineer",
  "Full-stack developer",
  "Building GasMap",
  "UofT CS grad",
] as const;

export type SocialLabel = (typeof site.socials)[number]["label"];

/**
 * The one lookup into `site.socials`. Every consumer went through its own
 * `find(...)!` before this existed, so a renamed or removed label would have
 * surfaced as `undefined.href` at render time instead of as a clear failure.
 */
export function socialHref(label: SocialLabel): string {
  const social = site.socials.find((s) => s.label === label);
  if (!social) throw new Error(`site.socials has no entry labelled "${label}"`);
  return social.href;
}
