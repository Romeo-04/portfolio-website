import { describe, expect, it } from "vitest";
import type { StorageLike } from "@/lib/cafe/intro";
import {
  STAMPS_KEY,
  addStamp,
  isComplete,
  loadStamps,
  parseStamps,
  saveStamps,
  stampFor,
} from "@/lib/cafe/loyalty";
import { STATIONS, stationAnchor } from "@/lib/cafe/stations";

describe("parseStamps", () => {
  it("keeps valid ids in journey order without duplicates", () => {
    expect(parseStamps('["wall","storefront","wall"]')).toEqual(["storefront", "wall"]);
  });
  it("survives garbage", () => {
    expect(parseStamps(null)).toEqual([]);
    expect(parseStamps("[1,2")).toEqual([]);
    expect(parseStamps("{}")).toEqual([]);
    expect(parseStamps('["storefront","nope",3]')).toEqual(["storefront"]);
  });
});

describe("addStamp", () => {
  it("adds one station in journey order", () => {
    expect(addStamp(["wall"], "storefront")).toEqual(["storefront", "wall"]);
  });
  it("returns the same array when already stamped", () => {
    const s = ["wall" as const];
    expect(addStamp(s, "wall")).toBe(s);
  });
});

describe("isComplete", () => {
  it("is true only with every station", () => {
    expect(isComplete(STATIONS.map((s) => s.id))).toBe(true);
    expect(isComplete(STATIONS.slice(1).map((s) => s.id))).toBe(false);
  });
});

describe("load and save", () => {
  const memory = (): StorageLike & { data: Record<string, string> } => {
    const data: Record<string, string> = {};
    return { data, getItem: (k) => data[k] ?? null, setItem: (k, v) => void (data[k] = v) };
  };
  const broken: StorageLike = {
    getItem: () => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("blocked");
    },
  };

  it("round-trips", () => {
    const s = memory();
    saveStamps(s, ["storefront", "wall"]);
    expect(s.data[STAMPS_KEY]).toBe('["storefront","wall"]');
    expect(loadStamps(s)).toEqual(["storefront", "wall"]);
  });
  it("never throws on blocked or missing storage", () => {
    expect(loadStamps(broken)).toEqual([]);
    expect(loadStamps(null)).toEqual([]);
    expect(() => saveStamps(broken, ["wall"])).not.toThrow();
  });
});

describe("stampFor", () => {
  it("gives nothing while gliding", () => {
    expect(stampFor(stationAnchor("wall"), true)).toBeNull();
  });
  it("stamps the station the visitor rests on", () => {
    expect(stampFor(stationAnchor("wall"), false)).toBe("wall");
    expect(stampFor(0, false)).toBe("storefront");
  });
  it("gives nothing mid-glide-zone", () => {
    const [i] = [STATIONS.findIndex((s) => s.id === "wall")];
    const span = 1 / STATIONS.length;
    expect(stampFor((i + 0.8) * span, false)).toBeNull();
  });
});
