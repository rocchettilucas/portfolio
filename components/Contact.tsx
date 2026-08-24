import Box from "@/components/terminal/Box";
import Section from "@/components/terminal/Section";
import { ExternalIcon } from "@/components/icons";
import { site } from "@/lib/site";

const social = (label: string) => site.socials.find((s) => s.label === label)!.href;

// The address bar of a message that has been started but not sent: one header line per way
// to reach me. The displayed text is the address itself, so each link says where it goes
// without an aria-label having to say it again.
const ROWS: ReadonlyArray<{ key: string; href: string; text: string; external: boolean }> = [
  { key: "To:", href: `mailto:${site.email}`, text: site.email, external: false },
  { key: "GitHub:", href: social("GitHub"), text: "github.com/rocchettilucas", external: true },
  { key: "LinkedIn:", href: social("LinkedIn"), text: "linkedin.com/in/lucasrocchetti", external: true },
];

/**
 * `mail lucas` — the last section. No form: a form on a static site is a mailto with extra
 * steps and one more thing to break, and the address is not a secret.
 */
export default function Contact() {
  return (
    <Section id="contact" command="mail lucas" label="Contact">
      <p className="mb-6 max-w-[68ch]">
        Hiring, or just want to talk hockey analytics? I read everything.
      </p>
      <Box title="new message">
        <dl className="grid gap-3">
          {ROWS.map((row) => (
            // A wrapping flex row, not a two-column grid: on a phone the column left over
            // beside the key is narrower than `linkedin.com/in/lucasrocchetti`, and a grid
            // would answer that by breaking the address mid-word. Wrapping instead drops
            // the whole address onto its own full-width line, where it fits intact. The
            // fixed key column keeps the addresses aligned once there is room for both.
            <div key={row.key} className="flex flex-wrap">
              <dt className="w-24 shrink-0 text-muted-strong">{row.key}</dt>
              <dd className="min-w-0 break-words">
                <a
                  href={row.href}
                  {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {row.text}
                  {row.external ? (
                    <ExternalIcon width={12} height={12} className="ml-1.5 inline align-baseline" />
                  ) : null}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </Box>
    </Section>
  );
}
