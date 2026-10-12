"use client";

// Shared toon helpers: every café mesh uses the same banded material and
// ink outline, so the style is set in one place.

import { Outlines } from "@react-three/drei";
import type { Texture } from "three";
import { INK, OUTLINE_THICKNESS, toonGradient } from "@/components/cafe/materials/toon";

export function Toon({
  color,
  transparent = false,
  opacity = 1,
  map,
  emissive,
  emissiveIntensity = 1,
}: {
  color: string;
  transparent?: boolean;
  opacity?: number;
  map?: Texture;
  emissive?: string;
  emissiveIntensity?: number;
}) {
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
