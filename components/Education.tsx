import Image from "next/image";
import Box from "@/components/terminal/Box";
import Section from "@/components/terminal/Section";
import { education } from "@/lib/data";

// The heading is `ls ~/education`, so each entry is framed as one of the directories that
// listing would have printed. The names are too long (and, for the club, too acronym-heavy)
// to slugify into anything readable, so the short form is spelled out per school; anything
// added to the data without an entry here falls back to a slug of its name.
const DIRS: Record<string, string> = {
  "University of Toronto": "university-of-toronto",
  "Google Developer Student Club — UTM": "gdsc-utm",
};

function dirName(name: string) {
  const slug = DIRS[name] ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${slug}/`;
}

/**
 * `ls ~/education` — the degree and the club, one box each. The logos are the only images
 * on the page below the hero; they sit on white because both marks are drawn for a light
 * ground and would otherwise lose their outlines against the terminal.
 */
export default function Education() {
  return (
    <Section id="education" command="ls ~/education" label="Education">
      <div className="grid gap-4">
        {education.map((school) => (
          <Box key={school.name} title={dirName(school.name)}>
            <div className="flex items-start gap-4 max-sm:flex-col">
              <Image
                src={school.logo}
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded bg-white object-contain p-1"
              />
              <div className="min-w-0">
                <h3 className="text-[15px] font-bold">{school.name}</h3>
                {school.degree ? <p className="mt-1">{school.degree}</p> : null}
                <p className="mt-1 text-muted-strong">{school.dates}</p>
                {school.lines.map((line) => (
                  <p key={line} className="mt-1 text-muted-strong">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </Box>
        ))}
      </div>
    </Section>
  );
}
