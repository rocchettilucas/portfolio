import Box from "@/components/terminal/Box";
import Section from "@/components/terminal/Section";
import { experience } from "@/lib/data";

/**
 * `experience` — one box, newest role first, each a title line over a single paragraph. No
 * bullets and no metrics: the numbers live on the project cards, and a role restated as four
 * quantified bullets reads as the resume it was copied from rather than as a description of
 * the work.
 *
 * The header is `flex flex-wrap justify-between` so the dates sit hard right on a wide row
 * and drop onto their own line on a phone instead of squeezing the title.
 */
export default function Experience() {
  return (
    <Section id="experience" command="experience" label="Experience">
      <Box>
        <ol className="grid gap-6">
          {experience.map((role, i) => (
            <li
              key={`${role.company}-${role.title}`}
              // A hairline between entries, never above the first — the box's own top rule
              // is already there and a second one would double it.
              className={i === 0 ? undefined : "border-t border-border pt-6"}
            >
              <div className="flex flex-wrap justify-between gap-x-4">
                <span>
                  <strong className="font-bold">{role.title}</strong>{" "}
                  <span className="text-accent">
                    @{" "}
                    {role.site ? (
                      <a href={role.site} target="_blank" rel="noopener noreferrer" className="text-cyan">
                        {role.company}
                      </a>
                    ) : (
                      role.company
                    )}
                  </span>
                </span>
                <span className="text-muted-strong">{role.dates}</span>
              </div>
              <p className="mt-1 max-w-[68ch]">{role.summary}</p>
            </li>
          ))}
        </ol>
      </Box>
    </Section>
  );
}
