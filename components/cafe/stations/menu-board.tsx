"use client";

// ============================================================
// STATION 2: MENU BOARD
// ============================================================
// A chalkboard: the tagline and the three skill tiers write themselves on,
// line by line, while the camera holds here. Text is visual only; the
// Quick Order menu carries the readable copy.
// ============================================================

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Ink, Toon } from "@/components/cafe/kit";
import { Label } from "@/components/cafe/text3d";
import { CHALK, OAK_DARK } from "@/components/cafe/palette";
import { personalInfo, skillsData, tierLabels, type SkillTier } from "@/data/portfolio";
import { dwellT, stagger } from "@/lib/cafe/choreo";
import { getProgress } from "@/lib/cafe/scroll";
import { STATIONS } from "@/lib/cafe/stations";

const TIERS: SkillTier[] = ["house", "seasonal", "experimental"];

const LINES = [
  personalInfo.tagline,
  ...TIERS.map(
    (tier) =>
      `${tierLabels[tier]}: ${skillsData
        .flatMap((c) => c.skills)
        .filter((s) => s.tier === tier)
        .map((s) => s.name)
        .join(" · ")}`,
  ),
];

// The chalk wall hangs on the back wall under the mezzanine, left of the
// doorway: centred on the station's target, just proud of the wall.
const [BX] = STATIONS.find((s) => s.id === "menu-board")!.camera.target;
const BOARD: [number, number, number] = [BX, 1.85, -9.35];

const TEXT_LEFT = -1.42;
const TEXT_WIDTH = 2.84;
const TOP = 0.48;
const GAP = 0.07;

export default function MenuBoard() {
  // troika text meshes; typed loosely because drei doesn't export the type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lines = useRef<any[]>([]);
  /** Measured height of each wrapped line, filled in as troika lays them out. */
  const heights = useRef<number[]>([]);

  useFrame(() => {
    const t = dwellT(getProgress(), "menu-board");
    // Stack the blocks by their real wrapped height, so long lines never overlap.
    let y = TOP;
    lines.current.forEach((mesh, i) => {
      if (!mesh) return;
      mesh.position.y = y;
      y -= (heights.current[i] ?? 0.13) + GAP;
      // Chalk writes on left to right: widen the clip window as t grows.
      const shown = stagger(t, i, LINES.length);
      mesh.clipRect = [-0.05, -1, -0.05 + shown * (TEXT_WIDTH + 0.1), 1];
    });
  });

  return (
    <group position={BOARD}>
      <mesh>
        <boxGeometry args={[3.4, 2.2, 0.08]} />
        <Toon color={OAK_DARK} />
        <Ink />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[3.2, 2]} />
        <Toon color={CHALK} />
      </mesh>
      <Label font="display" fontSize={0.24} color="#f6efe2" position={[0, 0.7, 0.06]}>
        MENU
      </Label>
      {LINES.map((line, i) => (
        <Label
          key={line}
          ref={(m) => {
            lines.current[i] = m;
          }}
          font="chalk"
          fontSize={0.092}
          lineHeight={1.2}
          maxWidth={TEXT_WIDTH}
          anchorX="left"
          anchorY="top"
          color="#f3ede0"
          position={[TEXT_LEFT, TOP, 0.06]}
          onSync={(mesh) => {
            const [, minY, , maxY] = mesh.textRenderInfo?.blockBounds ?? [0, 0, 0, 0.13];
            heights.current[i] = maxY - minY;
          }}
          clipRect={[-0.05, -1, -0.05, 1]}
        >
          {line}
        </Label>
      ))}
    </group>
  );
}
