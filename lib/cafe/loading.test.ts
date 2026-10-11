import { describe, expect, it } from "vitest";
import { getLoading, setLoading } from "@/lib/cafe/loading";

describe("loading store", () => {
  it("starts with idle defaults", () => {
    expect(getLoading()).toEqual({ active: false, total: 0, progress: 0 });
  });
  it("round-trips what was set", () => {
    setLoading({ active: true, total: 4, progress: 50 });
    expect(getLoading()).toEqual({ active: true, total: 4, progress: 50 });
  });
});
