export type ProjectLinks = { github?: string; site?: string; appStore?: string; googlePlay?: string };
export type ProjectImage =
  | { kind: "spotlight"; src: string; alt: string }
  | { kind: "logo"; src: string; alt: string }
  | { kind: "folder" };
export type Project = {
  slug: string;
  title: string;
  blurb: string;            // exactly one sentence
  tech: string[];
  links: ProjectLinks;
  logo?: string;            // 192px PNG for the compact card
  image: ProjectImage;      // for Spotlight
  meta?: string;            // small muted line, product facts only
  placement: "spotlight" | "card" | "all";
};

export const projects: Project[] = [
  {
    slug: "gasmap",
    title: "GasMap",
    blurb: "Find the cheapest gas nearby, with live prices and trends for every station around you.",
    tech: ["React Native", "Expo", "Fastify", "PostgreSQL"],
    links: {
      site: "https://gasmap.ai",
      appStore: "https://apps.apple.com/ca/app/gasmap/id6789210117",
      googlePlay: "https://play.google.com/store/apps/details?id=com.olivanceplatforms.gasmap",
    },
    logo: "/projects/gasmap-192.png",
    image: { kind: "spotlight", src: "/projects/gasmap-spotlight.png", alt: "GasMap's map screen showing live station prices" },
    meta: "iOS and Android · 5.0 on the App Store",
    placement: "spotlight",
  },
  {
    slug: "rocspace",
    title: "RocSpace",
    blurb: "A desktop workspace for running Claude Code, Codex and other coding agents side by side.",
    tech: ["Rust", "Tauri", "React", "TypeScript"],
    links: { github: "https://github.com/rocchettilucas/RocSpace" },
    logo: "/projects/rocspace-192.png",
    image: { kind: "logo", src: "/projects/rocspace-192.png", alt: "RocSpace logo" },
    placement: "card",
  },
  {
    slug: "winlane",
    title: "WinLane.GG",
    blurb: "Counter-pick analytics for League of Legends, used by 500+ players every month.",
    tech: ["React", "Python", "FastAPI", "PostgreSQL"],
    links: { site: "https://winlane.gg" },
    logo: "/projects/winlane-192.png",
    image: { kind: "logo", src: "/projects/winlane-192.png", alt: "WinLane.GG logo" },
    placement: "card",
  },
  {
    slug: "nhl-dashboard",
    title: "NHL Player Dashboard",
    blurb: "Career and game-by-game stats for 23,000+ NHL players, with live scores and comparisons.",
    tech: ["React", "JavaScript", "NHL API"],
    links: { github: "https://github.com/rocchettilucas/NHL-Player-Dashboard", site: "https://nhl-player-dashboard.vercel.app" },
    logo: "/projects/nhl-192.png",
    image: { kind: "logo", src: "/projects/nhl-192.png", alt: "NHL Player Dashboard logo" },
    placement: "all",
  },
  {
    slug: "pathwayr",
    title: "PathwayR",
    blurb: "Authentication and role-based access for a research platform used by students at five universities.",
    tech: ["React", "TypeScript"],
    links: { site: "https://pathwayr.com" },
    logo: "/projects/pathwayr-192.png",
    image: { kind: "spotlight", src: "/projects/pathwayr-home.png", alt: "PathwayR homepage" },
    placement: "all",
  },
  {
    slug: "portfolio-v2",
    title: "Portfolio v2",
    blurb: "This site — the second iteration of my portfolio, rebuilt from the ground up, with the previous version still on GitHub.",
    tech: ["Next.js", "React", "TypeScript", "Tailwind"],
    links: { github: "https://github.com/rocchettilucas/portfolio-v2" },
    image: { kind: "folder" },
    placement: "all",
  },
];

export const homeSpotlight = projects.find((p) => p.placement === "spotlight")!;
export const homeCards = projects.filter((p) => p.placement === "card");
export const allProjects = projects.filter((p) => p.placement === "all");

export type Role = { company: string; title: string; dates: string; bullets: string[]; site?: string };
export const experience: Role[] = [
  {
    company: "WinLane.GG",
    title: "Software Engineer",
    dates: "2025 – present",
    site: "https://winlane.gg",
    bullets: [
      "League of Legends matchup analytics used by 500+ players every month.",
      "Versioned REST API over a normalized PostgreSQL schema, deployed on Vercel and Render.",
      "A daily pipeline precomputes thousands of matchups so responses return in under five seconds.",
      "Ranking model recalibrates automatically on every Riot data release.",
    ],
  },
  {
    company: "City of Mississauga",
    title: "Technical Operations",
    dates: "Jun 2023 – present",
    bullets: [
      "Technical setup, stage transitions and A/V for 70+ live events — Raptors 905, Toronto Rock, Steelheads and the Scotties Tournament of Hearts — at venues hosting 5,000+ attendees.",
      "Live coordination across 5+ departments during events.",
    ],
  },
  {
    company: "Best Buy",
    title: "Geek Squad Consultation Agent",
    dates: "Oct 2020 – Feb 2021",
    bullets: [
      "Root-cause diagnosis of hardware, software and network issues across Windows, macOS and mobile.",
      "OS installs, component-level upgrades and data recovery with verified integrity.",
      "Explained technical findings to non-technical customers.",
    ],
  },
];

export type School = { name: string; logo: string; degree?: string; dates: string; lines: string[] };
export const education: School[] = [
  {
    name: "University of Toronto",
    logo: "/uoft.png",
    degree: "Honours Bachelor of Science, Computer Science & Information Technology",
    dates: "2026",
    lines: ["GPA 3.78 / 4.00 · Dean's List", "Data Structures · Algorithms · Operating Systems · Machine Learning · Artificial Intelligence"],
  },
  {
    name: "Google Developer Student Club — UTM",
    logo: "/gdsc.png",
    degree: "Student Developer",
    dates: "Sept 2024 – Apr 2026",
    lines: ["DeerHacks — Top 3 finish"],
  },
];

export type Stack = { name: string; icon: string };
export const coreStack: Stack[] = [
  { name: "TypeScript", icon: "/icons/typescript.svg" },
  { name: "React & React Native", icon: "/icons/react.svg" },
  { name: "Rust", icon: "/icons/rust.svg" },
  { name: "Python & FastAPI", icon: "/icons/python.svg" },
  { name: "PostgreSQL", icon: "/icons/postgresql.svg" },
  { name: "Node.js", icon: "/icons/nodejs.svg" },
];
