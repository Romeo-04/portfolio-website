"use client";

// ============================================================
// STATION 2: MENU BOARD
// ============================================================
// A chalkboard laid out like a café menu: the title, a one-line headline,
// and the three skill tiers side by side, each a short column under its own
// coloured-chalk heading. The headline and the columns write themselves on,
// left to right, while the camera holds here. Everything stays inside the
// clear middle of the doodle frame. Text is visual only; the Quick Order
// menu carries the readable copy.
// ============================================================

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";
import { Ink, Toon } from "@/components/cafe/kit";
import { Label } from "@/components/cafe/text3d";
import { OAK_DARK } from "@/components/cafe/palette";
import { useCafeTexture } from "@/components/cafe/textures";
import { personalInfo, skillsData, tierLabels, type SkillTier } from "@/data/portfolio";
import { dwellT, stagger } from "@/lib/cafe/choreo";
import { packLines } from "@/lib/cafe/lines";
import { getProgress } from "@/lib/cafe/scroll";
import { STATIONS } from "@/lib/cafe/stations";

const CHALK = "#f3ede0";

/** Each tier's heading is drawn in its own stick of coloured chalk. */
const TIERS: { tier: SkillTier; chalk: string }[] = [
  { tier: "house", chalk: "#f6d27a" },
  { tier: "seasonal", chalk: "#f4b3a6" },
  { tier: "experimental", chalk: "#a9d8c4" },
];

/** Column width, and the most characters a line of chalk holds in it. */
const COL_W = 0.8;
const COL_GAP = 0.06;
const LINE_CHARS = 20;

const COLUMNS = TIERS.map(({ tier, chalk }, i) => ({
  tier,
  chalk,
  x: (i - (TIERS.length - 1) / 2) * (COL_W + COL_GAP),
  heading: tierLabels[tier].toUpperCase(),
  items: packLines(
    skillsData
      .flatMap((c) => c.skills)
      .filter((s) => s.tier === tier)
      .map((s) => s.name),
    LINE_CHARS,
  ).join("\n"),
}));

// The chalk wall hangs on the back wall under the mezzanine, left of the
// doorway: centred on the station's target, just proud of the wall.
const [BX] = STATIONS.find((s) => s.id === "menu-board")!.camera.target;
const BOARD: [number, number, number] = [BX, 1.85, -9.35];

const TITLE_Y = 0.7;
const HEADLINE_Y = 0.5;
const RULE_Y = 0.41;
const HEADING_Y = 0.31;
const ITEMS_Y = 0.23;
const RULE_W = 2.3;
/** How far down the column dividers run. */
const DIVIDER_H = 0.66;

/** The headline, then one slot per column. */
const SLOTS = COLUMNS.length + 1;
/** The share of the dwell the chalk takes to write, so the finished menu
 *  holds on screen before the camera moves on. */
const WRITE_BY = 0.7;

/** A clip window that opens left to right across centred text `width` wide. */
function chalkClip(shown: number, width: number): [number, number, number, number] {
  const left = -width / 2 - 0.05;
  return [left, -2, left + shown * (width + 0.1), 2];
}

export default function MenuBoard() {
  // troika text meshes; typed loosely because drei doesn't export the type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const headline = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = useRef<any[]>([]);
  const rule = useRef<Mesh>(null);
  const slate = useCafeTexture("chalkboard");
  const doodles = useCafeTexture("doodles");

  useFrame(() => {
    const t = Math.min(1, dwellT(getProgress(), "menu-board") / WRITE_BY);
    // Chalk writes on left to right: widen each clip window as t grows.
    const first = stagger(t, 0, SLOTS);
    if (headline.current) headline.current.clipRect = chalkClip(first, RULE_W);
    if (rule.current) {
      rule.current.scale.x = Math.max(first, 0.001);
      rule.current.visible = first > 0;
    }
    columns.current.forEach((mesh, k) => {
      if (!mesh) return;
      // Heading and items share their column's slot.
      mesh.clipRect = chalkClip(stagger(t, Math.floor(k / 2) + 1, SLOTS), COL_W);
    });
  });

  return (
    <group position={BOARD}>
      <mesh>
        <boxGeometry args={[3.4, 2.2, 0.08]} />
        <Toon color={OAK_DARK} surface="wood" />
        <Ink />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[3.2, 2]} />
        <Toon color="#ffffff" map={slate} />
      </mesh>
      {/* Chalk doodles framing the menu (the mask is wiped clear where the
          text sits), in chalk white. */}
      <mesh position={[0, 0, 0.052]}>
        <planeGeometry args={[3.2, 2]} />
        <meshBasicMaterial color={CHALK} alphaMap={doodles} transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <Label font="display" fontSize={0.24} letterSpacing={0.04} color="#f6efe2" position={[0, TITLE_Y, 0.06]}>
        MENU
      </Label>
      <Label ref={headline} font="chalk" fontSize={0.078} color={CHALK} position={[0, HEADLINE_Y, 0.06]} clipRect={chalkClip(0, RULE_W)}>
        {personalInfo.headline}
      </Label>
      <mesh ref={rule} position={[0, RULE_Y, 0.058]} visible={false}>
        <planeGeometry args={[RULE_W, 0.008]} />
        <meshBasicMaterial color={CHALK} transparent opacity={0.55} depthWrite={false} />
      </mesh>
      {COLUMNS.map((col, i) => (
        <group key={col.tier} position={[col.x, 0, 0.06]}>
          <Label
            ref={(m) => {
              columns.current[i * 2] = m;
            }}
            font="display"
            fontSize={0.082}
            letterSpacing={0.06}
            color={col.chalk}
            position={[0, HEADING_Y, 0]}
            clipRect={chalkClip(0, COL_W)}
          >
            {col.heading}
          </Label>
          <Label
            ref={(m) => {
              columns.current[i * 2 + 1] = m;
            }}
            font="chalk"
            fontSize={0.076}
            lineHeight={1.3}
            maxWidth={COL_W}
            textAlign="center"
            anchorY="top"
            color={CHALK}
            position={[0, ITEMS_Y, 0]}
            clipRect={chalkClip(0, COL_W)}
          >
            {col.items}
          </Label>
          {/* A faint chalk line between columns. */}
          {i > 0 && (
            <mesh position={[-(COL_W + COL_GAP) / 2, HEADING_Y + 0.05 - DIVIDER_H / 2, -0.002]}>
              <planeGeometry args={[0.006, DIVIDER_H]} />
              <meshBasicMaterial color={CHALK} transparent opacity={0.3} depthWrite={false} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}
