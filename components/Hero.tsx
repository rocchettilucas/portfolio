import AsciiPortrait from "@/components/AsciiPortrait";
import TypedRoles from "@/components/TypedRoles";
import { MailIcon } from "@/components/icons";
import { site } from "@/lib/site";

/**
 * The top of the page: the ASCII portrait on the left, the greeting on the right. Not a
 * `Section` — this one carries the document's single `<h1>`, not a command heading, so it
 * opts out of that wrapper's `<h2>`.
 *
 * The portrait hangs unframed. It is a drawing that fades out into the ground at its own
 * edges, and a box around it drew a rectangle the artwork does not have; without one the
 * glyphs sit directly on the page and the eye goes to the greeting instead of to the frame.
 *
 * It is first in the DOM and first on screen at every width: below 900px the grid collapses to
 * one column and the two simply stack in source order, so nothing has to be reordered. The
 * `<h1>` is still the document's first heading — the portrait is decorative (aria-hidden) and
 * contributes nothing to the outline.
 *
 * From 900px the hero owns the first screen but not quite all of it: it is at least 84% of
 * the viewport minus the two 40px bars, with the portrait and the greeting centred in it as a
 * pair (the text column is capped at 560px so the pair sits in the middle rather than the
 * greeting drifting to the right edge). The `$ about me` heading peeks in at the bottom edge on
 * load — a hint that the page continues — without the About body intruding on the hero.
 *
 * 900px, not the `md` 768px: the portrait's CSS box jumps to its full 400px at 769px, so
 * splitting at `md` would leave the text column ~281px wide until ~900px.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="grid content-center gap-8 px-6 py-14 max-sm:px-4 max-md:py-10 min-[900px]:min-h-[calc(84dvh-80px)] min-[900px]:grid-cols-[auto_minmax(0,560px)] min-[900px]:items-center min-[900px]:justify-center min-[900px]:gap-14"
    >
      {/* `justify-self` keeps the canvas hugging its own width instead of stretching to the column. */}
      <div className="justify-self-center">
        <AsciiPortrait />
      </div>

      <div className="hero-in min-w-0">
        <h1 className="text-[40px] font-bold leading-tight max-sm:text-[30px]">
          Hi, I&apos;m <span className="text-accent">Lucas</span>
          <span aria-hidden className="caret caret-hero" />
        </h1>
        <TypedRoles />
        <a href={`mailto:${site.email}`} className="btn mt-8">
          <MailIcon width={16} height={16} aria-hidden />
          Contact me
        </a>
      </div>
    </section>
  );
}
