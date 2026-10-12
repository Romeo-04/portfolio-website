import { describe, expect, it } from "vitest";
import {
  CAMERA_LAMBDA,
  MAX_DT,
  SNAP_DISTANCE,
  damp,
  dampVec3,
  distance3,
  shouldSnap,
} from "@/lib/cafe/damp";

describe("damp", () => {
  it("moves toward the target without overshooting", () => {
    const v = damp(0, 10, CAMERA_LAMBDA, 1 / 60);
    expect(v).toBeGreaterThan(0);
    expect(v).toBeLessThan(10);
  });

  it("is frame-rate independent", () => {
    const oneStep = damp(0, 10, CAMERA_LAMBDA, 1 / 30);
    const twoSteps = damp(damp(0, 10, CAMERA_LAMBDA, 1 / 60), 10, CAMERA_LAMBDA, 1 / 60);
    expect(twoSteps).toBeCloseTo(oneStep, 10);
  });

  it("clamps long frames so an idle gap does not teleport the camera", () => {
    expect(damp(0, 10, CAMERA_LAMBDA, 5)).toBeCloseTo(damp(0, 10, CAMERA_LAMBDA, MAX_DT), 10);
    expect(damp(0, 10, CAMERA_LAMBDA, 5)).toBeLessThan(10);
  });

  it("stays put at the target", () => {
    expect(damp(3, 3, CAMERA_LAMBDA, 1 / 60)).toBe(3);
  });
});

describe("dampVec3 and distance3", () => {
  it("damps each axis toward the target", () => {
    const v = dampVec3([0, 0, 0], [3, -6, 9], CAMERA_LAMBDA, 1 / 60);
    expect(v[0]).toBeGreaterThan(0);
    expect(v[1]).toBeLessThan(0);
    expect(v[2]).toBeGreaterThan(0);
    expect(distance3(v, [3, -6, 9])).toBeLessThan(distance3([0, 0, 0], [3, -6, 9]));
  });
});

describe("shouldSnap", () => {
  it("snaps on a teleport-sized jump of the target pose", () => {
    expect(shouldSnap([0, 0, 0], [0, 0, SNAP_DISTANCE + 0.1])).toBe(true);
  });
  it("damps normal scroll steps", () => {
    expect(shouldSnap([0, 0, 0], [0, 0, 0.2])).toBe(false);
  });
});
