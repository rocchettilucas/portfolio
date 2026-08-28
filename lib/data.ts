export type ProjectLinks = { github?: string; site?: string; appStore?: string; googlePlay?: string };
export type Project = {
  slug: string;
  title: string;
  blurb: string;            // exactly one sentence — the card line
  description: string[];    // 2-3 short sentences for /projects, one per array item
  image: string;            // 16/10 screenshot, shown on the home card and the /work spotlight
  // An alternate 16/10 shot for the /work spotlight only. The card stays on `image` — the
  // spotlight runs the full column width, which has room for a shot the card would shrink
  // past reading. Left undefined, the spotlight falls back to `image` as before.
  spotlightImage?: string;
  tech: string[];
  links: ProjectLinks;
  logo?: string;            // 192px PNG for the compact card
  dates: string;            // when it was worked on, resume-style ("Jun 2026 – present")
  meta?: string;            // small muted line, product facts only
  rating?: number;          // store rating, rendered after `meta` behind a star
  // "featured" and "card" are what the home page renders; "list" only appears on /projects.
  // The two differ by emphasis, not by size: a featured project gets a star beside its name
  // and nothing else — the three home cards are the same card at the same width.
  placement: "featured" | "card" | "list";
};

export const projects: Project[] = [
  {
    slug: "gasmap",
    title: "GasMap",
    dates: "Jun 2026 – present",
    blurb: "Find the cheapest gas nearby, with live prices and trends for every station around you.",
    description: [
      "Cross-platform gas-price app for Ontario drivers, with live prices for 3,000+ stations.",
      "Reached 200+ downloads in its first month and holds a 5.0 rating on the App Store.",
      "React Native client on a FastAPI geospatial API backed by PostgreSQL/PostGIS and Redis.",
    ],
    image: "/projects/gasmap-hand.webp",
    // The home card keeps the hand shot; the spotlight gets the three screens the app is
    // actually made of — home, map, station detail — which only read at full column width.
    spotlightImage: "/projects/gasmap-trio.webp",
    tech: ["React Native", "Expo", "FastAPI", "PostgreSQL / PostGIS", "Redis"],
    links: {
      site: "https://gasmap.ai",
      appStore: "https://apps.apple.com/ca/app/gasmap/id6789210117",
      googlePlay: "https://play.google.com/store/apps/details?id=com.olivanceplatforms.gasmap",
    },
    logo: "/projects/gasmap-192.png",
    meta: "iOS and Android",
    rating: 5.0,
    placement: "featured",
  },
  {
    slug: "rocspace",
    title: "RocSpace",
    dates: "May 2026 – Aug 2026",
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
    dates: "Apr 2026 – Jun 2026",
    blurb: "Champion-pick recommendations for League of Legends, ranked against the enemy team across 170+ champions.",
    description: [
      "Ranks champion picks against an opponent's team composition across five roles, with 4,500+ indexed matchup pages.",
      "A FastAPI/PostgreSQL pipeline pulls Riot's Data Dragon after each patch and recomputes recommendations.",
    ],
    image: "/projects/winlane-home.webp",
    tech: ["React", "TypeScript", "FastAPI", "PostgreSQL"],
    links: { site: "https://winlane.gg" },
    logo: "/projects/winlane-192.png",
    placement: "card",
  },
  {
    slug: "pathwayr",
    title: "PathwayR",
    dates: "Jan 2026 – Apr 2026",
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
  // The two Unity projects have no product mark to sit beside the name, so `logo` is left
  // undefined and the card falls back to the folder glyph the listing already draws.
  {
    slug: "hallway-duty",
    title: "Hallway Duty",
    dates: "Sep 2024 – Dec 2024",
    blurb: "A first-person cleanup game set in a school hallway, where the job is to collect every piece of garbage left on the floor.",
    description: [
      "A first-person game about clearing a school hallway of litter, with a running count of the garbage collected and wet-floor hazards to work around.",
      "Built in Unity with C#, with every 3D asset in the level — lockers, doors, bins and signage — modelled by hand in Autodesk Maya.",
      "Submitted to itch.io.",
    ],
    image: "/projects/hallway-duty-shot.webp",
    tech: ["Unity", "C#", "Autodesk Maya"],
    links: { site: "https://lucasrocchetti.itch.io/hallway-duty" },
    placement: "list",
  },
  {
    slug: "office-outbreak",
    title: "Office Outbreak",
    dates: "Feb 2025 – Apr 2025",
    blurb: "A first-person wave shooter — fight off rounds of zombies through an office building with an arsenal of guns.",
    description: [
      "A round-based survival FPS set in an office building, where each wave sends more zombies than the one before it.",
      "Multiple weapons are available as the rounds escalate.",
      "Built in Unity with C#.",
    ],
    image: "/projects/office-outbreak-shot.webp",
    tech: ["Unity", "C#"],
    links: {},
    placement: "list",
  },
];

// What the home page lists, in the order written above — the "list" entries are held back for
// /projects. Filtered rather than sliced so reordering the array reorders the page with it.
export const homeProjects = projects.filter((p) => p.placement === "featured" || p.placement === "card");

// Two or three bullets per role rather than a paragraph: the section is a tab list now, and a
// panel that swaps one block of prose for another gives the eye nothing to land on. `short` is
// the tab label — the company name trimmed to what fits a 200px column.
export type Role = {
  company: string;
  short: string;
  title: string;
  dates: string;
  site?: string;
  bullets: string[];        // 2-3 items, one sentence each
};
export const experience: Role[] = [
  {
    company: "Olivance Platforms",
    short: "GasMap",
    title: "Software Engineer",
    dates: "Jun 2026 – present",
    site: "https://gasmap.ai",
    bullets: [
      "Launched GasMap on iOS and Android — 200+ downloads across Ontario in the first month.",
      "Built the React Native app and the FastAPI geospatial backend serving live prices for 3,000+ stations.",
      "Cut initial map load from 17.7 s to 234 ms by reworking the station lookup — no schema change, no downtime.",
    ],
  },
  {
    company: "PathwayR",
    short: "PathwayR",
    title: "Software Developer",
    dates: "Jan 2026 – Apr 2026",
    site: "https://pathwayr.com",
    bullets: [
      "Built role-based registration for students, mentors and professors across five Canadian universities.",
      "Added institutional-email verification, admin approval and role-specific onboarding.",
      "Supported verified sign-up across 1,500+ professor profiles and a 500+ scholarship catalog.",
    ],
  },
  {
    company: "City of Mississauga",
    short: "City of Mississauga",
    title: "Operations Coordinator",
    dates: "Jun 2023 – present",
    bullets: [
      "Plan operations for 70+ events a year at the Mississauga Sports and Entertainment Centre.",
      "Define venue configurations and attendance forecasts across five municipal departments.",
      "Coordinate facility teams and event staff for crowds of 5,000+.",
    ],
  },
];

// Read as one line by About — `${degree}, ${name} · ${dates}` — so every field is required.
export type School = { name: string; degree: string; dates: string };
export const education: School[] = [
  {
    name: "University of Toronto",
    degree: "Honours Bachelor in Computer Science and Information Technology",
    dates: "2021 – 2026",
  },
];

// The two paragraphs beside the photo in `about`. Prose, so it lives here rather than in
// the component: the section is copy with a picture next to it, not a layout with copy in it.
export const about = {
  paragraphs: [
    "I'm a Computer Science and Information Technology graduate from the University of Toronto with a passion for building software. I enjoy designing and developing full-stack applications, solving complex technical challenges, and creating products that deliver real value to users.",
    "My interests include software engineering, systems design, and product development. I'm always looking for opportunities to learn, build, and contribute to meaningful technology.",
  ],
};

export type Stack = { name: string; icon: string };
export type SkillGroup = { title: string; items: Stack[] };

// The stack, grouped. About renders it as one flat row of chips (`skills` below) and the
// grouping is what keeps that row in a sensible order — languages, then what they run on,
// then what they store into. Icons live in public/icons/.
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

// What About renders: the groups above, flattened in the order they are written. A name may
// repeat an icon (React and React Native share one mark) — the chips are read as a list of
// things worked with, not as a set of logos.
export const skills: Stack[] = skillGroups.flatMap((g) => g.items);
