// ============================================================
// CHOREOGRAPHY
// ============================================================
// Every station animation is a pure function of scroll progress, so
// scrolling back plays it in reverse with no stored state. Stations play
// inside their dwell zone, while the camera holds still on them.
// ============================================================

import { DWELL, stationProgress, type StationId } from "@/lib/cafe/stations";

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function easeInOut(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2;
}

export function easeOutBack(t: number): number {
  const x = clamp01(t);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2;
}

/** Item `index` of `count` plays its own slice of t, one after another. */
export function stagger(t: number, index: number, count: number): number {
  if (count <= 0) return 0;
  return clamp01(clamp01(t) * count - index);
}

/** 0..1 across a station's dwell zone. */
export function dwellT(progress: number, id: StationId): number {
  return clamp01(stationProgress(progress, id) / DWELL);
}

export const DOOR_OPEN = 1.9;

export function doorAngle(t: number): number {
  return easeInOut(t) * DOOR_OPEN;
}

export const FRAME_SWING = 1.2;

export function frameAngle(t: number, index: number, count: number): number {
  // easeOutBack overshoots 1; clamp so frames never swing into the wall.
  return Math.max(0, (1 - easeOutBack(stagger(t, index, count))) * FRAME_SWING);
}

/** Intro gauge: done only when the minimum time passed AND loading finished. */
export function gaugeValue(elapsedMs: number, minMs: number, loadedPct: number | null): number {
  const time = clamp01(elapsedMs / minMs);
  const loaded = loadedPct === null ? 1 : clamp01(loadedPct / 100);
  return Math.min(time, loaded);
}
