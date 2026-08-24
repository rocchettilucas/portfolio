import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ASCII_TXT } from "@/lib/ascii/tone400";
import p400 from "@/lib/ascii/tone_400.json";
import p280 from "@/lib/ascii/tone_280.json";
import p220 from "@/lib/ascii/tone_220.json";

const RAMP = " .:-=+*#%@";

type Particle = { c: string; x: number; y: number; a: number };
type Portrait = {
  size: number;
  fontSize: number;
  chars?: string;
  particles: Particle[];
};

const FILES: [string, Portrait, number][] = [
  ["tone_400.json", p400 as Portrait, 7],
  ["tone_280.json", p280 as Portrait, 5],
  ["tone_220.json", p220 as Portrait, 5],
];

describe.each(FILES)("%s", (name, data, fontSize) => {
  it("has a supported canvas size", () => {
    expect([400, 280, 220]).toContain(data.size);
  });

  it(`uses fontSize ${fontSize}`, () => {
    expect(data.fontSize).toBe(fontSize);
  });

  it("declares the ramp verbatim when present", () => {
    if ("chars" in data) expect(data.chars).toBe(RAMP);
  });

  it("carries enough particles to read as a portrait", () => {
    // Shipped baseline counts: 1155 / 1110 / 670. The floor guards against a
    // regenerate that silently drops most of the subject.
    expect(Array.isArray(data.particles)).toBe(true);
    expect(data.particles.length).toBeGreaterThanOrEqual(400);
  });

  it("is mostly ink, not blank glyphs", () => {
    // The ramp's first char is a space: a particle can sample to " " and paint
    // nothing. Shipped baseline ink: 860 / 820 / 494.
    const ink = data.particles.filter((p) => p.c !== " ");
    expect(ink.length).toBeGreaterThanOrEqual(300);
    expect(ink.length / data.particles.length).toBeGreaterThan(0.5);
  });

  it("every particle is a ramp glyph inside the canvas with a usable alpha", () => {
    for (const p of data.particles) {
      expect(RAMP).toContain(p.c);
      expect(p.c).toHaveLength(1);
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(data.size);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThanOrEqual(data.size);
      expect(p.a).toBeGreaterThan(0);
      expect(p.a).toBeLessThanOrEqual(1);
    }
  });
});

describe("tone400.ts noscript fallback", () => {
  const txt = readFileSync(
    join(process.cwd(), "lib/ascii/tone_400.txt"),
    "utf8",
  ).replace(/\n$/, "");

  it("matches lib/ascii/tone_400.txt row for row", () => {
    expect(ASCII_TXT.split("\n")).toHaveLength(txt.split("\n").length);
    expect(ASCII_TXT).toBe(txt);
  });

  it("uses only ramp characters", () => {
    for (const ch of ASCII_TXT.replace(/\n/g, "")) {
      expect(RAMP).toContain(ch);
    }
  });
});
