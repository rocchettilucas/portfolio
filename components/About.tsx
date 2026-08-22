import Image from "next/image";
import Section from "./Section";
import Reveal from "./Reveal";
import { coreStack } from "@/lib/data";

// Devicon ships Rust's logo in black, which disappears on the dark background.
const INVERT = new Set(["/icons/rust.svg"]);

export default function About() {
  return (
    <Section id="about" title="About">
      <Reveal>
        <div className="grid grid-cols-[220px_1fr] items-start gap-10 max-md:grid-cols-1">
          <Image
            src="/about/lucas.jpg"
            alt="Lucas Rocchetti at the University of Toronto"
            width={220}
            height={280}
            className="h-[280px] w-[220px] rounded-[10px] object-cover"
          />
          <div>
            <p className="max-w-[58ch] text-[17px] leading-relaxed text-text/90">
              I&apos;m a recent Computer Science graduate from the University of Toronto. I got into
              programming through games — I wanted better data on League of Legends matchups than
              existed, so I built it — and I&apos;ve been building products since. Lately that&apos;s
              meant Rust and native apps.
            </p>
            <p className="mb-2 mt-5 text-sm text-muted">Technologies I work with most:</p>
            <ul className="grid max-w-[420px] grid-cols-2 gap-x-6 gap-y-2 text-[15px] text-muted max-sm:grid-cols-1">
              {coreStack.map((s) => (
                <li key={s.name} className="flex items-center gap-2.5">
                  <Image
                    src={s.icon}
                    alt=""
                    width={18}
                    height={18}
                    className={INVERT.has(s.icon) ? "invert" : ""}
                  />
                  {s.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
