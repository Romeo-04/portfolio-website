import { describe, expect, it } from "vitest";
import { qualityFor } from "@/lib/cafe/quality";

describe("qualityFor", () => {
  it("gives desktop full quality: high DPR, effects and sun shadows", () => {
    expect(qualityFor({ light: false, declined: false })).toEqual({
      dpr: [1, 2],
      effects: true,
      shadows: true,
    });
  });
  it("drops to DPR 1 with no effects or shadows after a performance decline", () => {
    expect(qualityFor({ light: false, declined: true })).toEqual({
      dpr: [1, 1],
      effects: false,
      shadows: false,
    });
  });
  it("keeps phone light 3D lean from the start", () => {
    expect(qualityFor({ light: true, declined: false })).toEqual({
      dpr: [1, 1],
      effects: false,
      shadows: false,
    });
  });
});
