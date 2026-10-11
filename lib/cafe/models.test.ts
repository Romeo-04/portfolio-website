import { describe, expect, it } from "vitest";
import { MODELS, modelSrc } from "@/lib/cafe/models";

describe("modelSrc", () => {
  it("returns null while a piece has no model file", () => {
    expect(modelSrc("room", {})).toBeNull();
  });
  it("returns the registered path", () => {
    expect(modelSrc("brew-bar", { "brew-bar": "/models/brew-bar.glb" })).toBe("/models/brew-bar.glb");
  });
  it("only registers web paths under /models/", () => {
    for (const src of Object.values(MODELS)) expect(src).toMatch(/^\/models\/.+\.glb$/);
  });
});
