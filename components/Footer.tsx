import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="px-5 pb-10 pt-16 text-center text-sm text-muted">
      <p>Built and designed by {site.name}.</p>
      <p>© {new Date().getFullYear()}</p>
    </footer>
  );
}
