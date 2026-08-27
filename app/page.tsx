import About from "@/components/About";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import Work from "@/components/Projects";
import TopBar from "@/components/terminal/TopBar";
import BottomBar from "@/components/terminal/BottomBar";
import { projects } from "@/lib/data";
import { jsonLd } from "@/lib/jsonld";

// The two apps worth describing to search engines as products. Everything here is already
// visible on the page — title, blurb, platform, link — nothing internal.
const appsJsonLd = projects
  .filter((p) => ["gasmap", "rocspace"].includes(p.slug))
  .map((p) => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: p.title,
    description: p.blurb,
    applicationCategory: p.slug === "gasmap" ? "TravelApplication" : "DeveloperApplication",
    operatingSystem: p.slug === "gasmap" ? "iOS, Android" : "macOS, Windows, Linux",
    url: p.links.site ?? p.links.github,
    author: { "@type": "Person", name: "Lucas Rocchetti" },
  }));

export default function Home() {
  return (
    <>
      <TopBar />
      <main id="main" className="page">
        <Hero />
        <About />
        <Work />
        <Experience />
        <Contact />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(appsJsonLd) }}
        />
      </main>
      <BottomBar />
    </>
  );
}
