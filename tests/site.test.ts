import { describe, it, expect } from "vitest";
import { site, socialHref, ROLES } from "@/lib/site";
import pkg from "@/package.json";
describe("site", () => {
  it("has canonical url without trailing slash", () => expect(site.url).toBe("https://lucasrocchetti.com"));
  it("has three socials", () => expect(site.socials.map(s => s.label)).toEqual(["GitHub", "LinkedIn", "Email"]));
  it("has contact details and never advertises availability", () => {
    expect(site.name).toBe("Lucas Rocchetti");
    expect(site.description).not.toMatch(/open to/i);
    expect(site.description).toMatch(/GasMap, RocSpace, WinLane\.GG/);
    expect(site.email).toBe("lucasrocchetti@outlook.com");
    expect(site.version).toMatch(/^\d+\.\d+\.\d+$/);
    for (const s of site.socials) expect(s.href, s.label).toMatch(/^(https:\/\/|mailto:)/);
  });
  it("resolves every social label to its href and fails loudly on an unknown one", () => {
    expect(socialHref("GitHub")).toBe("https://github.com/rocchettilucas");
    expect(socialHref("LinkedIn")).toBe("https://linkedin.com/in/lucasrocchetti");
    expect(socialHref("Email")).toBe("mailto:lucasrocchetti@outlook.com");
    // The whole point of the helper over an inline `find(...)!`: a label that is not in
    // site.socials throws here instead of surfacing as `undefined` in the markup.
    expect(() => socialHref("Twitter" as never)).toThrow(/Twitter/);
  });

  // TypedRoles cycles these; with fewer than two there is nothing to cycle and the hero
  // should be plain text instead.
  it("has at least two non-empty roles for the hero to type", () => {
    expect(ROLES.length).toBeGreaterThanOrEqual(2);
    for (const role of ROLES) expect(role.trim().length, role).toBeGreaterThan(0);
  });

  // The bottom bar renders site.version; package.json is what npm/deploys report.
  // They drift silently unless something fails when they do.
  it("keeps package.json version in step with site.version", () => {
    expect(pkg.version).toBe(site.version);
  });
});
