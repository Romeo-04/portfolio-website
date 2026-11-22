// How far (in CSS px) the 3D view shifts so the café centres in the space
// an open station panel leaves free: right of the side panel on wider
// screens, above the bottom sheet on phones. The panel sets it; the scene
// eases the camera's view offset toward it.

let inset = 0;
let insetY = 0;
const listeners = new Set<() => void>();

/** Horizontal shift: positive moves the café right. */
export function getViewInset(): number {
  return inset;
}

/** Vertical shift: positive moves the café up. */
export function getViewInsetY(): number {
  return insetY;
}

export function setViewInset(px: number, pyUp = 0): void {
  if (px === inset && pyUp === insetY) return;
  inset = px;
  insetY = pyUp;
  listeners.forEach((fn) => fn());
}

export function subscribeViewInset(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** The camera's vertical field of view on wide screens, in degrees. */
export const BASE_FOV = 50;
/** The narrowest horizontal view a tall screen may get, in degrees. */
const MIN_HFOV = 48;
/** A ceiling on the vertical view, so tall phones don't fish-eye. */
const MAX_FOV = 86;

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

/**
 * Vertical field of view for a viewport of this aspect (width / height).
 * The camera keeps a fixed vertical view, so a portrait phone would see a
 * sliver of each station; below the aspect where the horizontal view drops
 * under MIN_HFOV the vertical view widens to hold it, up to MAX_FOV.
 */
export function fovFor(aspect: number): number {
  if (!(aspect > 0)) return BASE_FOV;
  const needed = toDeg(2 * Math.atan(Math.tan(toRad(MIN_HFOV) / 2) / aspect));
  return Math.min(MAX_FOV, Math.max(BASE_FOV, needed));
}
