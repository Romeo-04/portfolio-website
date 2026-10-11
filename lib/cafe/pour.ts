// ============================================================
// POUR MATH
// ============================================================
// Which cup is pouring, and how full, is a pure function of scroll
// progress: scrolling back un-pours with no stored state. Cups pour in
// turn while the camera rests at the brew bar (the dwell zone).
// layerIndexAt is the JavaScript twin of the pour shader's layer pick,
// kept here so the rule is tested.
// ============================================================

import { DWELL, stationProgress } from "@/lib/cafe/stations";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function cupFill(progress: number, cupIndex: number, cupCount: number): number {
  if (cupCount <= 0) return 0;
  const dwell = clamp01(stationProgress(progress, "brew-bar") / DWELL);
  return clamp01(dwell * cupCount - cupIndex);
}

export function layerIndexAt(height: number, layerCount: number): number {
  const i = Math.floor(clamp01(height) * layerCount);
  return Math.min(Math.max(i, 0), layerCount - 1);
}
