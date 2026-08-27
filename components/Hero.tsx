import AsciiPortrait from "@/components/AsciiPortrait";
import Box from "@/components/terminal/Box";
import { site } from "@/lib/site";

/**
 * The top of the page: the ASCII portrait on the left, the greeting on the right. Not a
 * `Section` — this one carries the document's single `<h1>`, not a command heading, so it
 * opts out of that wrapper's `<h2>`.
 *
 * The portrait is first in the DOM and first on screen at every width: below 900px the grid
 * collapses to one column and the two simply stack in source order, so nothing has to be
 * reordered. The `<h1>` is still the document's first heading — the portrait is decorative
 * (aria-hidden) and contributes nothing to the outline.
 *
 * 900px, not the `md` 768px: the portrait's CSS box jumps to its full 400px at 769px, so
 * splitting at `md` would leave the text column ~281px wide until ~900px.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="grid gap-8 px-6 py-14 max-sm:px-4 max-md:py-10 min-[900px]:grid-cols-[auto_1fr] min-[900px]:items-center min-[900px]:gap-12"
    >
      {/* `justify-self` keeps the box hugging the canvas instead of stretching to the column. */}
      <div className="justify-self-center">
        <Box title="~/lucas.jpg" padding="none">
          <AsciiPortrait />
        </Box>
      </div>

      <div className="hero-in min-w-0">
        <h1 className="text-[40px] font-bold leading-tight max-sm:text-[30px]">
          Hey, I&apos;m <span className="text-accent">Lucas</span>
          <span aria-hidden className="caret caret-hero" />
        </h1>
        <p className="mt-4 max-w-[60ch]">
          I&apos;m a software engineer based in Toronto. I build full-stack apps and developer tools —
          most recently GasMap, a gas-price app for iOS and Android, and RocSpace, a desktop workspace
          for coding agents. Recent Computer Science graduate from the University of Toronto.
        </p>
        <a href={`mailto:${site.email}`} className="btn mt-6">
          Email me
        </a>
      </div>
    </section>
  );
}
