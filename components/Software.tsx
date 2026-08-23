import Section from "./Section";
import Reveal from "./Reveal";
import Spotlight from "./Spotlight";
import ProjectCard from "./ProjectCard";
import { homeSpotlight, homeCards } from "@/lib/data";

export default function Software() {
  return (
    <Section id="work" title="Selected Work" action={{ label: "View all projects", href: "/projects" }}>
      <Reveal>
        <Spotlight project={homeSpotlight} />
      </Reveal>
      <div className="mt-5 grid grid-cols-2 gap-5 max-md:grid-cols-1">
        {homeCards.map((p, i) => (
          <Reveal key={p.slug} delay={i * 80}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
