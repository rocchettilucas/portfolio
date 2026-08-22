"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { projects } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg border border-accent px-6 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
          >
            View All Projects
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
