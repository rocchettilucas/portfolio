import Image from "next/image";
import Section from "@/components/terminal/Section";
import { PinIcon } from "@/components/icons";
import { about, skills } from "@/lib/data";

// Devicon ships Rust's, Expo's and Tokio's marks in flat black, which disappears on the
// dark ground; `invert` turns each of them white without touching the colour marks.
const INVERT = new Set(["/icons/rust.svg", "/icons/expo.svg", "/icons/tokio.svg"]);

/**
 * `about` — the photo, two paragraphs, and the facts that used to need two sections of their
 * own. Education is one line of a definition list rather than a boxed row with a crest: a
 * single degree is a fact about the person, not a section of the page. The stack is the same
 * data the three skills boxes held, flattened into one row of chips — the grouping still
 * decides the order, but a reader scanning for "does he write Rust" reads a line, not a
 * taxonomy. No proficiency bars, here or anywhere.
 *
 * 769px is where the portrait column can hold its 260px and still leave the text a readable
 * measure; below it the two stack and the photo centres over the copy.
 */
export default function About() {
  return (
    <Section id="about" command="about" label="About">
      <div className="grid gap-8 min-[769px]:grid-cols-[260px_1fr] min-[769px]:gap-10">
        {/* The file is 900×1200, so the 3:4 box is reserved from the intrinsic size and
            nothing below it moves while the photo loads. */}
        <figure className="m-0 w-full max-w-[260px] justify-self-center">
          <Image
            src="/about/lucas.jpg"
            alt="Lucas Rocchetti"
            width={260}
            height={347}
            sizes="(max-width: 768px) 60vw, 260px"
            className="h-auto w-full rounded-[4px] border border-border object-cover"
          />
          {/* Where the photo was taken is where I am; the caption says so under it rather
              than in a record beside the text. */}
          <figcaption className="mt-2 flex items-center gap-1.5 text-[13px] text-muted-strong">
            <PinIcon width={13} height={13} aria-hidden className="shrink-0 text-accent" />
            Toronto, Canada
          </figcaption>
        </figure>

        <div className="min-w-0">
          {about.paragraphs.map((paragraph, i) => (
            <p key={paragraph.slice(0, 24)} className={`max-w-[62ch]${i === 0 ? "" : " mt-4"}`}>
              {paragraph}
            </p>
          ))}

          <div className="mt-5">
            <p className="text-muted-strong">skills:</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {skills.map((s) => (
                <li
                  key={s.name}
                  className="inline-flex items-center gap-1.5 rounded-[4px] border border-border px-2 py-0.5 text-[13px]"
                >
                  <Image
                    src={s.icon}
                    alt=""
                    width={14}
                    height={14}
                    className={INVERT.has(s.icon) ? "shrink-0 invert" : "shrink-0"}
                  />
                  {s.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
