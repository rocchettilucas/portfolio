import Image from "next/image";
import Box from "@/components/terminal/Box";
import Section from "@/components/terminal/Section";
import { skillGroups } from "@/lib/data";

// Devicon ships Rust's, Expo's and Tokio's marks in flat black, which disappears on the
// dark ground; `invert` turns each of them white without touching the colour marks.
const INVERT = new Set(["/icons/rust.svg", "/icons/expo.svg", "/icons/tokio.svg"]);

// The box titles are directory names, to match the listing the heading implies — the data's
// own titles ("Frameworks & runtimes") are prose and read wrong on a box header. Anything
// added to `skillGroups` without an entry here falls back to a slug of its title.
const DIRS: Record<string, string> = {
  Languages: "languages",
  "Frameworks & runtimes": "frameworks",
  "Databases & caching": "databases",
};

function dirName(title: string) {
  const slug = DIRS[title] ?? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${slug}/`;
}

/**
 * `cat ~/.skills` — the resume's stack in three boxes, one per group, as plain icon+name
 * lists. No proficiency dots and no bars: a self-scored percentage next to "React" tells a
 * reader nothing the projects section does not already tell them, and it is the one
 * skills-section cliché this design is meant to avoid.
 */
export default function Skills() {
  return (
    <Section id="skills" command="skills" label="Skills">
      {/* One column on a phone, three side by side from 641px — the same breakpoint the
          old single list used, written as an explicit min-width so it cannot be reordered
          out of effect by Tailwind's `max-*` variants. */}
      <div className="grid grid-cols-1 gap-4 min-[641px]:grid-cols-3">
        {skillGroups.map((group) => (
          <Box key={group.title} title={dirName(group.title)}>
            <ul className="grid gap-y-3">
              {group.items.map((s) => (
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
        ))}
      </div>
    </Section>
  );
}
