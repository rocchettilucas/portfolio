import Box from "@/components/terminal/Box";
import Section from "@/components/terminal/Section";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/icons";
import { site, socialHref } from "@/lib/site";

/**
 * `contact` — the last thing on the page, and the only centred block in the design: one box,
 * one sentence, one button. No form. A form here would be a field for a name, a field for an
 * email and a POST to somewhere, all so the reader can send a message that arrives as an
 * email anyway — the mail button is the same thing with nothing in front of it.
 *
 * The address is written out under the icons as well as wired into the button, because the
 * reader who wants to send from their own client wants to read it, not click it.
 */
export default function Contact() {
  return (
    <Section id="contact" command="contact" label="Contact">
      {/* `padding="none"` because the body is roomier than the standard box inset: the block
          is short and centred, and 16px around it reads as a cramped card. */}
      <Box className="mx-auto max-w-[560px]" padding="none">
        <div className="p-8 text-center">
          <p className="text-[17px]">Want to work together, or just say hi?</p>
          <p className="mt-1 text-muted-strong">I read every email.</p>
          <a className="btn mt-6" href={`mailto:${site.email}`}>
            <MailIcon width={16} height={16} aria-hidden />
            Email me
          </a>
          {/* The same 24px targets around 20px glyphs the top bar uses, so the two rows of
              social icons are one control at two sizes rather than two designs. */}
          <p className="mt-6 flex items-center justify-center gap-4">
            <a
              href={socialHref("GitHub")}
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-6 w-6 items-center justify-center text-muted-strong hover:text-fg"
            >
              <GitHubIcon width={20} height={20} />
            </a>
            <a
              href={socialHref("LinkedIn")}
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-6 w-6 items-center justify-center text-muted-strong hover:text-fg"
            >
              <LinkedInIcon width={20} height={20} />
            </a>
          </p>
          <p className="mt-4 text-[13px] text-muted-strong">
            <a href={`mailto:${site.email}`} className="text-cyan">
              {site.email}
            </a>
          </p>
        </div>
      </Box>
    </Section>
  );
}
