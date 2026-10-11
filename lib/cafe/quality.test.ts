import { describe, expect, it } from "vitest";
import { qualityFor } from "@/lib/cafe/quality";

describe("qualityFor", () => {
  it("gives desktop full quality", () => {
    expect(qualityFor({ light: false, declined: false, reduced: false })).toEqual({
      dpr: [1, 2],
      effects: true,
      grain: true,
    });
  });
  it("drops to DPR 1 and no effects after a performance decline", () => {
    expect(qualityFor({ light: false, declined: true, reduced: false })).toEqual({
      dpr: [1, 1],
      effects: false,
      grain: false,
    });
  });
  it("keeps phone light 3D lean from the start", () => {
    expect(qualityFor({ light: true, declined: false, reduced: false })).toEqual({
      dpr: [1, 1],
      effects: false,
      grain: false,
    });
  });
  it("turns grain off for reduced motion but keeps bloom", () => {
    expect(qualityFor({ light: false, declined: false, reduced: true })).toEqual({
      dpr: [1, 2],
      effects: true,
      grain: false,
    });
  });
});
