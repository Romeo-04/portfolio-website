"use client";

// Shared toon helpers: every café mesh uses the same soft-shaded material
// and ink outline, so the style is set in one place.

import { Outlines } from "@react-three/drei";
import type { Texture } from "three";
import {
  INK,
  OUTLINE_THICKNESS,
  SOFT_DEFINES,
  SOFT_DETAIL_DEFINES,
  softToon,
  toonGradient,
} from "@/components/cafe/materials/toon";
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
  /** The map is surface grain: draw it softly (set by `surface`). */
  detail?: boolean;
};

/** Toon with a surface: loads the shared detail map, then draws as usual. */
function SurfacedToon({ surface, surfaceRepeat = [1, 1], ...props }: ToonProps & { surface: Surface }) {
  const map = useCafeTexture(surface, surfaceRepeat[0], surfaceRepeat[1]);
  return <Toon {...props} map={map} detail />;
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
  detail = false,
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
      defines={detail ? SOFT_DETAIL_DEFINES : SOFT_DEFINES}
      onBeforeCompile={softToon}
    />
  );
}

export function Ink() {
  return <Outlines thickness={OUTLINE_THICKNESS} color={INK} />;
}
