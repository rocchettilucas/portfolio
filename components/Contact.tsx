import Box from "@/components/terminal/Box";
import Section from "@/components/terminal/Section";
import { LinkedInIcon, MailIcon } from "@/components/icons";
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
          <p className="text-[17px]">Let&apos;s connect</p>
          {/* Two ways in, both as buttons, both the same weight: no ranking of email over
              LinkedIn, no address to copy — the buttons are the address. */}
          <p className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a className="btn" href={`mailto:${site.email}`}>
              <MailIcon width={16} height={16} aria-hidden />
              Email
            </a>
            <a className="btn" href={socialHref("LinkedIn")} target="_blank" rel="noopener noreferrer">
              <LinkedInIcon width={16} height={16} aria-hidden />
              LinkedIn
            </a>
          </p>
        </div>
      </Box>
    </Section>
  );
}
