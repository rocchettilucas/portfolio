import Link from "next/link";
import Section from "@/components/terminal/Section";
import ProjectCard from "@/components/ProjectCard";
import { homeProjects } from "@/lib/data";

/**
 * `work` — three cards of equal weight, each showing what the thing actually looks like, with
 * the way out on the heading row. The home page deliberately shows only the head of the list: the rest of it,
 * with a screenshot and a paragraph each, lives on /projects behind the "view all work" link.
 * GasMap leads and wears a star; it does not get its own width.
 *
 * The section is `work` and the route is still /projects — the heading names what these are,
 * the URL names where they live, and neither had to move for the other.
 */
export default function Work() {
  return (
    <Section
      id="work"
      command="work"
      label="Selected work"
      // On the heading row, not under the cards: the way out is announced where the section
      // is announced. The arrow is part of the sentence — the same "there is more this way"
      // gesture a shell prompt makes, and it reads aloud as one.
      aside={
        <Link href="/projects" className="whitespace-nowrap text-[13px] text-cyan">
          view all work →
        </Link>
      }
    >
      {/* One column on a phone, two at 641px, three at 901px. Written mobile-first with
          explicit min-widths because Tailwind v4 orders arbitrary `max-[…]` variants
          unpredictably against each other, which lets the wrong rule win on a phone. */}
      <div className="grid grid-cols-1 gap-4 min-[641px]:grid-cols-2 min-[901px]:grid-cols-3">
        {homeProjects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </Section>
  );
}
