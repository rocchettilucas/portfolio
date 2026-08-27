// The page's section ids, in scroll order. TopBar builds its nav from this list and the
// command parser (lib/commands.ts) resolves the same names, so a section is added once here.
export const SECTIONS = ["projects", "experience", "skills", "education", "contact"] as const;

export type SectionId = (typeof SECTIONS)[number];
