import { NearestFilter } from "three";
import { describe, expect, it } from "vitest";
import { TOON_BANDS, toonGradient } from "@/components/cafe/materials/toon";

describe("toonGradient", () => {
  it("has one texel per band, brightest last", () => {
    const tex = toonGradient();
    expect(tex.image.width).toBe(TOON_BANDS.length);
    expect(tex.image.height).toBe(1);
    const data = Array.from(tex.image.data as Uint8Array);
    expect(data).toEqual(TOON_BANDS.map((b) => Math.round(b * 255)));
    expect([...data].sort((a, b) => a - b)).toEqual(data);
  });

  it("uses hard steps, not blended light", () => {
    const tex = toonGradient();
    expect(tex.minFilter).toBe(NearestFilter);
    expect(tex.magFilter).toBe(NearestFilter);
  });

  it("is shared, so every toon material uses the same texture", () => {
    expect(toonGradient()).toBe(toonGradient());
  });
});
