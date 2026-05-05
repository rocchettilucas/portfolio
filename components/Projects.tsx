"use client";

import { useRef, MouseEvent } from "react";
import { motion } from "framer-motion";
import { projects } from "@/lib/data";
import Image from "next/image";

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
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
  const href = validUrl(project.liveUrl) ?? validUrl(project.githubUrl);

  const card = (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="bg-card border border-card-border rounded-xl overflow-hidden transition-[box-shadow] duration-300 hover:shadow-lg hover:shadow-accent/5 will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="relative w-full aspect-[4/3] bg-background/50 overflow-hidden flex items-center justify-center">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-contain p-10"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
      </div>
    </div>
  );

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
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="block">
            {card}
          </a>
        ) : (
          card
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground">
            Featured Projects<span className="text-accent">.</span>
          </h2>
          <p className="text-muted mt-2">Things I&apos;ve worked on</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
