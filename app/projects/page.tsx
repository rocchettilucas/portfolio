import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Spotlight from "@/components/Spotlight";
import { allProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "All projects",
  description: "Everything I've built — apps, tools and experiments.",
  alternates: { canonical: "/projects" },
  openGraph: { title: "All projects", url: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-[1000px] px-10 pb-20 pt-32 max-md:px-5">
        <div className="mb-8 flex items-center justify-between gap-5">
          <h1 className="text-[34px] font-medium">All projects</h1>
          <Link href="/" className="arrow-link text-[15px]">
            <span aria-hidden>←</span> Back home
          </Link>
        </div>
        <div className="grid gap-6">
          {allProjects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <Spotlight project={p} />
            </Reveal>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
