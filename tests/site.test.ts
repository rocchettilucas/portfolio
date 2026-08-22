import { describe, it, expect } from "vitest";
import { site } from "@/lib/site";
describe("site", () => {
  it("has canonical url without trailing slash", () => expect(site.url).toBe("https://lucasrocchetti.com"));
  it("has three socials", () => expect(site.socials.map(s => s.label)).toEqual(["GitHub", "LinkedIn", "Email"]));
  it("has contact details and never advertises availability", () => {
    expect(site.name).toBe("Lucas Rocchetti");
    expect(site.description).not.toMatch(/open to/i);
    expect(site.email).toBe("lucasrocchetti@outlook.com");
    expect(site.resumePath).toBe("/Lucas_Rocchetti_Resume.pdf");
    for (const s of site.socials) expect(s.href, s.label).toMatch(/^(https:\/\/|mailto:)/);
  });
});
