import { describe, expect, it } from "vitest";
import {
  CONVEYOR_END,
  CONVEYOR_START,
  ROAST_DARK,
  ROAST_GREEN,
  beanX,
  receiptLength,
  roastColor,
  trayOffset,
  DOOR_OPEN,
  FRAME_SWING,
  clamp01,
  doorAngle,
  dwellT,
  easeInOut,
  easeOutBack,
  frameAngle,
  gaugeValue,
  stagger,
} from "@/lib/cafe/choreo";
import { DWELL, STATIONS, stationRange } from "@/lib/cafe/stations";

describe("easing", () => {
  it("starts at 0 and ends at 1", () => {
    for (const f of [easeInOut, easeOutBack]) {
      expect(f(0)).toBeCloseTo(0);
      expect(f(1)).toBeCloseTo(1);
    }
  });
  it("easeOutBack overshoots before settling", () => {
    expect(Math.max(...[0.6, 0.7, 0.8, 0.9].map(easeOutBack))).toBeGreaterThan(1);
  });
  it("clamps", () => {
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(2)).toBe(1);
  });
});

describe("stagger", () => {
  it("runs items one after another", () => {
    expect(stagger(0.25, 0, 2)).toBeCloseTo(0.5);
    expect(stagger(0.25, 1, 2)).toBe(0);
    expect(stagger(0.75, 1, 2)).toBeCloseTo(0.5);
    expect(stagger(1, 1, 2)).toBe(1);
  });
  it("is 0 for no items", () => {
    expect(stagger(0.5, 0, 0)).toBe(0);
  });
});

describe("dwellT", () => {
  const i = STATIONS.findIndex((s) => s.id === "wall");
  const [start, end] = stationRange(i);
  it("goes 0 to 1 across the station's dwell zone only", () => {
    expect(dwellT(start, "wall")).toBe(0);
    expect(dwellT(start + (DWELL / 2) * (end - start), "wall")).toBeCloseTo(0.5);
    expect(dwellT(end, "wall")).toBe(1);
    expect(dwellT(start - 0.01, "wall")).toBe(0);
  });
});

describe("doorAngle", () => {
  it("is shut at 0, fully open at 1, and reverses", () => {
    expect(doorAngle(0)).toBe(0);
    expect(doorAngle(1)).toBeCloseTo(DOOR_OPEN);
    expect(doorAngle(0.3)).toBeLessThan(doorAngle(0.6));
  });
});

describe("frameAngle", () => {
  it("starts tilted out and settles flat, in order", () => {
    expect(frameAngle(0, 0, 3)).toBeCloseTo(FRAME_SWING);
    expect(frameAngle(1, 2, 3)).toBeCloseTo(0);
    expect(frameAngle(0.2, 2, 3)).toBeCloseTo(FRAME_SWING);
  });
});

describe("gaugeValue", () => {
  it("waits for both the minimum time and the loading", () => {
    expect(gaugeValue(1200, 2400, 100)).toBeCloseTo(0.5);
    expect(gaugeValue(3000, 2400, 40)).toBeCloseTo(0.4);
    expect(gaugeValue(3000, 2400, 100)).toBe(1);
  });
  it("finishes on time when nothing loads", () => {
    expect(gaugeValue(2400, 2400, null)).toBe(1);
    expect(gaugeValue(600, 2400, null)).toBeCloseTo(0.25);
  });
});

describe("frameAngle never sinks into the wall", () => {
  it("is never negative", () => {
    for (let i = 0; i <= 50; i++) {
      for (let idx = 0; idx < 3; idx++) {
        expect(frameAngle(i / 50, idx, 3)).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

describe("roastColor", () => {
  it("goes from green beans to dark roast", () => {
    expect(roastColor(0)).toBe(ROAST_GREEN);
    expect(roastColor(1)).toBe(ROAST_DARK);
    expect(roastColor(0.5)).toMatch(/^#[0-9a-f]{6}$/);
    expect(roastColor(-1)).toBe(ROAST_GREEN);
  });
});

describe("beanX", () => {
  it("moves beans along the belt and wraps them", () => {
    expect(beanX(0, 0)).toBe(CONVEYOR_START);
    expect(beanX(0, 0.5)).toBeCloseTo((CONVEYOR_START + CONVEYOR_END) / 2);
    const x = beanX(0.9, 0.5);
    expect(x).toBeGreaterThanOrEqual(CONVEYOR_START);
    expect(x).toBeLessThanOrEqual(CONVEYOR_END);
  });
});

describe("trayOffset", () => {
  it("slides trays in one after another over the real count", () => {
    expect(trayOffset(0, 0, 2)).toBe(1);
    expect(trayOffset(1, 1, 2)).toBeCloseTo(0);
    expect(trayOffset(0.5, 1, 2)).toBe(1);
    expect(trayOffset(1, 1, 6)).toBeCloseTo(0);
  });
});

describe("receiptLength", () => {
  it("prints from 0 to full and reverses", () => {
    expect(receiptLength(0)).toBe(0);
    expect(receiptLength(1)).toBeCloseTo(1);
    expect(receiptLength(0.3)).toBeLessThan(receiptLength(0.6));
  });
});
