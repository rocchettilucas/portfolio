import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Software from "@/components/Software";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Software />
      </main>
      <Footer />
    </>
  );
}
