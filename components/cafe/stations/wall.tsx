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

/** The seal's metal: gold, silver, bronze, or a red wax seal for special honours. */
const SEAL_COLORS: Record<Achievement["tier"], string> = {
  gold: "#e0b13a",
  silver: "#d5d9de",
  bronze: "#c27a3e",
  special: "#b8322a",
};

const COLS = 4;
const FW = 1.1;
const FH = 0.7;
/** Frame centre below its nail. */
const FY = -0.4;

/**
 * A grand certificate frame: a deep moulding with a raised inner lip and
 * corner rosettes, a cream mat, a gilt fillet round an ivory certificate,
 * an embossed seal with ribbon tails, and a brass picture lamp on top.
 */
function Certificate({ a }: { a: Achievement }) {
  const frame = FRAME_COLORS[a.tier];
  const surface = a.tier === "bronze" ? "wood" : "metal";
  const seal = SEAL_COLORS[a.tier];
  return (
    <group>
      {/* Nail and hanging wire. */}
      <mesh>
        <sphereGeometry args={[0.022, 10, 8]} />
        <Toon color={CHARCOAL} surface="metal" />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.2, -0.035, 0.01]} rotation-z={side * 1.2}>
          <boxGeometry args={[0.006, 0.45, 0.004]} />
          <meshBasicMaterial color="#3a3a3a" />
        </mesh>
      ))}
      <group position={[0, FY, 0]}>
        {/* Moulding, raised inner lip, corner rosettes. */}
        <mesh>
          <boxGeometry args={[FW, FH, 0.06]} />
          <Toon color={frame} surface={surface} />
          <Ink />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <boxGeometry args={[FW - 0.1, FH - 0.1, 0.06]} />
          <Toon color={frame} surface={surface} />
          <Ink />
        </mesh>
        {[
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ].map(([sx, sy]) => (
          <mesh key={`${sx}${sy}`} position={[(sx * (FW - 0.05)) / 2, (sy * (FH - 0.05)) / 2, 0.035]}>
            <sphereGeometry args={[0.034, 12, 8]} />
            <Toon color={frame} surface={surface} />
            <Ink />
          </mesh>
        ))}
        {/* Mat, gilt fillet, certificate paper. */}
        <mesh position={[0, 0, 0.043]}>
          <planeGeometry args={[FW - 0.16, FH - 0.16]} />
          <Toon color={CREAM} />
        </mesh>
        <mesh position={[0, 0, 0.044]}>
          <planeGeometry args={[FW - 0.25, FH - 0.25]} />
          <Toon color="#c9a24a" />
        </mesh>
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[FW - 0.262, FH - 0.262]} />
          <Toon color="#fffaf0" />
        </mesh>
        <mesh position={[0, 0.125, 0.046]}>
          <planeGeometry args={[0.5, 0.004]} />
          <meshBasicMaterial color={ACCENT_COLORS[a.tier]} />
        </mesh>
        <Label font="body" fontSize={0.026} letterSpacing={0.18} color="#8a6a3a" position={[0, 0.15, 0.047]}>
          IN RECOGNITION
        </Label>
        <Label
          font="display"
          fontSize={0.056}
          maxWidth={0.66}
          textAlign="center"
          lineHeight={1.08}
          color="#2b1a10"
          position={[-0.04, 0.025, 0.047]}
        >
          {a.title}
        </Label>
        <Label font="body" fontSize={0.036} color="#6b5d4f" position={[-0.04, -0.115, 0.047]}>
          {a.year}
        </Label>
        {/* Seal with ribbon tails, lower right. */}
        <group position={[0.33, -0.12, 0.05]}>
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * 0.022, -0.06, -0.002]} rotation-z={side * 0.3}>
              <planeGeometry args={[0.035, 0.1]} />
              <meshBasicMaterial color={ACCENT_COLORS[a.tier]} />
            </mesh>
          ))}
          <mesh rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.058, 0.058, 0.012, 20]} />
            <Toon color={seal} surface="metal" />
            <Ink />
          </mesh>
          <mesh position={[0, 0, 0.007]}>
            <ringGeometry args={[0.036, 0.042, 20]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.25} />
          </mesh>
          {/* Embossed star: two offset triangles. */}
          {[0, Math.PI].map((r) => (
            <mesh key={r} position={[0, 0, 0.008]} rotation-z={r + Math.PI / 2}>
              <circleGeometry args={[0.028, 3]} />
              <meshBasicMaterial color="#000000" transparent opacity={0.22} />
            </mesh>
          ))}
        </group>
        {/* Brass picture lamp over the frame. */}
        <group position={[0, FH / 2 + 0.07, 0.1]}>
          <mesh rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.03, 0.03, 0.36, 12]} />
            <Toon color={BRASS} surface="metal" />
            <Ink />
          </mesh>
          <mesh position={[0, -0.02, -0.05]} rotation-x={0.6}>
            <boxGeometry args={[0.012, 0.012, 0.1]} />
            <Toon color={BRASS} surface="metal" />
          </mesh>
          <mesh position={[0, -0.031, 0]}>
            <boxGeometry args={[0.32, 0.006, 0.03]} />
            <meshBasicMaterial color="#fff1c8" toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

const [WALL_X, WALL_Y, WALL_Z] = STATIONS.find((s) => s.id === "wall")!.camera.target;

/** Nail position for frame i, in wall space (wall faces +z). */
function nail(i: number): [number, number, number] {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  return [(col - (COLS - 1) / 2) * 1.3, 1.08 - row * 0.92, 0.05];
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
          <Certificate a={a} />
        </group>
      ))}
    </group>
  );
}
