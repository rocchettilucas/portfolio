// The page's section ids, in scroll order. TopBar builds its nav from this list, the command
// parser (lib/commands.ts) resolves the same names, and each section is headed by its own id
// as a prompt line — so a section is named once, here.
//
// /work is a route, not a section: it has no anchor on this page, so it is deliberately
// absent from the list even though the work section links to it.
export const SECTIONS = ["about", "work", "experience", "contact"] as const;

export type SectionId = (typeof SECTIONS)[number];
