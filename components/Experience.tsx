import Box from "@/components/terminal/Box";
import Section from "@/components/terminal/Section";
import { experience } from "@/lib/data";

/**
 * `cat ~/experience.log` — one box, read top to bottom as a log: newest role first, each
 * one a `[dates] Title @ Company` line over its own bullets. No tabs and no cards; a log
 * is a single stream, and splitting it into panels would hide most of it behind a click.
 *
 * The header is `flex flex-wrap` so the phone width can drop the dates onto their own line
 * instead of squeezing the title, and the bullets hang off an absolutely placed `▹` so a
 * wrapped line lines up under the first word rather than under the marker.
 */
export default function Experience() {
  return (
    <Section id="experience" command="cat ~/experience.log" label="Experience">
      <Box title="experience.log">
        <ol className="grid gap-5">
          {experience.map((role) => (
            <li key={`${role.company}-${role.title}`}>
              <div className="flex flex-wrap gap-x-2">
                <span className="text-muted-strong">[{role.dates}]</span>
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
              </div>
              <ul className="mt-1 list-none">
                {role.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="relative pl-5 before:absolute before:left-0 before:top-0 before:text-accent before:content-['▹']"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Box>
    </Section>
  );
}
