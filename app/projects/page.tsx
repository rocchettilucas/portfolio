import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { projects } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Projects | Lucas Rocchetti",
  description: "A collection of projects built by Lucas Rocchetti.",
};

export default function ProjectsPage() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-card-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft size={18} />
            Back to portfolio
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground">
              All Projects<span className="text-accent">.</span>
            </h1>
            <p className="text-muted mt-2">Everything I&apos;ve been building.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}

            {/* Placeholder — replace with a real project later */}
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-card-border bg-card/40 p-8 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Plus size={22} />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                More coming soon
              </h3>
              <p className="mt-1 text-sm text-muted">
                New projects will land here.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
