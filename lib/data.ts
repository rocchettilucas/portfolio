export type ProjectLinks = { github?: string; site?: string; appStore?: string; googlePlay?: string };
export type Project = {
  slug: string;
  title: string;
  blurb: string;            // exactly one sentence — the card line
  description: string[];    // 2-3 short sentences for /projects, one per array item
  image: string;            // 16/10 screenshot for the /projects spotlight
  tech: string[];
  links: ProjectLinks;
  logo?: string;            // 192px PNG for the compact card
  meta?: string;            // small muted line, product facts only
  // "featured" and "card" are what the home page renders; "list" only appears on /projects.
  placement: "featured" | "card" | "list";
};

export const projects: Project[] = [
  {
    slug: "gasmap",
    title: "GasMap",
    blurb: "Find the cheapest gas nearby, with live prices and trends for every station around you.",
    description: [
      "Cross-platform gas-price app for Ontario drivers, with live prices for 3,000+ stations.",
      "Reached 200+ downloads in its first month and holds a 5.0 rating on the App Store.",
      "React Native client on a FastAPI geospatial API backed by PostgreSQL/PostGIS and Redis.",
    ],
    image: "/projects/gasmap-shot.webp",
    tech: ["React Native", "Expo", "FastAPI", "PostgreSQL / PostGIS", "Redis"],
    links: {
      site: "https://gasmap.ai",
      appStore: "https://apps.apple.com/ca/app/gasmap/id6789210117",
      googlePlay: "https://play.google.com/store/apps/details?id=com.olivanceplatforms.gasmap",
    },
    logo: "/projects/gasmap-192.png",
    meta: "iOS and Android · 5.0 on the App Store",
    placement: "featured",
  },
  {
    slug: "rocspace",
    title: "RocSpace",
    blurb: "A macOS agentic development environment that runs coding agents and shells side by side in persistent workspaces.",
    description: [
      "Open-source macOS workspace for running Claude Code, Codex and other CLI agents beside real shells, with task tracking that lives in the repository through a bundled MCP server.",
      "Terminal I/O runs on dedicated threads off the async IPC loop, so 16 concurrent sessions stay responsive.",
    ],
    image: "/projects/rocspace-shot.webp",
    tech: ["Rust", "Tauri 2", "React", "TypeScript"],
    links: { github: "https://github.com/rocchettilucas/RocSpace" },
    logo: "/projects/rocspace-192.png",
    placement: "card",
  },
  {
    slug: "winlane",
    title: "WinLane.GG",
    blurb: "Champion-pick recommendations for League of Legends, ranked against the enemy team across 170+ champions.",
    description: [
      "Ranks champion picks against an opponent's team composition across five roles, with 4,500+ indexed matchup pages.",
      "A FastAPI/PostgreSQL pipeline pulls Riot's Data Dragon after each patch and recomputes recommendations.",
    ],
    image: "/projects/winlane-shot.webp",
    tech: ["React", "TypeScript", "FastAPI", "PostgreSQL"],
    links: { site: "https://winlane.gg" },
    logo: "/projects/winlane-192.png",
    placement: "card",
  },
  {
    slug: "pathwayr",
    title: "PathwayR",
    blurb: "Role-based registration and onboarding for a research-opportunity platform used at five Canadian universities.",
    description: [
      "Registration and onboarding for students, mentors and professors on a platform serving five universities.",
      "Institutional-domain verification, admin approval and role-specific flows across 1,500+ professor profiles and 500+ scholarships.",
    ],
    image: "/projects/pathwayr-shot.webp",
    tech: ["React", "Node.js", "PostgreSQL"],
    links: { site: "https://pathwayr.com" },
    logo: "/projects/pathwayr-192.png",
    placement: "list",
  },
];

export const featuredProject = projects.find((p) => p.placement === "featured")!;
export const cardProjects = projects.filter((p) => p.placement === "card");

export type Role = { company: string; title: string; dates: string; site?: string; bullets: string[] };
export const experience: Role[] = [
  {
    company: "Olivance Platforms · GasMap",
    title: "Software Engineer",
    dates: "Jun 2026 – present",
    site: "https://gasmap.ai",
    bullets: [
      "Built and launched GasMap, a gas-price app for iOS and Android — 200+ downloads across Ontario in its first month.",
      "React Native client and FastAPI geospatial API serving live prices for 3,000+ stations by radius, map bounds and location-verified reports.",
      "Cut initial map load from 17.7 s to 234 ms by rewriting the station lookup to use an existing index — no schema change, no downtime.",
    ],
  },
  {
    company: "PathwayR",
    title: "Software Developer",
    dates: "Jan 2026 – Apr 2026",
    site: "https://pathwayr.com",
    bullets: [
      "Built role-based registration for students, mentors and professors on a research platform serving five Canadian universities.",
      "Institutional-domain verification, admin approval and role-specific onboarding across 1,500+ professor profiles.",
    ],
  },
];

export type School = { name: string; logo: string; degree?: string; dates: string; lines: string[] };
export const education: School[] = [
  {
    name: "University of Toronto",
    logo: "/uoft.png",
    degree: "Honours Bachelor of Science, Computer Science & Information Technology",
    dates: "2021 – 2026",
    lines: ["GPA 3.78 / 4.00 · Dean's List", "Data Structures · Algorithms · Operating Systems · Machine Learning"],
  },
];

export type Stack = { name: string; icon: string };
export type SkillGroup = { title: string; items: Stack[] };

// Three boxes on the page, in this order. Icons live in public/icons/.
export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    items: [
      { name: "TypeScript", icon: "/icons/typescript.svg" },
      { name: "Python", icon: "/icons/python.svg" },
      { name: "JavaScript", icon: "/icons/javascript.svg" },
      { name: "Rust", icon: "/icons/rust.svg" },
      { name: "SQL", icon: "/icons/sql.svg" },
      { name: "C#", icon: "/icons/csharp.svg" },
    ],
  },
  {
    title: "Frameworks & runtimes",
    items: [
      { name: "React", icon: "/icons/react.svg" },
      { name: "React Native", icon: "/icons/react.svg" },
      { name: "Expo", icon: "/icons/expo.svg" },
      { name: "Node.js", icon: "/icons/nodejs.svg" },
      { name: "FastAPI", icon: "/icons/fastapi.svg" },
      { name: "Tauri", icon: "/icons/tauri.svg" },
      { name: "Tokio", icon: "/icons/tokio.svg" },
    ],
  },
  {
    title: "Databases & caching",
    items: [
      { name: "PostgreSQL", icon: "/icons/postgresql.svg" },
      { name: "PostGIS", icon: "/icons/postgis.svg" },
      { name: "Redis", icon: "/icons/redis.svg" },
    ],
  },
];
