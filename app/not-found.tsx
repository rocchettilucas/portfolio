import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// A 404 is not a page anyone should reach from search.
export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Nav />
      <main
        id="main"
        className="mx-auto flex min-h-[70vh] max-w-[1000px] flex-col items-start justify-center px-10 pt-16 max-md:px-5"
      >
        <p className="mb-2 text-sm text-muted">404</p>
        <h1 className="mb-4 text-[40px] font-medium">That page doesn&apos;t exist.</h1>
        <Link href="/" className="arrow-link">
          <span aria-hidden>←</span> Back home
        </Link>
      </main>
      <Footer />
    </>
  );
}
