import Image from "next/image";
import Box from "@/components/terminal/Box";
import { AppStoreIcon, ExternalIcon, FolderIcon, GitHubIcon, GooglePlayIcon, StarIcon } from "@/components/icons";
import type { Project } from "@/lib/data";

/**
 * One directory in the `projects` listing: the product shot on top, then the name, the
 * one-sentence blurb and the stack. The card is not a link — there is no project page to send
 * anyone to — so only the icons in the corner and the store buttons are interactive, at 24px
 * targets around 20px glyphs.
 *
 * The shot sits flush against the frame with square corners and the same hairline the title
 * strip uses, so it reads as the top pane of the box rather than a tile floating inside it;
 * that is what `padding="none"` on Box buys, with the copy taking its own `p-4` below.
 *
 * `grid-rows-[auto_1fr]` is what lets the tech line sit at the bottom of every card in a row
 * regardless of how long the blurb ran: it hands Box's body the leftover height, and the
 * column inside pushes that last line down with `mt-auto`.
 */
export default function ProjectCard({ project }: { project: Project }) {
  const { slug, title, blurb, image, tech, links, logo, meta, rating, placement } = project;

  return (
    <Box
      title={`${slug}/`}
      padding="none"
      className="grid h-full grid-rows-[auto_1fr] transition-colors duration-[250ms] hover:border-accent"
    >
      <div className="flex h-full flex-col">
        {/* The shot carries its intrinsic 1600×1000 through `width`/`height` rather than
            `fill`, so the 16/10 box is reserved before the file arrives and nothing below it
            moves. `sizes` names the three column widths the grid below actually produces. */}
        <Image
          src={image}
          alt={`${title} screenshot`}
          width={1600}
          height={1000}
          sizes="(max-width: 640px) 100vw, (max-width: 1040px) 50vw, 330px"
          className="w-full border-b border-border"
        />

        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              {logo ? (
                <Image src={logo} alt="" width={28} height={28} className="h-7 w-7 shrink-0 object-contain" />
              ) : (
                <FolderIcon width={28} height={28} className="shrink-0 text-accent" />
              )}
              {/* Wraps rather than truncates: in the two-column band the column is narrower
                  than some of the names, and a clipped project name is worse than a name on
                  two lines. The star rides inside the heading so it wraps with the last word
                  instead of being stranded on a line of its own. */}
              <h3 className="min-w-0 text-[15px] font-bold">
                {title}
                {placement === "featured" ? (
                  <>
                    {" "}
                    <StarIcon
                      role="img"
                      aria-label="Featured"
                      width={14}
                      height={14}
                      className="inline-block align-[-0.1em] text-accent"
                    />
                  </>
                ) : null}
              </h3>
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
              {links.appStore ? (
                <a
                  href={links.appStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${title} on the App Store`}
                  className="inline-flex h-6 w-6 items-center justify-center"
                >
                  <AppStoreIcon width={17} height={17} />
                </a>
              ) : null}
              {links.googlePlay ? (
                <a
                  href={links.googlePlay}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${title} on Google Play`}
                  className="inline-flex h-6 w-6 items-center justify-center"
                >
                  <GooglePlayIcon width={16} height={16} />
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
                  {rating.toFixed(1)}
                </>
              ) : null}
            </p>
          ) : null}

          <p className="mt-3">{blurb}</p>

          {/* Pinned to the bottom edge on every card, so the tech lines of three cards in a
              row sit on the same baseline. */}
          <p className="mt-auto pt-4 text-muted-strong">{tech.join(" · ")}</p>
        </div>
      </div>
    </Box>
  );
}
