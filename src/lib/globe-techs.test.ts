import { describe, it, expect } from "vitest";
import { GLOBE_TECHS, fibSphereUnit } from "./globe-techs";

describe("GLOBE_TECHS", () => {
  it("has 13 entries", () => {
    expect(GLOBE_TECHS).toHaveLength(13);
  });

  it("each entry has required fields", () => {
    const validCategories = ["Frontend", "Backend", "Databases", "DevOps", "Design", "Data & Viz", "Cloud"];
    for (const tech of GLOBE_TECHS) {
      expect(tech.name).toBeTruthy();
      expect(validCategories).toContain(tech.cat);
      expect(["core", "comfortable"]).toContain(tech.tier);
      expect(tech.icon).toMatch(/^https:\/\/cdn\.simpleicons\.org\/.+\/.+$/);
      expect(tech.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it("no duplicate names", () => {
    const names = GLOBE_TECHS.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("fibSphereUnit", () => {
  it("returns n points", () => {
    expect(fibSphereUnit(13)).toHaveLength(13);
  });

  it("each point is a unit vector (length ≈ 1)", () => {
    for (const [x, y, z] of fibSphereUnit(13)) {
      const len = Math.sqrt(x * x + y * y + z * z);
      expect(len).toBeCloseTo(1, 5);
    }
  });

  it("first point is at top pole (y ≈ 1)", () => {
    const [[, y]] = fibSphereUnit(13);
    expect(y).toBeCloseTo(1, 5);
  });

  it("last point is at bottom pole (y ≈ -1)", () => {
    const pts = fibSphereUnit(13);
    const [, y] = pts[pts.length - 1];
    expect(y).toBeCloseTo(-1, 5);
  });

  it("returns distinct points (no duplicates)", () => {
    const pts = fibSphereUnit(13);
    const strs = pts.map((p) => p.join(","));
    expect(new Set(strs).size).toBe(13);
  });

  it("returns empty array for n <= 0", () => {
    expect(fibSphereUnit(0)).toHaveLength(0);
    expect(fibSphereUnit(-1)).toHaveLength(0);
  });

  it("returns single north-pole point for n = 1", () => {
    const pts = fibSphereUnit(1);
    expect(pts).toHaveLength(1);
    expect(pts[0]).toEqual([0, 1, 0]);
  });
});
