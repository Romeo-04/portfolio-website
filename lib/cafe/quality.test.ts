import { describe, expect, it } from "vitest";
import { isSlow, qualityFor } from "@/lib/cafe/quality";

describe("qualityFor", () => {
  it("gives desktop full quality: effects and sharp sun shadows", () => {
    expect(qualityFor({ light: false, declines: 0 })).toMatchObject({ effects: true, shadows: true, shadowMap: 2048 });
  });
  it("drops post-processing first and keeps the shadows", () => {
    expect(qualityFor({ light: false, declines: 1 })).toMatchObject({ effects: false, shadows: true, shadowMap: 1024 });
  });
  it("drops shadows next, then resolution", () => {
    expect(qualityFor({ light: false, declines: 2 })).toMatchObject({ effects: false, shadows: false, dpr: [1, 1.5] });
    expect(qualityFor({ light: false, declines: 3 })).toMatchObject({ shadows: false, dpr: [1, 1] });
  });
  it("starts phone light 3D lean, with one step left", () => {
    expect(qualityFor({ light: true, declines: 0 })).toMatchObject({ effects: false, shadows: false, dpr: [1, 1.5] });
    expect(qualityFor({ light: true, declines: 1 })).toMatchObject({ dpr: [1, 1], canDecline: false });
  });
  it("stays on the last rung however often it declines", () => {
    expect(qualityFor({ light: false, declines: 99 })).toEqual(qualityFor({ light: false, declines: 3 }));
    expect(qualityFor({ light: false, declines: 99 }).canDecline).toBe(false);
  });
});

describe("isSlow", () => {
  it("passes a steady 60 fps", () => {
    expect(isSlow(Array(120).fill(16.7))).toBe(false);
  });
  it("flags a steady 30 fps", () => {
    expect(isSlow(Array(60).fill(33.3))).toBe(true);
  });
  it("ignores a few long frames in an otherwise smooth run", () => {
    expect(isSlow([...Array(100).fill(16.7), 400, 250, 180, 90])).toBe(false);
  });
  it("makes no call without samples", () => {
    expect(isSlow([])).toBe(false);
  });
});
