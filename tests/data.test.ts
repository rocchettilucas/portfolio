import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { projects, featuredProject, cardProjects, experience, education, skillGroups } from "@/lib/data";

const BANNED = /sole engineer|co-founder|open to work|open to roles|scrap|crawler/i;
const SENTENCES = (s: string) => (s.match(/[.!?](\s|$)/g) ?? []).length;

describe("projects", () => {
  it("has exactly one featured project (GasMap), listed first", () => {
    expect(featuredProject.slug).toBe("gasmap");
    expect(projects[0].slug).toBe("gasmap");
    expect(projects.filter(p => p.placement === "featured")).toHaveLength(1);
  });
  it("lists the four projects in order, with rocspace and winlane as home cards", () => {
    expect(projects.map(p => p.slug)).toEqual(["gasmap", "rocspace", "winlane", "pathwayr"]);
    expect(cardProjects.map(p => p.slug)).toEqual(["rocspace", "winlane"]);
  });
  it("every project has a logo and a /projects/<slug>-shot.webp screenshot", () => {
    for (const p of projects) {
      expect(p.logo, p.slug).toBeTruthy();
      expect(p.image, p.slug).toBe(`/projects/${p.slug}-shot.webp`);
    }
  });
  it("every blurb is exactly one sentence and contains no banned phrases", () => {
    for (const p of projects) {
      expect(SENTENCES(p.blurb), p.slug).toBe(1);
      expect(BANNED.test(p.blurb), p.slug).toBe(false);
      expect(BANNED.test(p.meta ?? ""), p.slug).toBe(false);
    }
  });
  it("every description is 2-3 items, one sentence each, with no banned phrases", () => {
    for (const p of projects) {
      expect(p.description.length, p.slug).toBeGreaterThanOrEqual(2);
      expect(p.description.length, p.slug).toBeLessThanOrEqual(3);
      for (const line of p.description) {
        expect(SENTENCES(line), `${p.slug}: ${line}`).toBe(1);
        expect(BANNED.test(line), `${p.slug}: ${line}`).toBe(false);
      }
    }
  });
  it("gasmap has store links and site, no github", () => {
    const g = projects.find(p => p.slug === "gasmap")!;
    expect(g.links.appStore).toBe("https://apps.apple.com/ca/app/gasmap/id6789210117");
    expect(g.links.googlePlay).toBe("https://play.google.com/store/apps/details?id=com.olivanceplatforms.gasmap");
    expect(g.links.site).toBe("https://gasmap.ai");
    expect(g.links.github).toBeUndefined();
  });
  it("rocspace is the only project with a github link, and no '#' sentinels anywhere", () => {
    expect(projects.filter(p => p.links.github).map(p => p.slug)).toEqual(["rocspace"]);
    expect(projects.find(p => p.slug === "rocspace")!.links.github).toBe("https://github.com/rocchettilucas/RocSpace");
    for (const p of projects) for (const v of Object.values(p.links)) expect(v).not.toBe("#");
  });
});

describe("experience", () => {
  it("has the two current roles with 2-3 bullets each and no banned phrases", () => {
    expect(experience.map(r => r.company)).toEqual(["Olivance Platforms · GasMap", "PathwayR"]);
    for (const r of experience) {
      expect(r.title, r.company).toBe(r.company === "PathwayR" ? "Software Developer" : "Software Engineer");
      expect(r.site, r.company).toMatch(/^https:\/\//);
      expect(r.bullets.length).toBeGreaterThanOrEqual(2);
      expect(r.bullets.length).toBeLessThanOrEqual(3);
      expect(BANNED.test(r.title + r.bullets.join(" "))).toBe(false);
    }
  });
});

describe("education & skills", () => {
  it("lists University of Toronto only, with GPA and Dean's List", () => {
    expect(education.map(e => e.name)).toEqual(["University of Toronto"]);
    expect(education[0].dates).toBe("2021 – 2026");
    expect(education[0].lines.join(" ")).toMatch(/3\.78/);
    expect(education[0].lines.join(" ")).toMatch(/Dean/);
  });
  it("groups skills into languages, frameworks and databases", () => {
    expect(skillGroups.map(g => g.title)).toEqual(["Languages", "Frameworks & runtimes", "Databases & caching"]);
    expect(skillGroups[0].items.map(s => s.name)).toEqual(["TypeScript", "Python", "JavaScript", "Rust", "SQL", "C#"]);
    expect(skillGroups[1].items.map(s => s.name)).toEqual(["React", "React Native", "Expo", "Node.js", "FastAPI", "Tauri", "Tokio"]);
    expect(skillGroups[2].items.map(s => s.name)).toEqual(["PostgreSQL", "PostGIS", "Redis"]);
  });
  it("every skill points at an svg under /icons/", () => {
    for (const g of skillGroups) for (const s of g.items) expect(s.icon, s.name).toMatch(/^\/icons\/[a-z0-9]+\.svg$/);
  });
});

describe("static assets", () => {
  const inPublic = (p: string) => fs.existsSync(path.join(process.cwd(), "public", p));

  // Screenshots (`image`) and the newer skill icons arrive with their own tasks, so only the
  // assets this module has always shipped are asserted to exist; the checks above cover shape.
  it("every referenced logo exists under public/", () => {
    for (const e of education) expect(inPublic(e.logo), e.logo).toBe(true);
    for (const p of projects) if (p.logo) expect(inPublic(p.logo), p.logo).toBe(true);
  });
  it("drops the assets of the removed entries", () => {
    expect(inPublic("/gdsc.png")).toBe(false);
    expect(inPublic("/projects/nhl-192.png")).toBe(false);
  });
});
