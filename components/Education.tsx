import Image from "next/image";
import Section from "./Section";
import Reveal from "./Reveal";
import { education } from "@/lib/data";

export default function Education() {
  return (
    <Section id="education" title="Education">
      <div className="grid gap-5">
        {education.map((s, i) => (
          <Reveal key={s.name} delay={i * 80}>
            <article className="lift flex items-start gap-5 rounded-2xl bg-surface p-6 hover:bg-hover max-sm:flex-col">
              <Image
                src={s.logo}
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 rounded-lg bg-white object-contain p-1.5"
              />
              <div>
                <h3 className="text-[21px] font-medium">{s.name}</h3>
                {s.degree && <p className="text-[15.5px] text-text/90">{s.degree}</p>}
                <p className="mb-2 text-sm text-muted">{s.dates}</p>
                {s.lines.map((l) => (
                  <p key={l} className="text-[15px] text-muted">
                    {l}
                  </p>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
