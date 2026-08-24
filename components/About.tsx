import Box from "@/components/terminal/Box";
import Section from "@/components/terminal/Section";

/**
 * `cat ~/about.md` — one paragraph and the one fact the paragraph leaves out. Text only:
 * the photo that used to sit beside it now lives in the hero as the ASCII portrait, and
 * printing a file to the terminal would not have produced an image anyway.
 */
export default function About() {
  return (
    <Section id="about" command="cat ~/about.md" label="About">
      <Box title="about.md">
        <p className="max-w-[68ch]">
          I&apos;m a recent Computer Science graduate from the University of Toronto. I got into
          programming through games — I wanted better data on League of Legends matchups than
          existed, so I built it — and I&apos;ve been building products since. Lately that&apos;s
          meant Rust and native apps.
        </p>
        <p className="mt-4">
          <span className="text-muted-strong">location:</span> Toronto, Canada
        </p>
      </Box>
    </Section>
  );
}
