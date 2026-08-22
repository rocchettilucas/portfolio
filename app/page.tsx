import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Software from "@/components/Software";
import Experience from "@/components/Experience";
import About from "@/components/About";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
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
      <Nav />
      <main id="main">
        <Hero />
        <Software />
        <Experience />
        <About />
        <Education />
        <Contact />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(appsJsonLd) }}
        />
      </main>
      <Footer />
    </>
  );
}
