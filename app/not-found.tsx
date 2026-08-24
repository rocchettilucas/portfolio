import type { Metadata } from "next";
import Link from "next/link";
import TopBar from "@/components/terminal/TopBar";
import BottomBar from "@/components/terminal/BottomBar";
import Prompt from "@/components/terminal/Prompt";

// A 404 is not a page anyone should reach from search.
export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <TopBar />
      <main id="main" className="page flex flex-col justify-center px-6 py-14 max-sm:px-4">
        <h1 aria-label="Page not found" className="text-[15px] font-normal">
          <Prompt command="cat /404" />
        </h1>
        <p className="mt-3 text-muted-strong">cat: /404: No such file or directory</p>
        <p className="mt-6">
          <span aria-hidden className="prompt">
            $
          </span>{" "}
          <Link href="/" aria-label="Back to the home page">
            cd ~
          </Link>
          <span className="text-muted-strong"> — back to the home page</span>
        </p>
      </main>
      <BottomBar />
    </>
  );
}
