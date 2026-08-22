import Image from "next/image";
import type { Project } from "@/lib/data";
import { ExternalIcon, GitHubIcon, FolderIcon } from "./icons";

export default function Spotlight({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const { title, blurb, tech, links, meta, image } = project;
  return (
    // From lg up: a 2/1 banner with the caption overlaid on its lower third, carrying its own
    // gradient sized to the text. The gradient holds full --bg through the bottom 35% and is
    // still at 90% at 60% — so the whole caption block, meta line included, reads on a dark
    // ground no matter how bright the art behind it is — and only fades out above the text.
    // Below lg the caption flows *under* the image instead — the banner is too short there to
    // hold the caption plus a readable fade without veiling the whole image — so the article
    // grows and the image carries a scrim that lands on the same --bg the caption sits on.
    <article className="relative overflow-hidden rounded-[20px] bg-bg lg:bg-surface">
      <div className="relative aspect-[4/3] md:aspect-[2/1]">
        {/* The logo is deliberately not drawn over a spotlight image — that banner already contains it.
            Glyph frames are centred in the upper 62% at lg so they clear the overlaid caption;
            below lg the caption is in flow, so the glyph gets the whole frame. */}
        {image.kind === "spotlight" && (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={priority}
            sizes="(max-width: 1000px) 100vw, 1000px"
            className="object-cover"
          />
        )}
        {image.kind === "logo" && (
          <div className="absolute inset-0 flex items-center justify-center lg:bottom-auto lg:h-[62%]">
            <Image
              src={image.src}
              alt={image.alt}
              width={160}
              height={160}
              priority={priority}
              className="h-40 w-40 object-contain opacity-90"
            />
          </div>
        )}
        {image.kind === "folder" && (
          <div className="absolute inset-0 flex items-center justify-center text-accent lg:bottom-auto lg:h-[62%]">
            <FolderIcon width={120} height={120} strokeWidth={1.2} />
          </div>
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg via-bg/80 to-transparent lg:hidden"
        />
      </div>
      <div className="px-5 pb-6 pt-3 text-center lg:absolute lg:inset-x-0 lg:bottom-0 lg:bg-gradient-to-t lg:from-bg lg:from-35% lg:via-bg/90 lg:via-60% lg:to-transparent lg:px-10 lg:pb-7 lg:pt-32">
        {meta && <p className="mb-1 text-sm text-muted">{meta}</p>}
        <h3 className="mb-1.5 text-2xl font-medium leading-tight md:text-[32px]">{title}</h3>
        <p className="mx-auto mb-1.5 max-w-[60ch] text-[15px] text-text/90 md:text-base">{blurb}</p>
        <p className="mb-3.5 text-sm text-muted">{tech.join(", ")}</p>
        <p className="flex flex-wrap items-center justify-center gap-3">
          {links.appStore && (
            <a href={links.appStore} target="_blank" rel="noopener noreferrer" className="btn-outline">
              App Store
            </a>
          )}
          {links.googlePlay && (
            <a href={links.googlePlay} target="_blank" rel="noopener noreferrer" className="btn-outline">
              Google Play
            </a>
          )}
          {links.github && (
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${title} on GitHub`}
              className="p-1 text-accent"
            >
              <GitHubIcon />
            </a>
          )}
          {links.site && (
            <a
              href={links.site}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${title} website`}
              className="p-1 text-accent"
            >
              <ExternalIcon />
            </a>
          )}
        </p>
      </div>
    </article>
  );
}
