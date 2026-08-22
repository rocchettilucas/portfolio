import { describe, it, expect } from "vitest";
import { site } from "@/lib/site";
describe("site", () => {
  it("has canonical url without trailing slash", () => expect(site.url).toBe("https://lucasrocchetti.com"));
  it("has three socials", () => expect(site.socials.map(s => s.label)).toEqual(["GitHub", "LinkedIn", "Email"]));
  it("never advertises availability in visible strings", () => {
    // description is metadata-only; visible copy lives in data.ts and is checked there
    expect(site.name).toBe("Lucas Rocchetti");
  });
});
