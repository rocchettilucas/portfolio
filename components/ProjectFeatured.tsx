import Image from "next/image";
import Box from "@/components/terminal/Box";
import { ExternalIcon, FolderIcon } from "@/components/icons";
import type { Project } from "@/lib/data";

/**
 * The one project that gets the full column width. Everything shown here comes straight out
 * of `lib/data.ts` — GasMap is a commercial product, so the section states only the public
 * product facts recorded there and nothing about how it is built beyond its stack.
 *
 * The store links use the shared `.btn` class from globals.css — the design's one text
 * button, also used by the hero and Contact.
 */
export default function ProjectFeatured({ project }: { project: Project }) {
  const { slug, title, blurb, tech, links, logo, meta } = project;

  return (
    <Box title={`${slug}/`}>
      <div className="flex items-center gap-4">
        {logo ? (
          <Image src={logo} alt="" width={48} height={48} className="h-12 w-12 shrink-0 object-contain" />
        ) : (
          <FolderIcon width={48} height={48} className="shrink-0 text-accent" />
        )}
        <div className="min-w-0">
          <h3 className="text-[17px] font-bold">{title}</h3>
          {meta ? <p className="text-muted-strong">{meta}</p> : null}
        </div>
      </div>

      <p className="mt-4 max-w-[68ch]">{blurb}</p>
      <p className="mt-2 text-muted-strong">{tech.join(" · ")}</p>

      <p className="mt-4 flex flex-wrap items-center gap-3">
        {links.appStore ? (
          <a href={links.appStore} target="_blank" rel="noopener noreferrer" className="btn">
            App Store
          </a>
        ) : null}
        {links.googlePlay ? (
          <a href={links.googlePlay} target="_blank" rel="noopener noreferrer" className="btn">
            Google Play
          </a>
        ) : null}
        {links.site ? (
          <a
            href={links.site}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${title} website`}
            className="inline-flex h-6 w-6 items-center justify-center text-cyan"
          >
            <ExternalIcon />
          </a>
        ) : null}
      </p>
    </Box>
  );
}
