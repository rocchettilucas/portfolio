import Image from "next/image";
import type { Project } from "@/lib/data";
import { GitHubIcon, ExternalIcon, FolderIcon } from "./icons";

export default function ProjectCard({ project }: { project: Project }) {
  const { title, blurb, tech, links, logo } = project;
  return (
    <article className="lift flex h-full flex-col rounded-2xl bg-surface p-6 hover:bg-hover">
      <div className="mb-4 flex items-start justify-between">
        {logo ? (
          <Image src={logo} alt="" width={40} height={40} className="h-10 w-10 object-contain" />
        ) : (
          <FolderIcon className="text-accent" />
        )}
        <div className="flex gap-3.5 text-accent">
          {links.github && (
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${title} on GitHub`}
              className="p-1"
            >
              <GitHubIcon />
            </a>
          )}
          {links.site && (
            <a
              href={links.site}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${title} website`}
              className="p-1"
            >
              <ExternalIcon />
            </a>
          )}
        </div>
      </div>
      <h3 className="mb-2 text-[21px] font-medium">{title}</h3>
      <p className="mb-4 text-[15.5px] leading-relaxed text-muted">{blurb}</p>
      <p className="mt-auto text-[13.5px] text-muted">{tech.join(", ")}</p>
    </article>
  );
}
