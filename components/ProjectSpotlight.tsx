import Image from "next/image";
import Box from "@/components/terminal/Box";
import { AppStoreIcon, ExternalIcon, FolderIcon, GitHubIcon, GooglePlayIcon, StarIcon } from "@/components/icons";
import type { Project } from "@/lib/data";

/**
 * One project on /work: the screenshot first, then the name, dates, what the thing is and
 * the stack. Everything shown comes straight out of `lib/data.ts` — GasMap is a commercial
 * product, so the copy states only the public product facts recorded there and nothing
 * about how it is built beyond its stack.
 *
 * The shot is capped at 760px rather than the full 992px column, so a whole entry — picture
 * and text — sits inside one viewport; at full width it was a screen of screenshot per
 * project. Below that width it simply takes the width it has. The text sits on the same
 * centred 760px column, so the name, the link icons on the right and the paragraph all
 * line up with the edges of the picture rather than with the box.
 *
 * The screenshot carries its intrinsic 1600×1000 through `width`/`height` rather than
 * `fill`, so the 16/10 box is reserved before the file arrives and nothing below it moves.
 *
 * A project may carry a second shot for this page alone: `spotlightImage` is the one drawn
 * here, `image` what the home card shows. Only GasMap has one so far — three app screens
 * where the card shows one — and everything else falls through to its `image`.
 */
export default function ProjectSpotlight({ project }: { project: Project }) {
  const { slug, title, description, image, spotlightImage, tech, links, logo, dates, meta, rating } = project;

  return (
    <Box title={`${slug}/`}>
      <div className="flex flex-col gap-4">
        {/* Below 820px the shot is the column, not the viewport: the section's own inset and
            the box's `p-4` take 64px out of it on a phone and 80px above 640px. Naming those
            widths rather than a flat `100vw` is a bucket's worth of bytes on every shot. */}
        <Image
          src={spotlightImage ?? image}
          alt={`${title} screenshot`}
          width={1600}
          height={1000}
          sizes="(max-width: 640px) calc(100vw - 64px), (max-width: 820px) calc(100vw - 80px), 760px"
          className="mx-auto w-full max-w-[760px] rounded-[4px] border border-border"
        />

        <div className="mx-auto w-full max-w-[760px] min-w-0">
          <div className="flex items-start justify-between gap-3">
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

          {/* One muted line of facts: when, then the store facts if there are any, then the
              rating behind the star it earned rather than spelled out in words. */}
          <p className="mt-1 text-muted-strong">
            {dates}
            {meta ? ` · ${meta}` : null}
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

          {/* `description` is stored a sentence per entry so the copy stays editable line by
              line, but it is written as continuous prose — joined here rather than set as a
              stack of one-sentence paragraphs. */}
          <p className="mt-3 max-w-[68ch]">{description.join(" ")}</p>
          <p className="mt-2 text-muted-strong">{tech.join(" · ")}</p>
        </div>
      </div>
    </Box>
  );
}
