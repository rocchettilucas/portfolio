import Image from "next/image";
import Box from "@/components/terminal/Box";
import { ExternalIcon, FolderIcon, GitHubIcon } from "@/components/icons";
import type { Project } from "@/lib/data";

/**
 * One directory in the `ls ~/projects` listing. The card itself is not a link — there is no
 * project page to send anyone to — so only the two icons in the corner are interactive, at
 * 24px targets around 20px glyphs.
 *
 * `grid-rows-[auto_1fr]` is what lets the tech line sit at the bottom of every card in a row
 * regardless of how long the blurb ran: it hands Box's body the leftover height, and the
 * column inside pushes that last line down with `mt-auto`.
 */
export default function ProjectCard({ project }: { project: Project }) {
  const { slug, title, blurb, tech, links, logo } = project;
  return (
    <Box
      title={`${slug}/`}
      className="grid h-full grid-rows-[auto_1fr] transition-colors duration-[250ms] hover:border-accent"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            {logo ? (
              <Image src={logo} alt="" width={28} height={28} className="h-7 w-7 shrink-0 object-contain" />
            ) : (
              <FolderIcon width={28} height={28} className="shrink-0 text-accent" />
            )}
            {/* Wraps rather than truncates: in the two-column band just above 560px the
                column is narrower than "NHL Player Dashboard", and a clipped project name
                is worse than a name on two lines. */}
            <h3 className="min-w-0 text-[15px] font-bold">{title}</h3>
          </div>
          <div className="flex shrink-0 items-center text-cyan">
            {links.github ? (
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title} on GitHub`}
                className="inline-flex h-6 w-6 items-center justify-center"
              >
                <GitHubIcon />
              </a>
            ) : null}
            {links.site ? (
              <a
                href={links.site}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title} website`}
                className="inline-flex h-6 w-6 items-center justify-center"
              >
                <ExternalIcon />
              </a>
            ) : null}
          </div>
        </div>

        <p className="mt-3">{blurb}</p>
        <p className="mt-auto pt-4 text-muted-strong">{tech.join(" · ")}</p>
      </div>
    </Box>
  );
}
