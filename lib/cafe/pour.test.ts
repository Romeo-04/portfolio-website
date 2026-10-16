import { describe, expect, it } from "vitest";
import { POUR_SHARE, cupFill, layerIndexAt } from "@/lib/cafe/pour";
import { DWELL, STATIONS, stationAnchor, stationRange } from "@/lib/cafe/stations";

const brewIndex = STATIONS.findIndex((s) => s.id === "brew-bar");
const [start, end] = stationRange(brewIndex);
/** progress at a fraction of the brew bar's pour */
const atDwell = (f: number) => start + f * DWELL * POUR_SHARE * (end - start);

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
    const later = atDwell(0.6);
    const earlier = atDwell(0.4);
    const first = cupFill(later, 2, 4);
    const back = cupFill(earlier, 2, 4);
    const again = cupFill(later, 2, 4);
    expect(first).toBe(again);
    expect(back).toBeLessThan(first);
  });

  it("has every cup full where the camera rests", () => {
    const anchor = stationAnchor("brew-bar");
    for (let i = 0; i < 4; i++) expect(cupFill(anchor, i, 4)).toBeCloseTo(1);
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
