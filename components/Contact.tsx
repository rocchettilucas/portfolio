import Section from "@/components/terminal/Section";
import { site } from "@/lib/site";

/**
 * `mail lucas` — the last section. One line and one button: no form (a form on a static
 * site is a mailto with extra steps and one more thing to break), and no address list,
 * because GitHub and LinkedIn now live in the top bar.
 */
export default function Contact() {
  return (
    <Section id="contact" command="mail lucas" label="Contact">
      <p className="mb-6 max-w-[68ch]">
        Hiring, or want to talk about something I built? Send me an email.
      </p>
      <a href={`mailto:${site.email}`} className="btn">
        Email me
      </a>
    </Section>
  );
}
