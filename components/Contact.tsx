import Section from "./Section";
import Reveal from "./Reveal";
import { site } from "@/lib/site";
import { MailIcon } from "./icons";

export default function Contact() {
  const github = site.socials.find((s) => s.label === "GitHub")!;
  const linkedin = site.socials.find((s) => s.label === "LinkedIn")!;

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
            {/* py-1 inline-block so each text link clears a 24px pointer target. */}
            <a href={github.href} target="_blank" rel="noopener noreferrer" className="inline-block py-1">
              GitHub
            </a>
            <a href={linkedin.href} target="_blank" rel="noopener noreferrer" className="inline-block py-1">
              LinkedIn
            </a>
            <a href={site.resumePath} target="_blank" rel="noopener noreferrer" className="inline-block py-1">
              Résumé
            </a>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
