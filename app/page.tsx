import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Software from "@/components/Software";
import Experience from "@/components/Experience";
import About from "@/components/About";
import Education from "@/components/Education";
import Contact from "@/components/Contact";

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
      </main>
      <Footer />
    </>
  );
}
