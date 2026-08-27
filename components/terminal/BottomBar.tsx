import { site } from "@/lib/site";

export default function BottomBar() {
  return (
    <footer className="bar bar-bottom">
      {/* One centred line. The socials and the visitor count live in the top bar now, so
          the footer is a signature and not a second navigation. */}
      <div className="bar-inner justify-center gap-1.5 text-[12px] text-muted-strong">
        {/* Decoration: the line beside it already names the site, and a second
            announcement of "site status" would carry no information with it. */}
        <span aria-hidden className="text-green">
          ●
        </span>
        <span className="truncate">
          © {site.name} · {new Date().getFullYear()} · v{site.version}
        </span>
      </div>
    </footer>
  );
}
