"use client";

import { useRef, MouseEvent } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import { type Project } from "@/lib/data";
import Image from "next/image";

// devicon classes per technology display name (techs without an icon render text-only)
const techIcons: Record<string, string> = {
  "Tauri 2": "devicon-tauri-plain colored",
  Rust: "devicon-rust-original",
  React: "devicon-react-original colored",
  TypeScript: "devicon-typescript-plain colored",
  "Node.js": "devicon-nodejs-plain colored",
  Supabase: "devicon-supabase-plain colored",
  Vercel: "devicon-vercel-original",
};

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 6;
    const rotateX = -((y - centerY) / centerY) * 6;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    cardRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(59,130,246,0.06), transparent 60%), var(--card)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    cardRef.current.style.background = "var(--card)";
  };

  const validUrl = (u?: string) => (u && u !== "#" ? u : undefined);
  const live = validUrl(project.liveUrl);
  const repo = validUrl(project.githubUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 4 + index * 0.3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.5,
        }}
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="flex h-full flex-col bg-card border border-card-border rounded-xl overflow-hidden transition-[box-shadow] duration-300 hover:shadow-lg hover:shadow-accent/5 will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="relative w-full aspect-[16/10] bg-background/50 overflow-hidden flex items-center justify-center">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-contain p-8"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          </div>

          <div className="flex flex-1 flex-col p-5">
            {project.date && (
              <span className="font-mono text-xs text-muted">{project.date}</span>
            )}

            <h3 className="mt-2 text-lg font-semibold text-foreground">
              {project.title}
            </h3>

            {project.description && (
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {project.description}
              </p>
            )}

            {project.tech.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((t) => {
                  const icon = techIcons[t];
                  return (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 rounded-full border border-card-border bg-background px-2.5 py-1 text-xs text-muted"
                    >
                      {icon && <i className={`${icon} text-sm`} aria-hidden="true" />}
                      {t}
                    </span>
                  );
                })}
              </div>
            )}

            {(live || repo) && (
              <div className="mt-auto flex items-center gap-4 pt-4">
                {live && (
                  <a
                    href={live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
                  >
                    <ExternalLink size={16} />
                    Live
                  </a>
                )}
                {repo && (
                  <a
                    href={repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
                  >
                    <GithubIcon size={16} />
                    Code
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
