import Link from "next/link";
import { site, socialHref } from "@/lib/site";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import VisitorCount from "@/components/VisitorCount";

export default function BottomBar() {
  return (
    <footer className="bar bar-bottom">
      <div className="bar-inner justify-between gap-2 text-[11px] text-muted-strong sm:gap-3 sm:text-[12px]">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {/* The dot is decoration: the link beside it already names the site, and a
              second announcement of "site status" would carry no value with it. Below
              640px the link is hidden and only the dot is drawn — the © name in the same
              row still names the site there. */}
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="text-green">
              ●
            </span>
            <Link href="/" className="min-h-6 py-1 text-muted-strong hover:text-fg max-sm:hidden">
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
          <VisitorCount />
          <span className="flex items-center gap-1">
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
          </span>
        </div>
      </div>
    </footer>
  );
}
