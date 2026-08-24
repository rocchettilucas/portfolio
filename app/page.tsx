import About from "@/components/About";
import Contact from "@/components/Contact";
import Education from "@/components/Education";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import TopBar from "@/components/terminal/TopBar";
import BottomBar from "@/components/terminal/BottomBar";

// The sections land inside <main> one task at a time; the chrome around them is final.
// Still to come, in the gaps their comments mark: Projects (task 8) and Experience
// (task 9). The `appsJsonLd` block that used to live here comes back with the Projects
// section (recover it from `git show 0fe716f:app/page.tsx`).
export default function Home() {
  return (
    <>
      <TopBar />
      <main id="main" className="page">
        <Hero />
        <About />
        {/* Projects — task 8 */}
        {/* Experience — task 9 */}
        <Skills />
        <Education />
        <Contact />
      </main>
      <BottomBar />
    </>
  );
}
