import { describe, it, expect } from "vitest";
import { site } from "@/lib/site";
import pkg from "@/package.json";
describe("site", () => {
  it("has canonical url without trailing slash", () => expect(site.url).toBe("https://lucasrocchetti.com"));
  it("has three socials", () => expect(site.socials.map(s => s.label)).toEqual(["GitHub", "LinkedIn", "Email"]));
  it("has contact details and never advertises availability", () => {
    expect(site.name).toBe("Lucas Rocchetti");
    expect(site.description).not.toMatch(/open to/i);
    expect(site.email).toBe("lucasrocchetti@outlook.com");
    expect(site.version).toMatch(/^\d+\.\d+\.\d+$/);
    for (const s of site.socials) expect(s.href, s.label).toMatch(/^(https:\/\/|mailto:)/);
  });
  // The bottom bar renders site.version; package.json is what npm/deploys report.
  // They drift silently unless something fails when they do.
  it("keeps package.json version in step with site.version", () => {
    expect(pkg.version).toBe(site.version);
  });
});
