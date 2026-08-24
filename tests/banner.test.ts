import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";
import { banner } from "@/lib/banner";
import { buildBanner, emit, MAX_COLS, OUT_FILE, WORDS } from "../scripts/banner/generate.mjs";

const rows = banner.words.flatMap((word) => word.split("\n"));

describe("banner", () => {
  it("is one block per word", () => {
    expect(banner.words).toHaveLength(WORDS.length);
  });

  it("has no blank rows and equal row widths", () => {
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(row).toHaveLength(banner.cols);
      expect(row.trim()).not.toBe("");
    }
  });

  it("fits the column cap", () => {
    expect(banner.cols).toBeLessThanOrEqual(MAX_COLS);
  });

  // figlet is a devDependency, so the committed module is what ships. Re-render it here:
  // if someone edits the words or the font and forgets `npm run banner`, this fails.
  it("matches a fresh render", () => {
    expect(buildBanner()).toEqual({ words: banner.words, cols: banner.cols });
    expect(readFileSync(OUT_FILE, "utf8")).toBe(emit(buildBanner()));
  });
});
