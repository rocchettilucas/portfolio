import Link from "next/link";
import { site } from "@/lib/site";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";

const github = site.socials.find((s) => s.label === "GitHub")!;
const linkedin = site.socials.find((s) => s.label === "LinkedIn")!;

export default function BottomBar() {
  return (
    <footer className="bar bar-bottom">
      <div className="bar-inner justify-between gap-2 text-[11px] text-muted-strong sm:gap-3 sm:text-[12px]">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {/* Below 640px the whole link goes and only the dot survives, so the dot is what
              carries the name — an empty link would be worse than no link. */}
          <span className="flex items-center gap-1.5">
            <span role="img" aria-label="site status" className="text-green">
              ●
            </span>
            <Link href="/" className="text-muted-strong hover:text-fg max-sm:hidden">
              lucasrocchetti.com
            </Link>
          </span>
          {/* Measured: the five items need ~397px of viewport at 11px, so the year is the
              first thing to go on a narrow phone. Below that the name itself ellipsizes
              rather than pushing the bar wider than the screen. */}
          <span className="truncate">
            © {site.name}
            <span className="max-[440px]:hidden"> · {new Date().getFullYear()}</span>
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <span>v{site.version}</span>
          {/* Placeholder only. A later task swaps this span for the <VisitorCount /> client
              component, which starts from this same em dash, fills in the count from
              POST /api/visit, and hides itself when the counter cannot be read. Keep the
              wrapper shape identical so the bar does not shift when it hydrates. */}
          <span>visitors: —</span>
          <span className="flex items-center gap-1">
            <a
              href={github.href}
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-6 w-6 items-center justify-center text-muted-strong hover:text-fg"
            >
              <GitHubIcon width={18} height={18} />
            </a>
            <a
              href={linkedin.href}
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-6 w-6 items-center justify-center text-muted-strong hover:text-fg"
            >
              <LinkedInIcon width={18} height={18} />
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
