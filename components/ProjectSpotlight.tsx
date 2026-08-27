import Image from "next/image";
import Box from "@/components/terminal/Box";
import { ExternalIcon, FolderIcon, GitHubIcon, StarIcon } from "@/components/icons";
import type { Project } from "@/lib/data";

/**
 * One project at full width on /projects: the screenshot first, then the name and the
 * paragraph the home page has no room for. Everything shown comes straight out of
 * `lib/data.ts` — GasMap is a commercial product, so the copy states only the public product
 * facts recorded there and nothing about how it is built beyond its stack.
 *
 * The screenshot carries its intrinsic 1600×1000 through `width`/`height` rather than
 * `fill`, so the 16/10 box is reserved before the file arrives and nothing below it moves.
 */
export default function ProjectSpotlight({ project }: { project: Project }) {
  const { slug, title, description, image, tech, links, logo, meta, rating } = project;

  return (
    <Box title={`${slug}/`}>
      <Image
        src={image}
        alt={`${title} screenshot`}
        width={1600}
        height={1000}
        sizes="(max-width: 1040px) 100vw, 992px"
        className="w-full rounded-[4px] border border-border"
      />

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {logo ? (
            <Image src={logo} alt="" width={28} height={28} className="h-7 w-7 shrink-0 object-contain" />
          ) : (
            <FolderIcon width={28} height={28} className="shrink-0 text-accent" />
          )}
          <h2 className="min-w-0 text-[17px] font-bold">{title}</h2>
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

      {/* Store facts only, and the rating behind the star it earned rather than spelled
          out in words — the glyph is the review site's own shorthand and costs a line
          nothing. `meta` reads on its own when a project has no rating. */}
      {meta ? (
        <p className="mt-1 text-muted-strong">
          {meta}
          {rating ? (
            <>
              {" · "}
              <StarIcon
                aria-hidden
                width={12}
                height={12}
                className="inline-block align-[-0.1em] text-accent"
              />{" "}
              {rating.toFixed(1)} on the App Store
            </>
          ) : null}
        </p>
      ) : null}

      {/* `description` is stored a sentence per entry so the copy stays editable line by
          line, but it is written as continuous prose — joined here rather than set as a
          stack of one-sentence paragraphs. */}
      <p className="mt-3 max-w-[68ch]">{description.join(" ")}</p>
      <p className="mt-2 text-muted-strong">{tech.join(" · ")}</p>

      {links.appStore || links.googlePlay ? (
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
        </p>
      ) : null}
    </Box>
  );
}
