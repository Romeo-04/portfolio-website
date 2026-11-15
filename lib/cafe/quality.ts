// Render quality (spec section 3, "Performance"). A ladder, not a cliff: a
// device that can't hold the frame rate steps down one rung at a time, so it
// loses the costliest extras first and keeps as much of the look as it can
// carry. A step down is sticky, so quality never flickers back.
//
//   high    post-processing (ambient occlusion, bloom, SMAA) and sun shadows
//   medium  sun shadows at half resolution, the browser's own antialiasing
//   lean    no shadows; where phones start
//   low     as lean, at one device pixel per CSS pixel

export type Quality = {
  dpr: [number, number];
  effects: boolean;
  shadows: boolean;
  /** Sun shadow map resolution. */
  shadowMap: number;
  /** False on the last rung: there is nothing left to drop. */
  canDecline: boolean;
};

const LADDER: readonly Quality[] = [
  { dpr: [1, 1.75], effects: true, shadows: true, shadowMap: 2048, canDecline: true },
  { dpr: [1, 1.5], effects: false, shadows: true, shadowMap: 1024, canDecline: true },
  { dpr: [1, 1.5], effects: false, shadows: false, shadowMap: 1024, canDecline: true },
  { dpr: [1, 1], effects: false, shadows: false, shadowMap: 1024, canDecline: false },
];

/** Phones (light 3D) start on the lean rung. */
const LIGHT_START = 2;

export function qualityFor(opts: { light: boolean; declines: number }): Quality {
  const rung = (opts.light ? LIGHT_START : 0) + Math.max(0, opts.declines);
  return LADDER[Math.min(rung, LADDER.length - 1)];
}

/** A frame slower than this (about 42 fps) is too slow to feel smooth. */
export const SLOW_FRAME_MS = 24;

/**
 * Judges a run of frame times (ms) from continuous rendering. The median is
 * used, so a few long frames (shader compiles, texture uploads) don't count
 * against a device that is otherwise smooth.
 */
export function isSlow(frameTimes: readonly number[]): boolean {
  if (frameTimes.length === 0) return false;
  const sorted = [...frameTimes].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] > SLOW_FRAME_MS;
}
