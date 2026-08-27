import type { Metadata } from "next";
import Link from "next/link";
import TopBar from "@/components/terminal/TopBar";
import BottomBar from "@/components/terminal/BottomBar";
import Prompt from "@/components/terminal/Prompt";
import ProjectSpotlight from "@/components/ProjectSpotlight";
import { projects } from "@/lib/data";
import { site } from "@/lib/site";

// The root layout points `alternates.canonical` at "/", which would otherwise follow this
// route down and tell search engines the listing is a copy of the home page.
export const metadata: Metadata = {
  title: "Projects",
  description: site.description,
  alternates: { canonical: "/projects" },
};

/**
 * The long-form listing: every project, screenshot first, in the same order as `projects`.
 * The home page shows the head of that list and links here for the rest.
 *
 * The heading is written out rather than delegated to `Section` because this route needs an
 * `h1` — `Section` renders the `h2` a section of the home page under its own `h1` wants —
 * but the spacing is `Section`'s, so the two pages set out on the same grid.
 */
export default function ProjectsPage() {
  return (
    <>
      <TopBar />
      <main id="main" className="page">
        <section
          id="all-projects"
          aria-labelledby="all-projects-title"
          className="px-6 py-14 max-sm:px-4 max-md:py-10"
        >
          <h1 id="all-projects-title" aria-label="All projects" className="mb-2 text-[15px] font-normal">
            <Prompt command="ls -la ~/projects" />
          </h1>
          <p className="mb-6">
            <Link href="/" className="text-cyan">
              ← home
            </Link>
          </p>

          <div className="grid gap-6">
            {projects.map((p) => (
              <ProjectSpotlight key={p.slug} project={p} />
            ))}
          </div>
        </section>
      </main>
      <BottomBar />
    </>
  );
}
