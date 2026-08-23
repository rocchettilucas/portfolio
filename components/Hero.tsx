import AsciiPortrait from "./AsciiPortrait";
import { MailIcon } from "./icons";
import { site } from "@/lib/site";

export default function Hero() {
  return (
    <section
      id="top"
      aria-label="Introduction"
      className="mx-auto grid min-h-[80vh] max-w-[1000px] grid-cols-[auto_1fr] items-center gap-14 px-10 pb-20 pt-28 max-md:grid-cols-1 max-md:px-5 max-md:pt-24"
    >
      <div>
        <AsciiPortrait />
      </div>
      <div>
        <h1 className="mb-5 text-[56px] font-medium leading-[1.1] tracking-[-0.01em] max-sm:text-[40px]">
          <span aria-hidden>👋 </span>Hi, I&apos;m <span className="text-accent">Lucas</span>
        </h1>
        <p className="mb-6 max-w-[560px] text-lg leading-relaxed text-muted">
          I&apos;m a software developer based in Toronto, focused on designing and building full-stack applications. I
          recently graduated from the University of Toronto with a degree in Computer Science and Information
          Technology.
        </p>
        <a href={`mailto:${site.email}`} className="btn-outline">
          <MailIcon /> Contact me
        </a>
      </div>
    </section>
  );
}
