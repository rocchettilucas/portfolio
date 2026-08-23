import Section from "./Section";
import Reveal from "./Reveal";
import { site } from "@/lib/site";
import { MailIcon } from "./icons";

export default function Contact() {
  return (
    <Section id="contact" title="Get in touch">
      <Reveal>
        <div className="max-w-[60ch]">
          <p className="mb-6 text-[17px] text-muted">
            Hiring, or just want to talk hockey analytics? I read everything.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <a href={`mailto:${site.email}`} className="btn-outline">
              <MailIcon /> Say hi
            </a>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
