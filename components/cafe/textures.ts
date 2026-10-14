"use client";

// ============================================================
// PAINTED TEXTURES
// ============================================================
// Hand-painted surfaces and art prints, generated as tileable illustrations
// and shipped as small webp files in public/textures (about 500 KB for all
// of them). Each image loads once and is shared; callers get a copy with
// their own repeat, so the pixels upload to the GPU only once.
// ============================================================

import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import { NoColorSpace, RepeatWrapping, SRGBColorSpace, type Texture } from "three";

export const TEXTURES = {
  /** Light oak floorboards; one tile = 2 m × 2 m. */
  floor: "/textures/oak-floor.webp",
  /** Warm cream plaster; one tile = 3 m × 3 m. */
  plaster: "/textures/plaster-wall.webp",
  /** Red brick; one tile = 1 m × 1 m. */
  brick: "/textures/brick.webp",
  /** White marble with grey veins. */
  marble: "/textures/marble.webp",
  /** Vertical cedar cladding boards; one tile = 1 m wide. */
  cladding: "/textures/cladding.webp",
  /** Green-black slate with chalk dust. */
  chalkboard: "/textures/chalkboard.webp",
  /** White chalk doodles on black, used as an alpha mask. */
  doodles: "/textures/chalk-doodles.webp",
  rug: "/textures/rug.webp",
  "art-latte": "/textures/art-latte.webp",
  "art-plant": "/textures/art-plant.webp",
  "art-city": "/textures/art-city.webp",
  "art-beans": "/textures/art-beans.webp",
} as const;

export type TextureName = keyof typeof TEXTURES;

/** Masks hold data, not colour, so they skip the sRGB conversion. */
const DATA_TEXTURES: ReadonlySet<TextureName> = new Set(["doodles"]);

/** A copy of a shared texture with its own repeat (the image stays shared). */
export function repeated(tex: Texture, x: number, y: number): Texture {
  const t = tex.clone();
  t.repeat.set(x, y);
  t.needsUpdate = true;
  return t;
}

/** Loads a café texture (suspends until ready) and repeats it x × y times. */
export function useCafeTexture(name: TextureName, x = 1, y = 1): Texture {
  const base = useTexture(TEXTURES[name]);
  return useMemo(() => {
    // Settings live on the copy; the loaded original stays untouched.
    const t = repeated(base, x, y);
    t.colorSpace = DATA_TEXTURES.has(name) ? NoColorSpace : SRGBColorSpace;
    t.wrapS = RepeatWrapping;
    t.wrapT = RepeatWrapping;
    t.anisotropy = 8;
    return t;
  }, [base, name, x, y]);
}

/** Start every download as soon as the scene module loads. */
export function preloadCafeTextures() {
  Object.values(TEXTURES).forEach((url) => useTexture.preload(url));
}
