import { SECTIONS, type SectionId } from "@/lib/sections";
import { site } from "@/lib/site";

// Pure command parser for the command palette. No DOM/window imports here — this module
// must run in any JS environment (tests, SSR) and stay UI-free.
//
// Invariant: every SectionId must also be a valid command name, so scroll targets never
// desync from the palette's command list (see lib/sections.ts for the mirror of this note).

export type Action =
  | { kind: "scroll"; id: SectionId }
  | { kind: "open"; href: string }
  | { kind: "print"; lines: string[] }
  | { kind: "clear" }
  | { kind: "notfound"; name: string }
  | { kind: "empty" };

export const COMMANDS = [
  "help",
  "about",
  "projects",
  "experience",
  "skills",
  "education",
  "contact",
  "github",
  "linkedin",
  "clear",
  "whoami",
] as const;

type Command = (typeof COMMANDS)[number];

const DESCRIPTIONS: Record<Command, string> = {
  help: "list commands",
  about: "who I am",
  projects: "what I've built",
  experience: "where I've worked",
  skills: "what I work with",
  education: "where I studied",
  contact: "how to reach me",
  github: "open GitHub",
  linkedin: "open LinkedIn",
  clear: "clear the screen",
  whoami: "print identity",
};

function href(label: "GitHub" | "LinkedIn"): string {
  const social = site.socials.find(s => s.label === label);
  if (!social) throw new Error(`missing social link for ${label}`);
  return social.href;
}

function isSectionId(name: string): name is SectionId {
  return (SECTIONS as readonly string[]).includes(name);
}

export function runCommand(input: string): Action {
  const raw = input.trim().split(/\s+/)[0] ?? "";
  if (raw === "") return { kind: "empty" };

  const name = raw.toLowerCase();

  if (isSectionId(name)) return { kind: "scroll", id: name };

  switch (name as Command) {
    case "github":
      return { kind: "open", href: href("GitHub") };
    case "linkedin":
      return { kind: "open", href: href("LinkedIn") };
    case "help":
      return {
        kind: "print",
        lines: COMMANDS.map(cmd => `${cmd.padEnd(12)}${DESCRIPTIONS[cmd]}`),
      };
    case "whoami":
      return {
        kind: "print",
        lines: [
          "Lucas Rocchetti",
          "Based in: Toronto, Canada",
          "Role: Software Engineer",
          "Building apps and tools people actually use — from a gas-price app on iOS and Android to a desktop workspace for coding agents.",
        ],
      };
    case "clear":
      return { kind: "clear" };
    default:
      return { kind: "notfound", name: raw };
  }
}

export function complete(input: string): string[] {
  const prefix = input.trim().toLowerCase();
  return [...COMMANDS].filter(cmd => cmd.startsWith(prefix)).sort();
}
