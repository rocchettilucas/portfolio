// The page's section ids, in scroll order. TopBar builds its nav from this list, the command
// parser (lib/commands.ts) resolves the same names, and each section is headed by its own id
// as a prompt line — so a section is named once, here.
export const SECTIONS = ["projects", "experience", "skills", "education"] as const;

export type SectionId = (typeof SECTIONS)[number];
