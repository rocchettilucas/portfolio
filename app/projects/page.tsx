import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Spotlight from "@/components/Spotlight";
import { allProjects } from "@/lib/data";
import { site } from "@/lib/site";

const description = "Everything I've built — apps, tools and experiments.";
const ogImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${site.name} — software engineer in Toronto`,
};

export const metadata: Metadata = {
  title: "All projects",
  description,
  alternates: { canonical: "/projects" },
  // Spelled out in full: an openGraph/twitter override replaces the inherited object rather
  // than merging into it, so type/locale/siteName — and the opengraph-image the file
  // convention would otherwise contribute — all have to be repeated here.
  openGraph: {
    title: "All projects",
    description,
    url: "/projects",
    type: "website",
    locale: "en_CA",
    siteName: site.name,
    images: [ogImage],
  },
  twitter: { card: "summary_large_image", title: "All projects", description, images: [ogImage] },
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
        {/* The cards carry h3s; this keeps the outline h1 → h2 → h3 without a visible label. */}
        <h2 className="sr-only">Projects</h2>
        <div className="grid gap-6">
          {allProjects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <Spotlight project={p} priority={i === 0} />
            </Reveal>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
