import Section from "./Section";
import Reveal from "./Reveal";
import ExperienceTabs from "./ExperienceTabs";
import { experience } from "@/lib/data";

export default function Experience() {
  return (
    <Section id="experience" title="Experience">
      <Reveal>
        <ExperienceTabs roles={experience} />
      </Reveal>
    </Section>
  );
}
