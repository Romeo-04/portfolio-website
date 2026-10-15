"use client";

// Shared toon helpers: every café mesh uses the same banded material and
// ink outline, so the style is set in one place.

import { Outlines } from "@react-three/drei";
import type { Texture } from "three";
import { INK, OUTLINE_THICKNESS, toonGradient } from "@/components/cafe/materials/toon";
import { useCafeTexture, type Surface } from "@/components/cafe/textures";

type ToonProps = {
  color: string;
  transparent?: boolean;
  opacity?: number;
  map?: Texture;
  emissive?: string;
  emissiveIntensity?: number;
  /** A painted detail map (wood grain, leather, linen...) under the colour. */
  surface?: Surface;
  /** How many times the surface repeats across each face. */
  surfaceRepeat?: [number, number];
};

/** Toon with a surface: loads the shared detail map, then draws as usual. */
function SurfacedToon({ surface, surfaceRepeat = [1, 1], ...props }: ToonProps & { surface: Surface }) {
  const map = useCafeTexture(surface, surfaceRepeat[0], surfaceRepeat[1]);
  return <Toon {...props} map={map} />;
}

export function Toon({
  color,
  transparent = false,
  opacity = 1,
  map,
  emissive,
  emissiveIntensity = 1,
  surface,
  surfaceRepeat,
}: ToonProps) {
  if (surface && !map) {
    return (
      <SurfacedToon
        surface={surface}
        surfaceRepeat={surfaceRepeat}
        color={color}
        transparent={transparent}
        opacity={opacity}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
      />
    );
  }
  return (
    <meshToonMaterial
      color={color}
      gradientMap={toonGradient()}
      transparent={transparent}
      opacity={opacity}
      map={map ?? null}
      emissive={emissive ?? "#000000"}
      emissiveIntensity={emissiveIntensity}
      depthWrite={!transparent}
    />
  );
}

export function Ink() {
  return <Outlines thickness={OUTLINE_THICKNESS} color={INK} />;
}
