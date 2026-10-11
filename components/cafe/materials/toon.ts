// ============================================================
// TOON MATERIAL
// ============================================================
// Three hard light bands instead of smooth shading (spec section 3,
// "Toon look"). Every MeshToonMaterial in the café uses this one
// gradient texture, so the whole shop shares one lighting style.
// ============================================================

import { DataTexture, NearestFilter, RedFormat } from "three";

export const TOON_BANDS = [0.45, 0.75, 1] as const;

/** Ink colour for outlines: the café's darkest roast. */
export const INK = "#1b120c";

/** Outline width in world units. */
export const OUTLINE_THICKNESS = 0.03;

let gradient: DataTexture | null = null;

export function toonGradient(): DataTexture {
  if (gradient) return gradient;
  const data = new Uint8Array(TOON_BANDS.map((b) => Math.round(b * 255)));
  gradient = new DataTexture(data, TOON_BANDS.length, 1, RedFormat);
  gradient.minFilter = NearestFilter;
  gradient.magFilter = NearestFilter;
  gradient.needsUpdate = true;
  return gradient;
}
