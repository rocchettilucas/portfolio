import AsciiPortrait from "@/components/AsciiPortrait";
import Banner from "@/components/Banner";
import Box from "@/components/terminal/Box";
import Prompt from "@/components/terminal/Prompt";
import { site } from "@/lib/site";

// The answer `whoami` would print. Keys are meta text (--muted-strong), values are body.
const FACTS: ReadonlyArray<readonly [string, string]> = [
  ["Name", site.name],
  ["Based in", "Toronto, Canada"],
  ["Role", "Software Engineer"],
];

/**
 * The top of the page: the figlet name and a `$ whoami` answer on the left, the ASCII
 * portrait on the right. Not a `Section` — this one carries the document's single `<h1>`
 * (inside `Banner`), not a command heading, so it opts out of that wrapper's `<h2>`.
 *
 * Below 900px the two stack with the portrait first: it is the image that says who this
 * is, and it should be the thing on screen before the fold on a phone. The reorder is
 * visual only — the `<h1>` stays first in the DOM so the outline and the reading order
 * start where they should, and the portrait is decorative (aria-hidden) either way.
 *
 * 900px, not the `md` 768px: the portrait's CSS box jumps to its full 400px at 769px, so
 * splitting at `md` hands the text column ~281px and squeezes the banner and the whoami
 * box into a ribbon until ~900px. At 900 the text column starts at ~408px instead.
 */
export default function Hero() {
  return (
    <section id="top" className="grid gap-8 px-6 py-14 max-md:py-10 max-sm:px-4 min-[900px]:grid-cols-[1fr_auto] min-[900px]:gap-10">
      <div className="min-w-0 max-[899px]:order-2">
        <Banner />
        <Box className="mt-6">
          <p>
            <Prompt command="whoami" caret />
          </p>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3">
            {FACTS.map(([key, value]) => (
              <div key={key} className="contents">
                <dt className="text-muted-strong">{key}:</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4">
            Building apps and tools people actually use — from a gas-price app on iOS and Android to a
            desktop workspace for coding agents.
          </p>
        </Box>
      </div>

      {/* `justify-self` keeps the box hugging the canvas instead of stretching to the column. */}
      <div className="justify-self-center max-[899px]:order-1">
        <Box title="~/lucas.jpg" padding="none">
          <AsciiPortrait />
        </Box>
      </div>
    </section>
  );
}
