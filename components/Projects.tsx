import Link from "next/link";
import Section from "@/components/terminal/Section";
import ProjectCard from "@/components/ProjectCard";
import ProjectFeatured from "@/components/ProjectFeatured";
import { cardProjects, featuredProject } from "@/lib/data";

/**
 * `ls ~/projects | head -3` — GasMap full width, then the two cards, then the way out. The
 * home page deliberately shows only the head of the list: the rest of it, with a screenshot
 * and a paragraph each, lives on /projects behind the "view all work" link.
 */
export default function Projects() {
  return (
    <Section id="projects" command="ls ~/projects | head -3" label="Projects">
      <div className="grid gap-4">
        <ProjectFeatured project={featuredProject} />
        {/* Two columns, one at 560px and under. Written mobile-first with an explicit
            min-width because Tailwind v4 orders arbitrary `max-[…]` variants unpredictably
            against each other, which lets the wrong rule win on a phone. */}
        <div className="grid grid-cols-1 gap-4 min-[561px]:grid-cols-2">
          {cardProjects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
        {/* The arrow is part of the sentence, not an icon: it is the same "there is more
            this way" gesture a shell prompt makes, and it reads aloud as one. */}
        <p className="text-right">
          <Link href="/projects" className="text-cyan">
            view all work →
          </Link>
        </p>
      </div>
    </Section>
  );
}
