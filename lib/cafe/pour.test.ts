import { describe, expect, it } from "vitest";
import { cupFill, layerIndexAt } from "@/lib/cafe/pour";
import { DWELL, STATIONS, stationRange } from "@/lib/cafe/stations";

const brewIndex = STATIONS.findIndex((s) => s.id === "brew-bar");
const [start, end] = stationRange(brewIndex);
/** progress at a fraction of the brew bar's dwell zone */
const atDwell = (f: number) => start + f * DWELL * (end - start);

describe("cupFill", () => {
  it("is empty before the brew bar and full after its dwell", () => {
    expect(cupFill(start - 0.01, 0, 4)).toBe(0);
    expect(cupFill(atDwell(1), 3, 4)).toBeCloseTo(1);
    expect(cupFill(1, 0, 4)).toBe(1);
  });

  it("pours the cups one after another, left to right", () => {
    expect(cupFill(atDwell(0.125), 0, 4)).toBeCloseTo(0.5);
    expect(cupFill(atDwell(0.125), 1, 4)).toBe(0);
    expect(cupFill(atDwell(0.375), 0, 4)).toBe(1);
    expect(cupFill(atDwell(0.375), 1, 4)).toBeCloseTo(0.5);
  });

  it("un-pours when scrolling back (depends only on progress)", () => {
    const p = atDwell(0.6);
    expect(cupFill(p, 2, 4)).toBe(cupFill(p, 2, 4));
    expect(cupFill(atDwell(0.4), 2, 4)).toBeLessThan(cupFill(p, 2, 4));
  });

  it("handles a single cup and no cups", () => {
    expect(cupFill(atDwell(0.5), 0, 1)).toBeCloseTo(0.5);
    expect(cupFill(atDwell(0.5), 0, 0)).toBe(0);
  });
});

describe("layerIndexAt", () => {
  it("maps cup height to layers bottom to top", () => {
    expect(layerIndexAt(0, 4)).toBe(0);
    expect(layerIndexAt(0.3, 4)).toBe(1);
    expect(layerIndexAt(0.99, 4)).toBe(3);
  });

  it("never returns an index outside the layers", () => {
    expect(layerIndexAt(1, 4)).toBe(3);
    expect(layerIndexAt(-0.5, 4)).toBe(0);
    expect(layerIndexAt(0.7, 1)).toBe(0);
  });
});
