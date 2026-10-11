import { describe, expect, it } from "vitest";
import {
  DWELL,
  STATIONS,
  cameraPose,
  progressFromScroll,
  menuTargetForHash,
  resolveHash,
  stationAnchor,
  stationIndexAt,
  stationProgress,
  stationRange,
  stationYaw,
} from "@/lib/cafe/stations";

const n = STATIONS.length;

describe("stations", () => {
  it("lists the seven stations in journey order", () => {
    expect(STATIONS.map((s) => s.id)).toEqual([
      "storefront",
      "menu-board",
      "brew-bar",
      "wall",
      "roastery",
      "specials",
      "checkout",
    ]);
  });

  it("splits progress evenly", () => {
    expect(stationRange(0)).toEqual([0, 1 / n]);
    expect(stationRange(n - 1)[1]).toBeCloseTo(1);
  });

  it("finds the station for a progress value, clamped", () => {
    expect(stationIndexAt(0)).toBe(0);
    expect(stationIndexAt(1)).toBe(n - 1);
    expect(stationIndexAt(-5)).toBe(0);
    expect(stationIndexAt(2.5 / n)).toBe(2);
  });

  it("gives local progress 0..1 inside a station only", () => {
    expect(stationProgress(0, "menu-board")).toBe(0);
    expect(stationProgress(1.5 / n, "menu-board")).toBeCloseTo(0.5);
    expect(stationProgress(1, "menu-board")).toBe(1);
  });

  it("anchors a station inside its dwell zone", () => {
    const [start, end] = stationRange(2);
    const anchor = stationAnchor("brew-bar");
    expect(anchor).toBeGreaterThan(start);
    expect(anchor).toBeLessThan(start + DWELL * (end - start));
  });
});

describe("progressFromScroll", () => {
  it("maps scroll to 0..1", () => {
    expect(progressFromScroll(500, 2000, 1000)).toBe(0.5);
  });
  it("returns 0, not NaN, when the page is not taller than the viewport", () => {
    expect(progressFromScroll(0, 800, 800)).toBe(0);
    expect(progressFromScroll(0, 600, 800)).toBe(0);
  });
  it("clamps overscroll", () => {
    expect(progressFromScroll(5000, 2000, 1000)).toBe(1);
    expect(progressFromScroll(-50, 2000, 1000)).toBe(0);
  });
});

describe("cameraPose", () => {
  it("rests on the station during its dwell zone", () => {
    expect(cameraPose(stationAnchor("wall"))).toEqual(STATIONS[3].camera);
  });

  it("glides between stations after the dwell zone", () => {
    const [start, end] = stationRange(0);
    const mid = start + (DWELL + (1 - DWELL) / 2) * (end - start);
    const pose = cameraPose(mid);
    const a = STATIONS[0].camera.position;
    const b = STATIONS[1].camera.position;
    expect(pose.position[2]).toBeCloseTo((a[2] + b[2]) / 2);
  });

  it("cuts instead of gliding in reduced-motion mode", () => {
    const [start, end] = stationRange(0);
    const early = start + (DWELL + 0.1) * (end - start);
    const late = start + 0.9 * (end - start);
    expect(cameraPose(early, { cut: true })).toEqual(STATIONS[0].camera);
    expect(cameraPose(late, { cut: true })).toEqual(STATIONS[1].camera);
  });

  it("stays on the last station at the end", () => {
    expect(cameraPose(1)).toEqual(STATIONS[n - 1].camera);
  });
});

describe("resolveHash", () => {
  it("resolves station hashes", () => {
    expect(resolveHash("#checkout")).toBe("checkout");
    expect(resolveHash("brew-bar")).toBe("brew-bar");
  });
  it("sends any project slug to the brew bar", () => {
    expect(resolveHash("#kislap")).toBe("brew-bar");
    expect(resolveHash("#trackhab")).toBe("brew-bar");
  });
  it("ignores unknown or empty hashes", () => {
    expect(resolveHash("#foo")).toBeNull();
    expect(resolveHash("")).toBeNull();
    expect(resolveHash("#")).toBeNull();
  });
});

describe("menuTargetForHash", () => {
  it("targets a project ticket for a project slug", () => {
    expect(menuTargetForHash("#kislap")).toBe("menu-kislap");
  });
  it("targets the station's menu section", () => {
    expect(menuTargetForHash("#checkout")).toBe("menu-find-us");
    expect(menuTargetForHash("#brew-bar")).toBe("menu-drinks");
  });
  it("returns null for unknown or empty hashes", () => {
    expect(menuTargetForHash("#foo")).toBeNull();
    expect(menuTargetForHash("")).toBeNull();
  });
});

describe("indoor layout", () => {
  it("keeps every station after the storefront inside the shop", () => {
    for (const s of STATIONS.slice(1)) {
      expect(s.camera.position[2]).toBeLessThan(0);
      expect(s.camera.target[2]).toBeLessThan(0);
      expect(Math.abs(s.camera.target[0])).toBeLessThan(7);
    }
  });
});

describe("stationYaw", () => {
  it("turns a +z face toward the camera", () => {
    expect(stationYaw("wall")).toBeCloseTo(Math.PI / 2);
    expect(stationYaw("specials")).toBeCloseTo(-Math.PI / 2);
    expect(stationYaw("storefront")).toBeCloseTo(0);
  });
});
