// ============================================================
// CAMERA DAMPING
// ============================================================
// The camera eases toward the pose that scroll asks for instead of jumping
// to it, so scroll jitter never reaches the screen. Exponential damping is
// frame-rate independent: two half-length frames land where one full frame
// would. Long frames are clamped, because with on-demand rendering the
// first frame after an idle gap can be seconds long.
// ============================================================

import type { Vec3 } from "@/lib/cafe/stations";

/** Higher is snappier; 3 settles in about a second (floaty glide). */
export const CAMERA_LAMBDA = 3;

/** Longest frame the damping will honour, in seconds. */
export const MAX_DT = 1 / 30;

/** A target jump bigger than this is a teleport (deep link, menu jump): snap. */
export const SNAP_DISTANCE = 3;

export function damp(current: number, target: number, lambda: number, dt: number): number {
  const t = Math.min(dt, MAX_DT);
  return target + (current - target) * Math.exp(-lambda * t);
}

export function dampVec3(current: Vec3, target: Vec3, lambda: number, dt: number): Vec3 {
  return [
    damp(current[0], target[0], lambda, dt),
    damp(current[1], target[1], lambda, dt),
    damp(current[2], target[2], lambda, dt),
  ];
}

export function distance3(a: Vec3, b: Vec3): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

export function shouldSnap(previousTarget: Vec3, nextTarget: Vec3): boolean {
  return distance3(previousTarget, nextTarget) > SNAP_DISTANCE;
}
