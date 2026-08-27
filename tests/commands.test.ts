import { describe, it, expect } from "vitest";
import { runCommand, complete, COMMANDS } from "@/lib/commands";
import { SECTIONS } from "@/lib/sections";
import { site } from "@/lib/site";

const github = site.socials.find(s => s.label === "GitHub")!.href;
const linkedin = site.socials.find(s => s.label === "LinkedIn")!.href;

describe("runCommand", () => {
  it("scrolls for every section id", () => {
    for (const id of SECTIONS) expect(runCommand(id)).toEqual({ kind: "scroll", id });
  });

  it("opens github and linkedin using site.socials hrefs", () => {
    expect(runCommand("github")).toEqual({ kind: "open", href: github });
    expect(runCommand("linkedin")).toEqual({ kind: "open", href: linkedin });
  });

  it("prints help with one line per command, in COMMANDS order", () => {
    const action = runCommand("help");
    expect(action.kind).toBe("print");
    if (action.kind !== "print") throw new Error("unreachable");
    expect(action.lines).toHaveLength(COMMANDS.length);
    const descriptions: Record<(typeof COMMANDS)[number], string> = {
      help: "list commands",
      about: "who I am",
      work: "selected work",
      experience: "where I've worked",
      contact: "get in touch",
      github: "open GitHub",
      linkedin: "open LinkedIn",
      clear: "clear the screen",
      whoami: "print identity",
    };
    COMMANDS.forEach((name, i) => {
      expect(action.lines[i]).toBe(`${name.padEnd(12)}${descriptions[name]}`);
    });
  });

  it("prints whoami with exactly three lines", () => {
    expect(runCommand("whoami")).toEqual({
      kind: "print",
      lines: [
        "Lucas Rocchetti",
        "Software engineer · Toronto, Canada",
        "I'm a software engineer based in Toronto.",
      ],
    });
  });

  it("clears the screen", () => {
    expect(runCommand("clear")).toEqual({ kind: "clear" });
  });

  it("returns empty for blank or whitespace-only input", () => {
    expect(runCommand("")).toEqual({ kind: "empty" });
    expect(runCommand("   ")).toEqual({ kind: "empty" });
  });

  it("trims and lower-cases the command", () => {
    expect(runCommand("  WORK  ")).toEqual({ kind: "scroll", id: "work" });
  });

  it("ignores extra arguments after the first token", () => {
    expect(runCommand("about please")).toEqual({ kind: "scroll", id: "about" });
  });

  it("returns notfound with the raw first token, preserving case", () => {
    expect(runCommand("Foo bar")).toEqual({ kind: "notfound", name: "Foo" });
  });

  it("returns notfound for an unknown command", () => {
    expect(runCommand("nope")).toEqual({ kind: "notfound", name: "nope" });
  });

  // The sections `about` replaced. Neither is a scroll target any more — their content moved
  // into About — so both have to miss rather than quietly scroll somewhere.
  it("no longer recognizes the folded-in sections", () => {
    for (const name of ["projects", "skills", "education"]) {
      expect(runCommand(name)).toEqual({ kind: "notfound", name });
      expect((COMMANDS as readonly string[]).includes(name)).toBe(false);
    }
  });
});

describe("complete", () => {
  it("returns all commands sorted when input is empty", () => {
    expect(complete("")).toEqual([...COMMANDS].sort());
  });

  it("returns sorted prefix matches", () => {
    expect(complete("c")).toEqual(["clear", "contact"]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(complete("x")).toEqual([]);
  });

  it("matches on the first token only, ignoring trailing args", () => {
    expect(complete("c xyz")).toEqual(["clear", "contact"]);
  });

  it("matches on the first token case-insensitively when args follow", () => {
    expect(complete("WOR x")).toEqual(["work"]);
  });
});

// Invariant: every SectionId must also be a valid command name, so scroll targets never
// desync from the palette's command list (see lib/sections.ts for the mirror of this note).
describe("SECTIONS ⊆ COMMANDS", () => {
  it("every section id is a recognized command", () => {
    for (const id of SECTIONS) expect((COMMANDS as readonly string[]).includes(id)).toBe(true);
  });
});
