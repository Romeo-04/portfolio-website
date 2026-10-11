import { Color, DoubleSide } from "three";
import { describe, expect, it } from "vitest";
import { createPourMaterial, setFill } from "@/components/cafe/shaders/pour";
import { MAX_LAYERS, type Drink } from "@/lib/cafe/drinks";

const drink: Drink = {
  cup: "glass",
  mark: "K",
  layers: [
    { name: "Espresso", color: "#3b2314" },
    { name: "Steamed milk", color: "#efe1cc" },
  ],
};

describe("createPourMaterial", () => {
  it("passes the layers bottom to top and pads to MAX_LAYERS", () => {
    const m = createPourMaterial(drink, 0.4);
    const colors = m.uniforms.uColors.value as Color[];
    expect(colors).toHaveLength(MAX_LAYERS);
    expect(colors[0].getHexString()).toBe("3b2314");
    expect(colors[1].getHexString()).toBe("efe1cc");
    expect(colors[3].getHexString()).toBe("efe1cc");
    expect(m.uniforms.uCount.value).toBe(2);
    expect(m.uniforms.uHeight.value).toBe(0.4);
  });

  it("starts empty and draws both faces so the inside shows while pouring", () => {
    const m = createPourMaterial(drink, 0.4);
    expect(m.uniforms.uFill.value).toBe(0);
    expect(m.side).toBe(DoubleSide);
  });

  it("avoids dynamic array indexing so WebGL1 compiles it", () => {
    const m = createPourMaterial(drink, 0.4);
    expect(m.fragmentShader).toContain("for (int i = 1; i <");
    const indexes = m.fragmentShader.match(/uColors\[([^\]]+)\]/g) ?? [];
    expect(indexes.length).toBeGreaterThan(0);
    expect(
      indexes.every((s) => /uColors\[(0|i|\d+)\]/.test(s)),
    ).toBe(true);
  });

  it("caps uCount at MAX_LAYERS for drinks with too many layers", () => {
    const tall: Drink = {
      ...drink,
      layers: Array.from({ length: 6 }, (_, i) => ({ name: `L${i}`, color: "#101010" })),
    };
    const m = createPourMaterial(tall, 0.4);
    expect(m.uniforms.uCount.value).toBe(MAX_LAYERS);
  });

  it("converts to the output colour space like the other materials", () => {
    const m = createPourMaterial(drink, 0.4);
    expect(m.fragmentShader).toContain("#include <colorspace_fragment>");
  });
});

describe("setFill", () => {
  it("clamps to 0..1", () => {
    const m = createPourMaterial(drink, 0.4);
    setFill(m, 1.7);
    expect(m.uniforms.uFill.value).toBe(1);
    setFill(m, -2);
    expect(m.uniforms.uFill.value).toBe(0);
    setFill(m, 0.25);
    expect(m.uniforms.uFill.value).toBe(0.25);
  });
});
