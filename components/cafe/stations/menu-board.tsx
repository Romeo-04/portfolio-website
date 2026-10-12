"use client";

// ============================================================
// STATION 2: MENU BOARD
// ============================================================
// A chalkboard: the tagline and the three skill tiers write themselves on,
// line by line, while the camera holds here. Text is visual only; the
// Quick Order menu carries the readable copy.
// ============================================================

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Ink, Toon } from "@/components/cafe/kit";
import { CHALK, OAK_DARK } from "@/components/cafe/palette";
import { personalInfo, skillsData, tierLabels, type SkillTier } from "@/data/portfolio";
import { dwellT, stagger } from "@/lib/cafe/choreo";
import { getProgress } from "@/lib/cafe/scroll";
import { DWELL, STATIONS, stationRange } from "@/lib/cafe/stations";

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

export default function MenuBoard() {
  const lines = useRef<(HTMLSpanElement | null)[]>([]);
  const chalk = useRef<HTMLDivElement>(null);

  useFrame(() => {
    // drei Html ignores walls: keep the chalk text hidden while outside.
    const [a, b] = stationRange(0);
    if (chalk.current) {
      chalk.current.style.visibility = getProgress() >= a + DWELL * (b - a) ? "visible" : "hidden";
    }
    const t = dwellT(getProgress(), "menu-board");
    lines.current.forEach((el, i) => {
      if (!el) return;
      const shown = stagger(t, i, LINES.length);
      el.style.clipPath = `inset(0 ${(1 - shown) * 100}% 0 0)`;
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
      <Html transform position={[0, 0, 0.06]} distanceFactor={2.2} className="pointer-events-none">
        <div ref={chalk} style={{ visibility: "hidden" }} className="font-board w-[560px] text-[#f5e9da]">
          <p className="mb-3 text-center text-4xl">Menu</p>
          {LINES.map((line, i) => (
            <span
              key={line}
              ref={(el) => {
                lines.current[i] = el;
              }}
              className="mb-2 block text-xl leading-snug"
              style={{ clipPath: "inset(0 100% 0 0)" }}
            >
              {line}
            </span>
          ))}
        </div>
      </Html>
    </group>
  );
}
