import type { Metadata } from "next";
import Link from "next/link";

// A 404 is not a page anyone should reach from search.
export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-[70vh] max-w-[1040px] flex-col items-start justify-center px-6"
    >
      <p className="mb-3 text-muted">
        <span className="prompt">$</span> cd ~/404
      </p>
      <h1 className="mb-4 text-2xl">That page doesn&apos;t exist.</h1>
      <Link href="/">cd ~</Link>
    </main>
  );
}
