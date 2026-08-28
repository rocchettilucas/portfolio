import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { about, projects, homeProjects, experience, education, skillGroups, skills } from "@/lib/data";

const BANNED = /sole engineer|co-founder|open to work|open to roles|scrap|crawler/i;
const SENTENCES = (s: string) => (s.match(/[.!?](\s|$)/g) ?? []).length;

describe("projects", () => {
  it("has exactly one featured project (GasMap), listed first", () => {
    expect(projects[0].slug).toBe("gasmap");
    expect(projects.filter(p => p.placement === "featured")).toHaveLength(1);
  });
  it("lists the six projects in order, with three of them on the home page", () => {
    expect(projects.map(p => p.slug)).toEqual([
      "gasmap", "rocspace", "winlane", "pathwayr", "hallway-duty", "office-outbreak",
    ]);
    expect(homeProjects.map(p => p.slug)).toEqual(["gasmap", "rocspace", "winlane"]);
  });
  it("every project has a /projects/<slug>-*.webp screenshot", () => {
    // The suffix is free so a replaced image can take a new name and miss every cache. The
    // slug itself may be hyphenated ("hallway-duty"), so it goes into the pattern verbatim
    // rather than as a character class.
    for (const p of projects) {
      expect(p.image, p.slug).toMatch(new RegExp(`^/projects/${p.slug}-[a-z]+\\.webp$`));
    }
  });
  // The /work-only shot, where a project has one. It is named like every other screenshot
  // and must differ from `image` — pointing both at one file is the same as not setting it.
  it("gasmap is the only project with a spotlight shot, and it is not the card's", () => {
    expect(projects.filter(p => p.spotlightImage).map(p => p.slug)).toEqual(["gasmap"]);
    for (const p of projects) {
      if (!p.spotlightImage) continue;
      expect(p.spotlightImage, p.slug).toMatch(new RegExp(`^/projects/${p.slug}-[a-z]+\\.webp$`));
      expect(p.spotlightImage, p.slug).not.toBe(p.image);
    }
  });
  // The two Unity projects have no product mark of their own — the card and the spotlight
  // both fall back to the folder glyph — so a logo is required only of the rest.
  it("every project but the Unity pair carries a 192px logo", () => {
    const noLogo = projects.filter(p => !p.logo).map(p => p.slug);
    expect(noLogo).toEqual(["hallway-duty", "office-outbreak"]);
  });
  it("every project has resume-style dates", () => {
    for (const p of projects) expect(p.dates, p.slug).toMatch(/^[A-Z][a-z]{2} 20\d\d – ([A-Z][a-z]{2} 20\d\d|present)$/);
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
  it("gasmap is the only project with a rating, and its meta names no rating in words", () => {
    expect(projects.filter(p => p.rating !== undefined).map(p => p.slug)).toEqual(["gasmap"]);
    const g = projects.find(p => p.slug === "gasmap")!;
    expect(g.rating).toBe(5.0);
    expect(g.meta).toBe("iOS and Android");
    // The card and the spotlight compose "★ 5.0 on the App Store" themselves; a copy of that
    // phrase in the data would print twice the moment either of them renders `rating`.
    for (const p of projects) expect(p.meta ?? "", p.slug).not.toMatch(/App Store/);
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
  // Office Outbreak has nothing public to point at yet, so its icon row renders nothing at
  // all — an entry with no links is a supported state, not a hole in the data.
  it("office-outbreak carries no links, and hallway-duty only its itch.io page", () => {
    const oo = projects.find(p => p.slug === "office-outbreak")!;
    expect(Object.keys(oo.links)).toEqual([]);
    const hd = projects.find(p => p.slug === "hallway-duty")!;
    expect(hd.links).toEqual({ site: "https://lucasrocchetti.itch.io/hallway-duty" });
  });
});

describe("experience", () => {
  // Newest first by start date, which is the order the tab list runs in top to bottom.
  it("has the three roles in order, each with 2-4 one-sentence bullets and no banned phrases", () => {
    expect(experience.map(r => r.company)).toEqual([
      "Olivance Platforms",
      "PathwayR",
      "City of Mississauga",
    ]);
    for (const r of experience) {
      expect(r.bullets.length, r.company).toBeGreaterThanOrEqual(2);
      expect(r.bullets.length, r.company).toBeLessThanOrEqual(4);
      for (const bullet of r.bullets) {
        expect(SENTENCES(bullet), `${r.company}: ${bullet}`).toBe(1);
        expect(bullet.endsWith("."), `${r.company}: ${bullet}`).toBe(true);
        expect(BANNED.test(bullet), `${r.company}: ${bullet}`).toBe(false);
      }
      expect(BANNED.test(r.title), r.company).toBe(false);
      // `site` is optional — a role with no public product has nowhere to link the company.
      if (r.site) expect(r.site, r.company).toMatch(/^https:\/\//);
    }
  });
  // `short` is the tab label, and the tab column is 200px wide: past ~20 characters at 13px
  // it either wraps or pushes the phone row wider than the thumb that swipes it.
  it("every role has a short tab label of at most 20 characters", () => {
    for (const r of experience) {
      expect(r.short.trim().length, r.company).toBeGreaterThan(0);
      expect(r.short.length, r.company).toBeLessThanOrEqual(20);
    }
  });
});

describe("about", () => {
  it("has two paragraphs, neither empty nor self-promotional", () => {
    expect(about.paragraphs).toHaveLength(2);
    for (const paragraph of about.paragraphs) {
      expect(paragraph.trim().length).toBeGreaterThan(0);
      expect(BANNED.test(paragraph), paragraph).toBe(false);
    }
  });
});

describe("education & skills", () => {
  it("lists the University of Toronto degree and dates, and nothing else", () => {
    expect(education.map(e => e.name)).toEqual(["University of Toronto"]);
    expect(education[0].degree).toBe("Honours Bachelor in Computer Science and Information Technology");
    expect(education[0].dates).toBe("2021 – 2026");
    // The GPA and coursework lines are gone: `lines` is no longer part of the shape. Nor is
    // `logo` — About renders the degree as a line of text, with no crest beside it.
    expect("lines" in education[0]).toBe(false);
    expect("logo" in education[0]).toBe(false);
  });
  it("groups skills into languages, frameworks and databases", () => {
    expect(skillGroups.map(g => g.title)).toEqual(["Languages", "Frameworks & runtimes", "Databases & caching"]);
    expect(skillGroups[0].items.map(s => s.name)).toEqual(["TypeScript", "Python", "JavaScript", "Rust", "SQL", "C#"]);
    expect(skillGroups[1].items.map(s => s.name)).toEqual(["React", "React Native", "Expo", "Node.js", "FastAPI", "Tauri", "Tokio"]);
    expect(skillGroups[2].items.map(s => s.name)).toEqual(["PostgreSQL", "PostGIS", "Redis"]);
  });
  it("every skill points at an svg that exists under public/icons/", () => {
    for (const g of skillGroups) for (const s of g.items) expect(s.icon, s.name).toMatch(/^\/icons\/[a-z0-9]+\.svg$/);
    for (const s of skills) expect(fs.existsSync(path.join(process.cwd(), "public", s.icon)), s.name).toBe(true);
  });
  // What About renders: the same items, flattened, in the order the groups are written.
  it("flattens the groups into `skills`, keeping duplicates by icon", () => {
    expect(skills.map(s => s.name)).toEqual(skillGroups.flatMap(g => g.items.map(s => s.name)));
    expect(skills.filter(s => s.icon === "/icons/react.svg").map(s => s.name)).toEqual(["React", "React Native"]);
  });
});

describe("static assets", () => {
  const inPublic = (p: string) => fs.existsSync(path.join(process.cwd(), "public", p));

  it("every referenced logo exists under public/", () => {
    for (const p of projects) if (p.logo) expect(inPublic(p.logo), p.logo).toBe(true);
  });
  it("has the about photo the about section renders", () => {
    expect(inPublic("/about/lucas.jpg")).toBe(true);
  });
  // Every project now shows its shot on the home page too, not only on /projects, so a
  // missing file is a hole in the first screen rather than a slow page further in.
  it("every project screenshot exists under public/", () => {
    for (const p of projects) expect(inPublic(p.image), p.image).toBe(true);
  });
  // The spotlight shot is a second file, not a rename: the card's own image stays put.
  it("every spotlight screenshot exists under public/, alongside the card's", () => {
    for (const p of projects) if (p.spotlightImage) expect(inPublic(p.spotlightImage), p.spotlightImage).toBe(true);
    expect(inPublic("/projects/gasmap-hand.webp")).toBe(true);
  });
  it("drops the assets of the removed entries", () => {
    expect(inPublic("/gdsc.png")).toBe(false);
    expect(inPublic("/projects/nhl-192.png")).toBe(false);
    // The education crest went with the section that framed it.
    expect(inPublic("/uoft.png")).toBe(false);
  });
});
