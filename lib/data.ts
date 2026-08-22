export interface Project {
  title: string;
  description: string;
  tech: string[];
  image: string;
  imageContain?: boolean; // true for logos, false for screenshots
  liveUrl?: string;
  githubUrl?: string;
  date: string;
}

export interface Experience {
  company: string;
  role: string;
  date: string;
  location: string;
  description: string; // short 1-2 sentence summary, not a reiteration of the resume
  tech: string[];
  icon: string; // lucide icon key for visual differentiation
  logo?: string; // optional company logo image (overrides icon when present)
  logoCover?: boolean; // logo image has its own background, so fill the tile (object-cover)
  tag?: string; // optional label, e.g. "Startup"
  metric?: string; // short highlight or status (e.g. "Currently working on")
  liveUrl?: string;
  lead?: boolean; // most prominent entry
}

export interface Skill {
  name: string;
  icon: string; // path to SVG or icon identifier
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export const personalInfo = {
  name: "Lucas Rocchetti",
  location: "Toronto, ON",
  email: "lucasrocchetti@outlook.com",
  linkedin: "https://linkedin.com/in/lucasrocchetti",
  github: "https://github.com/rocchettilucas",
  roles: ["New Grad @ UofT", "Full-Stack Developer", "Software Engineer"],
  bio: "Computer Science and Information Technology new grad from the University of Toronto, focused on designing and building full-stack applications.",
};

export const about = {
  image: "/about/lucas.jpg",
  paragraphs: [
    "I'm a Computer Science and Information Technology graduate from the University of Toronto with a passion for building software. I enjoy designing and developing full-stack applications, solving complex technical challenges, and creating products that deliver real value to users.",
    "My interests include software engineering, systems design, and product development. I'm always looking for opportunities to learn, build, and contribute to meaningful technology.",
  ],
};

export const experience: Experience[] = [
  {
    company: "WinLane.GG",
    role: "Co-Founder & Lead Engineer",
    date: "Apr 2026 – Present",
    location: "Mississauga, ON",
    description:
      "A League of Legends analytics platform with 500+ monthly users. I lead development across the full stack, including the data pipeline, REST API, React frontend, and cloud deployment.",
    tech: ["React", "TypeScript", "Python", "FastAPI", "PostgreSQL", "Riot Games API"],
    icon: "gamepad",
    logo: "/experience/winlane.png",
    metric: "Currently working on",
    liveUrl: "https://winlane.gg",
    lead: true,
  },
  {
    company: "City of Mississauga",
    role: "Technical Operations",
    date: "Jun 2023 – Present",
    location: "Mississauga, ON",
    description:
      "I manage the technical setup, stage transitions, and A/V infrastructure for 70+ live events (Raptors 905, Toronto Rock, and more) at venues hosting 5,000+ attendees.",
    tech: [],
    icon: "building",
    logo: "/experience/mississauga.avif",
    logoCover: true,
  },
  {
    company: "Best Buy - Geek Squad",
    role: "Geek Squad Agent",
    date: "Oct 2020 – Feb 2021",
    location: "Mississauga, ON",
    description:
      "Diagnosed and resolved hardware, software, and network issues across Windows, macOS, and mobile devices, including OS installation, upgrades, and data recovery.",
    tech: [],
    icon: "wrench",
    logo: "/experience/bestbuy.webp",
    logoCover: true,
  },
];

export const projects: Project[] = [
  {
    title: "RocSpace",
    description:
      "An open-source desktop application that brings Claude Code, Codex, OpenCode, and standard shells into a single workspace, with offline on-device voice dictation.",
    tech: ["Tauri 2", "Rust", "React", "TypeScript", "Whisper.cpp", "Tokio"],
    image: "/projects/rocspace-logo.png",
    imageContain: true,
    liveUrl: "#",
    githubUrl: "https://github.com/rocchettilucas/RocSpace",
    date: "May 2026 – Present",
  },
  {
    title: "NHL Player Dashboard",
    description:
      "An analytics dashboard for searching 23,000+ NHL players and exploring their career statistics and game-by-game performance.",
    tech: ["React", "TypeScript", "Recharts", "NHL API", "Vercel"],
    image: "/projects/nhl-dashboard-logo.svg",
    imageContain: true,
    liveUrl: "https://nhl-player-dashboard.vercel.app",
    githubUrl: "#",
    date: "Apr 2026",
  },
  {
    title: "PathwayR",
    description:
      "A platform that helps students find research opportunities, browse professors, and track scholarships across Canadian universities.",
    tech: ["React", "Node.js", "Supabase", "Vercel"],
    image: "/projects/pathwayr.svg",
    imageContain: true,
    liveUrl: "https://pathwayr.com",
    githubUrl: "#",
    date: "Jan 2026 – Apr 2026",
  },
];

export const skills: Skill[] = [
  // Languages
  { name: "Python", icon: "python" },
  { name: "TypeScript", icon: "typescript" },
  { name: "JavaScript", icon: "javascript" },
  { name: "Rust", icon: "rust" },
  { name: "Java", icon: "java" },
  { name: "C++", icon: "cplusplus" },
  { name: "C#", icon: "csharp" },
  { name: "SQL", icon: "sql" },
  { name: "HTML", icon: "html5" },
  { name: "CSS", icon: "css3" },
  // Frameworks
  { name: "React", icon: "react" },
  { name: "Node.js", icon: "nodejs" },
  { name: "FastAPI", icon: "fastapi" },
  { name: "pandas", icon: "pandas" },
  { name: "NumPy", icon: "numpy" },
  { name: "scikit-learn", icon: "scikitlearn" },
  { name: "PyTorch", icon: "pytorch" },
  { name: "Tailwind CSS", icon: "tailwindcss" },
  // Developer Tools
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "Supabase", icon: "supabase" },
  { name: "Docker", icon: "docker" },
  { name: "Git", icon: "git" },
  { name: "GitHub", icon: "github" },
  { name: "Bash", icon: "bash" },
  { name: "pytest", icon: "pytest" },
  { name: "CI/CD", icon: "cicd" },
  // Cloud & Systems
  { name: "AWS", icon: "amazonwebservices" },
  { name: "Vercel", icon: "vercel" },
  { name: "Render", icon: "render" },
  { name: "Linux", icon: "linux" },
  { name: "Unix", icon: "unix" },
  { name: "macOS", icon: "macos" },
  { name: "Windows", icon: "windows" },
];

export const education = {
  school: "University of Toronto",
  degree: "Honours Bachelors in Computer Science & Information Technology",
  graduation: "Sept 2021 – June 2026",
  location: "Toronto, ON",
  logo: "/uoft.png",
  club: {
    name: "Google Developer Student Club - UTM",
    role: "Student Developer",
    date: "Sept 2024 – Apr 2026",
    location: "Mississauga, ON",
    logo: "/gdsc.png",
    detail:
      "Placed Top 3 at DeerHacks, where I led a team to build a real-time two-player web game in React based on Nash Equilibrium game theory.",
  },
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];
