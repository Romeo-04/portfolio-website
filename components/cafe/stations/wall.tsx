"use client";

// ============================================================
// STATION 4: WALL OF FAME
// ============================================================
// Every achievement hangs in a frame on the wall. While the camera holds
// here, the frames swing in one after another and settle on their nails.
// ============================================================

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { Ink, Toon } from "@/components/cafe/kit";
import { Label } from "@/components/cafe/text3d";
import { BRASS, BRICK_TINT, CHARCOAL, CREAM, OAK_DARK } from "@/components/cafe/palette";
import { useCafeTexture } from "@/components/cafe/textures";
import { achievementsData, type Achievement } from "@/data/portfolio";
import { dwellT, frameAngle } from "@/lib/cafe/choreo";
import { getProgress } from "@/lib/cafe/scroll";
import { STATIONS, stationYaw } from "@/lib/cafe/stations";

/** Frame moulding per tier, and a lively accent band for the art. */
const FRAME_COLORS: Record<Achievement["tier"], string> = {
  gold: BRASS,
  silver: "#c9ccd1",
  bronze: OAK_DARK,
  special: CHARCOAL,
};
const ACCENT_COLORS: Record<Achievement["tier"], string> = {
  gold: "#f3a712",
  silver: "#669bbc",
  bronze: "#e4572e",
  special: "#8cb369",
};

const COLS = 4;

const [WALL_X, WALL_Y, WALL_Z] = STATIONS.find((s) => s.id === "wall")!.camera.target;

/** Nail position for frame i, in wall space (wall faces +z). */
function nail(i: number): [number, number, number] {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  return [(col - (COLS - 1) / 2) * 1.25, 1.0 - row * 0.85, 0.05];
}

export default function Wall() {
  const frames = useRef<(Group | null)[]>([]);
  const brick = useCafeTexture("brick", 6, 3.2);
  const count = achievementsData.length;

  useFrame(() => {
    const t = dwellT(getProgress(), "wall");
    frames.current.forEach((g, i) => {
      if (!g) return;
      g.rotation.x = -frameAngle(t, i, count);
      const shown = t * count > i;
      g.visible = shown;
    });
  });

  // The wall stands just behind the wall station's target, facing its camera.
  return (
    <group position={[WALL_X - 0.4, WALL_Y, WALL_Z]} rotation={[0, stationYaw("wall"), 0]}>
      <mesh>
        <planeGeometry args={[6, 3.2]} />
        <Toon color={BRICK_TINT} map={brick} />
      </mesh>
      {achievementsData.map((a, i) => (
        <group
          key={a.title}
          position={nail(i)}
          ref={(g) => {
            frames.current[i] = g;
          }}
        >
          {/* Moulding, cream mat, and an accent band like a print. */}
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[1.05, 0.62, 0.05]} />
            <Toon color={FRAME_COLORS[a.tier]} surface={a.tier === "bronze" ? "wood" : "metal"} />
            <Ink />
          </mesh>
          <mesh position={[0, -0.3, 0.027]}>
            <planeGeometry args={[0.93, 0.5]} />
            <Toon color={CREAM} />
          </mesh>
          <mesh position={[0, -0.12, 0.029]}>
            <planeGeometry args={[0.81, 0.08]} />
            <Toon color={ACCENT_COLORS[a.tier]} />
          </mesh>
          <Label font="display" fontSize={0.06} maxWidth={0.8} textAlign="center" lineHeight={1.1} color="#2b2b2e" position={[0, -0.3, 0.032]}>
            {a.title}
          </Label>
          <Label font="body" fontSize={0.042} color="#6b5d4f" position={[0, -0.47, 0.032]}>
            {a.year}
          </Label>
        </group>
      ))}
    </group>
  );
}
