import { SECTIONS, type SectionId } from "@/lib/sections";
import { socialHref } from "@/lib/site";

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
  "projects",
  "experience",
  "skills",
  "education",
  "github",
  "linkedin",
  "clear",
  "whoami",
] as const;

type Command = (typeof COMMANDS)[number];

const DESCRIPTIONS: Record<Command, string> = {
  help: "list commands",
  projects: "what I've built",
  experience: "where I've worked",
  skills: "what I work with",
  education: "where I studied",
  github: "open GitHub",
  linkedin: "open LinkedIn",
  clear: "clear the screen",
  whoami: "print identity",
};

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
      return { kind: "open", href: socialHref("GitHub") };
    case "linkedin":
      return { kind: "open", href: socialHref("LinkedIn") };
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
          "Software engineer · Toronto, Canada",
          "I'm a software engineer based in Toronto.",
        ],
      };
    case "clear":
      return { kind: "clear" };
    default:
      return { kind: "notfound", name: raw };
  }
}

export function complete(input: string): string[] {
  const prefix = (input.trim().split(/\s+/)[0] ?? "").toLowerCase();
  return [...COMMANDS].filter(cmd => cmd.startsWith(prefix)).sort();
}
