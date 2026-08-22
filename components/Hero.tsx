import AsciiPortrait from "./AsciiPortrait";
import { site } from "@/lib/site";

export default function Hero() {
  return (
    <section
      id="top"
      aria-label="Introduction"
      className="mx-auto grid min-h-[80vh] max-w-[1000px] grid-cols-[1fr_auto] items-center gap-14 px-10 pb-20 pt-28 max-md:grid-cols-1 max-md:px-5 max-md:pt-24"
    >
      <div className="max-md:order-2">
        <h1 className="mb-5 text-[56px] font-medium leading-[1.1] tracking-[-0.01em] max-sm:text-[40px]">
          <span aria-hidden>👋 </span>Hi, I&apos;m Lucas
        </h1>
        <p className="mb-6 max-w-[520px] text-lg leading-relaxed text-muted">
          I&apos;m a software engineer in Toronto. I build apps and tools that people actually use — from a gas-price app
          on iOS and Android to a desktop workspace for coding agents.
        </p>
        <ul className="flex gap-6 text-[15px]">
          {site.socials.map((s) => {
            // rel is only meaningful alongside target=_blank; the mailto link gets neither.
            const external = !s.href.startsWith("mailto:");
            return (
              <li key={s.label}>
                <a href={s.href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}
                   className="inline-block py-1">
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="max-md:order-1">
        <AsciiPortrait />
      </div>
    </section>
  );
}
