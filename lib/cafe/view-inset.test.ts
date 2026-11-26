import { describe, expect, it } from "vitest";
import { BASE_FOV, fovFor, getViewInset, getViewInsetY, setViewInset, subscribeViewInset } from "@/lib/cafe/view-inset";

const hfov = (vfovDeg: number, aspect: number) =>
  (2 * Math.atan(Math.tan((vfovDeg * Math.PI) / 360) * aspect) * 180) / Math.PI;

describe("fovFor", () => {
  it("keeps the base view on landscape screens", () => {
    expect(fovFor(16 / 9)).toBe(BASE_FOV);
    expect(fovFor(1)).toBe(BASE_FOV);
  });

  it("widens on portrait so the whole station still fits across", () => {
    const fov = fovFor(0.7);
    expect(fov).toBeGreaterThan(BASE_FOV);
    expect(hfov(fov, 0.7)).toBeCloseTo(48, 1);
  });

  it("caps the vertical view on tall phones, which still see far more across", () => {
    const phone = 390 / 844;
    expect(fovFor(phone)).toBe(86);
    expect(hfov(fovFor(phone), phone)).toBeGreaterThan(2 * hfov(BASE_FOV, phone) - 4);
    expect(fovFor(0.2)).toBe(86);
  });

  it("falls back to the base view on a zero-size canvas", () => {
    expect(fovFor(0)).toBe(BASE_FOV);
    expect(fovFor(NaN)).toBe(BASE_FOV);
  });
});

describe("view inset", () => {
  it("stores both axes and notifies only on change", () => {
    let calls = 0;
    const off = subscribeViewInset(() => calls++);
    setViewInset(10, 120);
    setViewInset(10, 120);
    expect([getViewInset(), getViewInsetY(), calls]).toEqual([10, 120, 1]);
    setViewInset(0);
    expect([getViewInset(), getViewInsetY(), calls]).toEqual([0, 0, 2]);
    off();
  });
});
