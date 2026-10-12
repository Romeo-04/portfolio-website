"use client";

// ============================================================
// STATION 2: MENU BOARD
// ============================================================
// A chalkboard: the tagline and the three skill tiers write themselves on,
// line by line, while the camera holds here. Beside it hangs the
// "Barista of the Month" portrait. Text is visual only; the Quick Order
// menu carries the readable copy.
// ============================================================

import { Html, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Component, Suspense, useRef, type ReactNode } from "react";
import { Ink, Toon } from "@/components/cafe/kit";
import { personalInfo, skillsData, tierLabels, type SkillTier } from "@/data/portfolio";
import { dwellT, stagger } from "@/lib/cafe/choreo";
import { getProgress } from "@/lib/cafe/scroll";
import { DWELL, STATIONS, stationRange } from "@/lib/cafe/stations";
import { CHALK, OAK_DARK } from "@/components/cafe/palette";

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

// Board centre; the camera looks at [0, 2.6, -4].
// The chalk wall hangs on the back wall under the mezzanine, left of the
// doorway: centred on the station's target, just proud of the wall.
const [BX] = STATIONS.find((s) => s.id === "menu-board")!.camera.target;
const BOARD: [number, number, number] = [BX, 1.85, -9.35];

function Portrait() {
  const texture = useTexture(personalInfo.heroImage);
  return (
    <mesh position={[0, 0, 0.035]}>
      <planeGeometry args={[0.8, 0.8]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

/** A missing photo must not take the board down with it. */
class PortraitBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function MenuBoard() {
  const lines = useRef<(HTMLSpanElement | null)[]>([]);

  const chalk = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);

  useFrame(() => {
    const [a, b] = stationRange(0);
    const v = getProgress() >= a + DWELL * (b - a) ? "visible" : "hidden";
    if (chalk.current) chalk.current.style.visibility = v;
    if (label.current) label.current.style.visibility = v;
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
        <div ref={chalk} style={{ visibility: "hidden" }} className="font-chalk w-[560px] text-[#f5e9da]">
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
      <group position={[-2.4, 0, 0.05]}>
        <mesh>
          <boxGeometry args={[0.95, 0.95, 0.06]} />
          <Toon color="#c9a227" />
          <Ink />
        </mesh>
        <PortraitBoundary>
          <Suspense fallback={null}>
            <Portrait />
          </Suspense>
        </PortraitBoundary>
        <Html transform position={[0, -0.62, 0.05]} distanceFactor={2.2} className="pointer-events-none">
          <div ref={label} style={{ visibility: "hidden" }} className="font-receipt text-xs font-bold whitespace-nowrap text-[#2b2b2e]">
            Barista of the Month
          </div>
        </Html>
      </group>
    </group>
  );
}
