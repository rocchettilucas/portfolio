export interface Project {
  title: string;
  description: string;
  bullets: string[];
  tech: string[];
  image: string;
  imageContain?: boolean; // true for logos, false for screenshots
  liveUrl?: string;
  githubUrl?: string;
  date: string;
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
  email: "lucas.rocchetti@mail.utoronto.ca",
  phone: "(289) 834-2783",
  linkedin: "https://linkedin.com/in/lucasrocchetti",
  github: "https://github.com/rocchettilucas",
  roles: ["Aspiring Software Engineer", "Full-Stack Developer", "New Grad @ UofT"],
  bio: "Computer Science graduate from the University of Toronto with a passion for building full-stack applications that solve real problems. Experienced with modern web technologies and cloud platforms.",
};

export const projects: Project[] = [
  {
    title: "PathwayR",
    description:
      "A platform that helps undergrads discover research opportunities, browse 1,500+ professors, and track scholarships across 4+ Canadian universities.",
    bullets: [
      "Grew platform to 4+ universities with an active multi-institution user base",
      "Implemented institutional email verification and manual approval pipeline for professors and mentors",
      "Architected real-time data flows with Supabase for hundreds of concurrent users, deployed on Vercel",
    ],
    tech: ["React", "Node.js", "Supabase", "Vercel"],
    image: "/projects/pathwayr.svg",
    imageContain: true,
    liveUrl: "https://pathwayr.com",
    githubUrl: "#",
    date: "Jan 2026 – Present",
  },
  {
    title: "WinLane.gg",
    description:
      "Find the best counter-picks in League of Legends. Analyzes win rates across 170+ champions and all 5 roles to give you statistically-backed recommendations.",
    bullets: [
      "Engineered matchup tracking across 170+ champions computing win rates across 5 roles using the Riot Games API",
      "Built a scheduled data pipeline aggregating per-matchup win rates by role and patch version into PostgreSQL",
      "Designed a composite ranking algorithm weighting win rate, sample size confidence, and role-adjusted performance",
    ],
    tech: ["React", "TypeScript", "Python", "FastAPI", "Supabase", "Riot API"],
    image: "/projects/league-of-counters.png",
    imageContain: true,
    liveUrl: "https://winlane.gg",
    githubUrl: "#",
    date: "Apr 2026 – Present",
  },
  {
    title: "RocSpace",
    description: "",
    bullets: [],
    tech: [],
    image: "/projects/rocspace-logo.png",
    imageContain: true,
    liveUrl: "#",
    githubUrl: "https://github.com/rocchettilucas/RocSpace",
    date: "",
  },
  {
    title: "NHL Player Dashboard",
    description:
      "A sports analytics tool that lets you search any NHL player and instantly view their career stats, game logs, and interactive performance charts.",
    bullets: [
      "Built dynamic search fetching real-time career and game-log stats from the NHL public API",
      "Designed interactive Recharts visualizations with season-over-season trend lines and per-game bar charts",
      "Delivered a production-ready sports analytics tool with live API integration and responsive dark-theme UI",
    ],
    tech: ["React", "Recharts", "NHL API", "Vercel"],
    image: "/projects/nhl-dashboard-logo.svg",
    imageContain: true,
    liveUrl: "https://nhl-player-dashboard.vercel.app",
    githubUrl: "#",
    date: "Apr 2026",
  },
];

export const skills: Skill[] = [
  { name: "Python", icon: "python" },
  { name: "Java", icon: "java" },
  { name: "C++", icon: "cplusplus" },
  { name: "C#", icon: "csharp" },
  { name: "JavaScript", icon: "javascript" },
  { name: "TypeScript", icon: "typescript" },
  { name: "SQL", icon: "sql" },
  { name: "HTML", icon: "html5" },
  { name: "CSS", icon: "css3" },
  { name: "React", icon: "react" },
  { name: "Node.js", icon: "nodejs" },
  { name: "FastAPI", icon: "fastapi" },
  { name: "Tailwind CSS", icon: "tailwindcss" },
  { name: "pandas", icon: "pandas" },
  { name: "NumPy", icon: "numpy" },
  { name: "scikit-learn", icon: "scikitlearn" },
  { name: "PyTorch", icon: "pytorch" },
  { name: "Git", icon: "git" },
  { name: "GitHub", icon: "github" },
  { name: "Docker", icon: "docker" },
  { name: "Supabase", icon: "supabase" },
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "AWS", icon: "amazonwebservices" },
  { name: "Azure", icon: "azure" },
  { name: "Google Cloud", icon: "googlecloud" },
  { name: "Vercel", icon: "vercel" },
  { name: "Linux", icon: "linux" },
  { name: "Bash", icon: "bash" },
];

export const education = {
  school: "University of Toronto",
  degree: "Honours Bachelor of Science in Computer Science & Information Technology",
  graduation: "Expected June 2026",
  location: "Toronto, ON",
};

export const navLinks = [
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];
