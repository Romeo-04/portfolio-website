"use client";

// ============================================================
// STATION 4: WALL OF FAME
// ============================================================
// Every achievement hangs in a frame on the wall. While the camera holds
// here, the frames swing in one after another and settle on their nails.
// ============================================================

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { Ink, Toon } from "@/components/cafe/kit";
import { achievementsData, type Achievement } from "@/data/portfolio";
import { dwellT, frameAngle } from "@/lib/cafe/choreo";
import { getProgress } from "@/lib/cafe/scroll";

const TIER_COLORS: Record<Achievement["tier"], string> = {
  gold: "#c9a227",
  silver: "#b8b8b8",
  bronze: "#a0643c",
  special: "#7b4fa0",
};

const COLS = 4;

/** Nail position for frame i, in wall space (wall faces +z). */
function nail(i: number): [number, number, number] {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  return [(col - (COLS - 1) / 2) * 1.25, 1.0 - row * 0.85, 0.05];
}

export default function Wall() {
  const frames = useRef<(Group | null)[]>([]);
  const count = achievementsData.length;

  useFrame(() => {
    const t = dwellT(getProgress(), "wall");
    frames.current.forEach((g, i) => {
      if (!g) return;
      g.rotation.x = -frameAngle(t, i, count);
      g.visible = t * count > i;
    });
  });

  // The camera looks along -x at [-6, 1.8, 0], so the wall stands at
  // x = -6.4 and faces +x.
  return (
    <group position={[-6.4, 1.8, 0]} rotation={[0, Math.PI / 2, 0]}>
      <mesh>
        <planeGeometry args={[6, 3.2]} />
        <Toon color="#7a4a2a" />
      </mesh>
      {achievementsData.map((a, i) => (
        <group
          key={a.title}
          position={nail(i)}
          ref={(g) => {
            frames.current[i] = g;
          }}
        >
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[1.05, 0.6, 0.05]} />
            <Toon color={TIER_COLORS[a.tier]} />
            <Ink />
          </mesh>
          <Html transform position={[0, -0.3, 0.04]} distanceFactor={1.6} className="pointer-events-none">
            <div className="font-receipt w-[220px] text-center text-[11px] leading-tight text-[#1b120c]">
              <strong className="block">{a.title}</strong>
              {a.year}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}
