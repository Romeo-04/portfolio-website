import { describe, expect, it } from "vitest";
import { INTRO_KEY, markIntroSeen, shouldPlayIntro, type StorageLike } from "@/lib/cafe/intro";

function memory(): StorageLike & { data: Record<string, string> } {
  const data: Record<string, string> = {};
  return {
    data,
    getItem: (k) => data[k] ?? null,
    setItem: (k, v) => {
      data[k] = v;
    },
  };
}

const broken: StorageLike = {
  getItem: () => {
    throw new Error("blocked");
  },
  setItem: () => {
    throw new Error("blocked");
  },
};

describe("shouldPlayIntro", () => {
  it("plays on a first visit with no hash", () => {
    expect(shouldPlayIntro("", memory())).toBe(true);
  });
  it("skips after it was seen this session", () => {
    const s = memory();
    markIntroSeen(s);
    expect(s.data[INTRO_KEY]).toBe("1");
    expect(shouldPlayIntro("", s)).toBe(false);
  });
  it("skips for station and project deep links, not unknown hashes", () => {
    expect(shouldPlayIntro("#wall", memory())).toBe(false);
    expect(shouldPlayIntro("#kislap", memory())).toBe(false);
    expect(shouldPlayIntro("#foo", memory())).toBe(true);
  });
  it("still plays, and never throws, when storage is blocked or missing", () => {
    expect(shouldPlayIntro("", broken)).toBe(true);
    expect(shouldPlayIntro("", null)).toBe(true);
    expect(() => markIntroSeen(broken)).not.toThrow();
    expect(() => markIntroSeen(null)).not.toThrow();
  });
});
