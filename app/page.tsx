import TopBar from "@/components/terminal/TopBar";
import BottomBar from "@/components/terminal/BottomBar";

// The sections land inside <main> one task at a time; the chrome around them is final.
// The `appsJsonLd` block that used to live here comes back with the Projects section
// (recover it from `git show 0fe716f:app/page.tsx`).
export default function Home() {
  return (
    <>
      <TopBar />
      <main id="main" className="page" />
      <BottomBar />
    </>
  );
}
