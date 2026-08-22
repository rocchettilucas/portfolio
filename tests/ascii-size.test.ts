import { describe, it, expect } from "vitest";
import { calculateSize } from "@/lib/ascii-size";

describe("calculateSize", () => {
  it("desktop → 400", () => expect(calculateSize(1440)).toBe(400));
  it("tablet → 280", () => expect(calculateSize(768)).toBe(280));
  it("phone → 220", () => expect(calculateSize(390)).toBe(220));
  it("boundaries", () => {
    expect(calculateSize(769)).toBe(400);
    expect(calculateSize(480)).toBe(220);
    expect(calculateSize(481)).toBe(280);
  });
});
