// ============================================================
// POUR MATH
// ============================================================
// Which cup is pouring, and how full, is a pure function of scroll
// progress: scrolling back un-pours with no stored state. Cups pour in
// turn over the first half of the brew bar's dwell zone, so all of them
// are full by the point where the camera rests (and where the nav lands).
// layerIndexAt is the JavaScript twin of the pour shader's layer pick,
// kept here so the rule is tested.
// ============================================================

import { DWELL, stationProgress } from "@/lib/cafe/stations";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Share of the dwell zone the pour takes; the anchor sits at its end. */
export const POUR_SHARE = 0.5;

export function cupFill(progress: number, cupIndex: number, cupCount: number): number {
  if (cupCount <= 0) return 0;
  const pour = clamp01(stationProgress(progress, "brew-bar") / (DWELL * POUR_SHARE));
  return clamp01(pour * cupCount - cupIndex);
}

export function layerIndexAt(height: number, layerCount: number): number {
  const i = Math.floor(clamp01(height) * layerCount);
  return Math.min(Math.max(i, 0), layerCount - 1);
}
