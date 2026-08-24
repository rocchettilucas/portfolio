import Section from "@/components/terminal/Section";
import ProjectCard from "@/components/ProjectCard";
import ProjectFeatured from "@/components/ProjectFeatured";
import { cardProjects, featuredProject } from "@/lib/data";

/**
 * `ls ~/projects` — all six, GasMap first and full width, the rest as a directory listing.
 * There is no per-project page and no "view all": everything there is to say fits in a
 * sentence and a stack line, so the section is the whole of it.
 */
export default function Projects() {
  return (
    <Section id="projects" command="ls ~/projects" label="Projects">
      <div className="grid gap-4">
        <ProjectFeatured project={featuredProject} />
        {/* Three columns, two at 900px and under, one at 560px and under. Written
            mobile-first with explicit min-widths because Tailwind v4 orders arbitrary
            `max-[…]` variants unpredictably against each other, which lets the wrong rule
            win on a phone. */}
        <div className="grid grid-cols-1 gap-4 min-[561px]:grid-cols-2 min-[901px]:grid-cols-3">
          {cardProjects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
    </Section>
  );
}
