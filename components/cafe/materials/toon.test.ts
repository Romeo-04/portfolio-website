import { LinearFilter, MeshToonMaterial } from "three";
import { describe, expect, it } from "vitest";
import { RAMP_SIZE, SHADE, applySoftToon, softToon, toonGradient, toonRamp } from "@/components/cafe/materials/toon";

describe("toonRamp", () => {
  it("runs from the shade level to full light", () => {
    expect(toonRamp(0)).toBeCloseTo(SHADE);
    expect(toonRamp(1)).toBeCloseTo(1);
  });

  it("never gets darker toward the light", () => {
    for (let i = 1; i <= 100; i++) expect(toonRamp(i / 100)).toBeGreaterThanOrEqual(toonRamp((i - 1) / 100));
  });
});

describe("toonGradient", () => {
  it("bakes the ramp into one row of texels, brightest last", () => {
    const tex = toonGradient();
    expect(tex.image.width).toBe(RAMP_SIZE);
    expect(tex.image.height).toBe(1);
    const data = Array.from(tex.image.data as Uint8Array);
    expect(data[0]).toBe(Math.round(SHADE * 255));
    expect(data[data.length - 1]).toBe(255);
    expect([...data].sort((a, b) => a - b)).toEqual(data);
  });

  it("blends between texels, so shading is soft", () => {
    const tex = toonGradient();
    expect(tex.minFilter).toBe(LinearFilter);
    expect(tex.magFilter).toBe(LinearFilter);
  });

  it("is shared, so every toon material uses the same texture", () => {
    expect(toonGradient()).toBe(toonGradient());
  });
});

describe("softToon", () => {
  it("adds the rim light and the surface softening to the toon shader", () => {
    const shader = { fragmentShader: "#include <map_fragment>\n#include <opaque_fragment>" };
    softToon(shader);
    expect(shader.fragmentShader).toContain("softRim");
    expect(shader.fragmentShader).toContain("SOFT_DETAIL");
    // The stock output chunk still runs after the rim is added.
    expect(shader.fragmentShader).toContain("#include <opaque_fragment>");
    expect(shader.fragmentShader).not.toContain("#include <map_fragment>");
  });

  it("gives loaded-model materials the same shader patch", () => {
    const material = applySoftToon(new MeshToonMaterial());
    expect(material.onBeforeCompile).toBe(softToon);
    expect(material.defines).toHaveProperty("TOON");
  });
});
