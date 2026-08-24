import Image from "next/image";
import Box from "@/components/terminal/Box";
import Section from "@/components/terminal/Section";
import { coreStack } from "@/lib/data";

// Devicon ships Rust's logo in black, which disappears on the dark ground.
const INVERT = new Set(["/icons/rust.svg"]);

/**
 * `cat ~/.skills` — the six things actually reached for, as a plain list. No proficiency
 * dots and no bars: a self-scored percentage next to "React" tells a reader nothing the
 * projects section does not already tell them, and it is the one skills-section cliché
 * this design is meant to avoid.
 */
export default function Skills() {
  return (
    <Section id="skills" command="cat ~/.skills" label="Skills">
      <Box title=".skills">
        {/* Three columns, two at 640px and under, one at 400px and under. Written
            mobile-first with explicit min-widths because Tailwind orders `max-sm:` ahead
            of an arbitrary `max-[400px]:`, which let the two-column rule win on a phone. */}
        <ul className="grid grid-cols-1 gap-x-6 gap-y-3 min-[401px]:grid-cols-2 min-[641px]:grid-cols-3">
          {coreStack.map((s) => (
            <li key={s.name} className="flex items-center gap-2.5">
              <Image
                src={s.icon}
                alt=""
                width={18}
                height={18}
                className={INVERT.has(s.icon) ? "shrink-0 invert" : "shrink-0"}
              />
              {s.name}
            </li>
          ))}
        </ul>
      </Box>
    </Section>
  );
}
