import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { projects, featuredProject, cardProjects, experience, education, coreStack } from "@/lib/data";

const BANNED = /sole engineer|co-founder|open to work|open to roles|scrap|crawler/i;
const ONE_SENTENCE = (s: string) => (s.match(/[.!?](\s|$)/g) ?? []).length === 1;

describe("projects", () => {
  it("has exactly one featured project (GasMap), listed first", () => {
    expect(featuredProject.slug).toBe("gasmap");
    expect(projects[0].slug).toBe("gasmap");
    expect(projects.filter(p => p.placement === "featured")).toHaveLength(1);
  });
  it("lists all six projects, the other five as cards in order", () => {
    expect(projects).toHaveLength(6);
    expect(cardProjects.map(p => p.slug)).toEqual(["rocspace", "winlane", "nhl-dashboard", "pathwayr", "portfolio-v2"]);
  });
  it("every project has `logo` except portfolio-v2", () => {
    for (const p of projects.filter(p => p.slug !== "portfolio-v2")) expect(p.logo, p.slug).toBeTruthy();
    expect(projects.find(p => p.slug === "portfolio-v2")!.logo).toBeUndefined();
  });
  it("every blurb is exactly one sentence and contains no banned phrases", () => {
    for (const p of projects) {
      expect(ONE_SENTENCE(p.blurb), p.slug).toBe(true);
      expect(BANNED.test(p.blurb), p.slug).toBe(false);
      expect(BANNED.test(p.meta ?? ""), p.slug).toBe(false);
    }
  });
  it("gasmap has store links and site, no github", () => {
    const g = projects.find(p => p.slug === "gasmap")!;
    expect(g.links.appStore).toBe("https://apps.apple.com/ca/app/gasmap/id6789210117");
    expect(g.links.googlePlay).toBe("https://play.google.com/store/apps/details?id=com.olivanceplatforms.gasmap");
    expect(g.links.site).toBe("https://gasmap.ai");
    expect(g.links.github).toBeUndefined();
  });
  it("nhl has a public github link and no '#' sentinels anywhere", () => {
    const n = projects.find(p => p.slug === "nhl-dashboard")!;
    expect(n.links.github).toBe("https://github.com/rocchettilucas/NHL-Player-Dashboard");
    for (const p of projects) for (const v of Object.values(p.links)) expect(v).not.toBe("#");
  });
});

describe("experience", () => {
  it("has three roles with 2-4 bullets each and no banned phrases", () => {
    expect(experience.map(r => r.company)).toEqual(["WinLane.GG", "City of Mississauga", "Best Buy"]);
    for (const r of experience) {
      expect(r.bullets.length).toBeGreaterThanOrEqual(2);
      expect(r.bullets.length).toBeLessThanOrEqual(4);
      expect(BANNED.test(r.title + r.bullets.join(" "))).toBe(false);
    }
  });
});

describe("education & stack", () => {
  it("lists UofT with GPA and Dean's List", () => {
    expect(education[0].name).toBe("University of Toronto");
    expect(education[0].lines.join(" ")).toMatch(/3\.78/);
    expect(education[0].lines.join(" ")).toMatch(/Dean/);
  });
  it("core stack is exactly six items with icon paths under /icons/", () => {
    expect(coreStack).toHaveLength(6);
    for (const s of coreStack) expect(s.icon).toMatch(/^\/icons\/.+\.svg$/);
  });
});

describe("static assets", () => {
  const inPublic = (p: string) => fs.existsSync(path.join(process.cwd(), "public", p));

  it("every referenced icon and logo exists under public/", () => {
    for (const s of coreStack) expect(inPublic(s.icon), s.icon).toBe(true);
    for (const e of education) expect(inPublic(e.logo), e.logo).toBe(true);
    for (const p of projects) {
      if (p.logo) expect(inPublic(p.logo), p.logo).toBe(true);
    }
  });
});
