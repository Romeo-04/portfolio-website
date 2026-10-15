"use client";

// ============================================================
// BREW BAR (built-in)
// ============================================================
// The counter the signature cups sit on: a marble top over cedar slats, a
// two-group espresso machine and grinder at the far end, a pastry case at
// the near end, a tip jar, and shelves of jars and stacked cups behind.
// A Blender "brew-bar" model replaces it (see docs/cafe-models.md). The
// cups themselves stay in scene.tsx because they pour with scroll.
// ============================================================

import { Ink, Toon } from "@/components/cafe/kit";
import { useCafeTexture, type Surface } from "@/components/cafe/textures";
import { BRASS, CEDAR_TINT, CHARCOAL, GLASS, OAK, OAK_DARK, TERRACOTTA, WHITE } from "@/components/cafe/palette";

type V3 = [number, number, number];

const JAR_COLORS = ["#e4572e", "#f3a712", "#8cb369", "#669bbc", "#f0c987", "#bc4b51"];
const CHROME = "#e6e9ec";
const STEEL = "#b9bfc5";

/** Metals get brushed metal, woods get grain; everything else stays plain. */
function surfaceFor(color: string): Surface | undefined {
  if (color === CHROME || color === STEEL || color === BRASS || color === CHARCOAL) return "metal";
  if (color === OAK || color === OAK_DARK) return "wood";
  return undefined;
}

function Part({
  position,
  size,
  color,
  ink = false,
  rotation,
  surface,
}: {
  position: V3;
  size: V3;
  color: string;
  ink?: boolean;
  rotation?: V3;
  surface?: Surface;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={size} />
      <Toon color={color} surface={surface ?? surfaceFor(color)} />
      {ink && <Ink />}
    </mesh>
  );
}

function Cyl({
  position,
  r,
  h,
  color,
  rTop,
  ink = false,
  rotation,
  surface,
}: {
  position: V3;
  r: number;
  h: number;
  color: string;
  rTop?: number;
  ink?: boolean;
  rotation?: V3;
  surface?: Surface;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[rTop ?? r, r, h, 18]} />
      <Toon color={color} surface={surface ?? surfaceFor(color)} />
      {ink && <Ink />}
    </mesh>
  );
}

/**
 * A two-group espresso machine at the far end of the counter, its front
 * facing the customers (-x): chrome body with a terracotta panel, gauges,
 * group heads with portafilters, a steam wand, a drip tray with a shot
 * waiting, and cups warming on top.
 */
function EspressoMachine() {
  return (
    <group position={[5.82, 1.14, -4.3]}>
      <Part position={[0, 0.3, 0]} size={[0.46, 0.56, 0.72]} color={CHROME} ink />
      <Part position={[-0.235, 0.38, 0]} size={[0.02, 0.26, 0.6]} color={TERRACOTTA} />
      <Part position={[0, 0.6, 0]} size={[0.5, 0.04, 0.76]} color={BRASS} ink />
      {[-0.3, 0.3].map((z) => (
        <Cyl key={z} position={[0, 0.01, z]} r={0.03} h={0.03} color={CHARCOAL} />
      ))}
      {/* Pressure gauges. */}
      {[-0.13, 0.13].map((z) => (
        <group key={z} position={[-0.25, 0.45, z]} rotation-z={Math.PI / 2}>
          <Cyl position={[0, 0, 0]} r={0.05} h={0.02} color={BRASS} />
          <Cyl position={[0, 0.011, 0]} r={0.042} h={0.004} color={WHITE} />
          <Part position={[0, 0.015, 0.012]} size={[0.004, 0.003, 0.032]} color="#c3423f" rotation={[0, 0.6, 0]} />
        </group>
      ))}
      {/* Group heads, portafilters with black handles, and spouts. */}
      {[-0.17, 0.17].map((z) => (
        <group key={z} position={[-0.29, 0.26, z]}>
          <Cyl position={[0, 0.03, 0]} r={0.055} h={0.06} color={STEEL} ink />
          <Cyl position={[0, -0.02, 0]} r={0.05} h={0.04} color={CHROME} />
          <Cyl position={[-0.12, -0.02, 0]} r={0.016} h={0.16} color={CHARCOAL} rotation={[0, 0, Math.PI / 2]} />
          {[-0.015, 0.015].map((dz) => (
            <Cyl key={dz} position={[0, -0.06, dz]} r={0.006} h={0.04} color={STEEL} />
          ))}
        </group>
      ))}
      {/* Steam wand. */}
      <group position={[-0.2, 0.36, 0.4]}>
        <Cyl position={[0, 0, 0]} r={0.02} h={0.05} color={STEEL} rotation={[Math.PI / 2, 0, 0]} />
        <Cyl position={[-0.03, -0.12, 0.03]} r={0.008} h={0.24} color={CHROME} rotation={[0.2, 0, 0.25]} />
      </group>
      {/* Drip tray with a grille, and an espresso shot waiting. */}
      <Part position={[-0.3, 0.025, 0]} size={[0.16, 0.05, 0.62]} color={CHARCOAL} />
      {[-0.24, -0.16, -0.08, 0, 0.08, 0.16, 0.24].map((z) => (
        <Part key={z} position={[-0.3, 0.052, z]} size={[0.14, 0.004, 0.012]} color={STEEL} />
      ))}
      <Cyl position={[-0.3, 0.09, -0.17]} r={0.035} rTop={0.04} h={0.07} color={WHITE} ink />
      <Cyl position={[-0.3, 0.123, -0.17]} r={0.036} h={0.004} color="#5a3620" />
      {/* Cups warming on top. */}
      {[
        [0.05, -0.22],
        [0.05, -0.08],
        [0.05, 0.06],
        [-0.08, -0.15],
        [-0.08, 0.0],
      ].map(([x, z], i) => (
        <Cyl key={i} position={[x, 0.655, z]} r={0.04} rTop={0.045} h={0.07} color={i % 2 ? TERRACOTTA : WHITE} ink />
      ))}
    </group>
  );
}

/** A grinder beside the machine: a bean-filled hopper on a dark body. */
function Grinder() {
  return (
    <group position={[5.86, 1.14, -3.72]}>
      <Part position={[0, 0.17, 0]} size={[0.16, 0.34, 0.18]} color={CHARCOAL} ink />
      <Part position={[-0.09, 0.12, 0]} size={[0.02, 0.08, 0.1]} color={STEEL} />
      <Cyl position={[0, 0.42, 0]} r={0.06} rTop={0.1} h={0.16} color="#cfe6f2" ink />
      <Cyl position={[0, 0.39, 0]} r={0.058} rTop={0.085} h={0.1} color="#4a2c1a" />
      <Cyl position={[0, 0.51, 0]} r={0.1} h={0.02} color={CHARCOAL} />
      <Cyl position={[-0.1, 0.05, 0]} r={0.03} h={0.1} color={STEEL} />
    </group>
  );
}

/** Pastry case at the near end: wood base, framed glass, cakes and treats. */
function PastryCase() {
  return (
    <group position={[5.72, 1.14, -1.45]}>
      <Part position={[0, 0.03, 0]} size={[0.56, 0.06, 0.72]} color={OAK} ink />
      {/* Pink layer cake on a stand, with a cherry. */}
      <group position={[0.05, 0.06, -0.17]}>
        <Cyl position={[0, 0.04, 0]} r={0.025} h={0.08} color={WHITE} />
        <Cyl position={[0, 0.085, 0]} r={0.13} h={0.01} color={WHITE} />
        <Cyl position={[0, 0.14, 0]} r={0.1} h={0.1} color="#f2b5c4" ink />
        <Cyl position={[0, 0.17, 0]} r={0.102} h={0.012} color="#fbf3e4" />
        <mesh position={[0, 0.205, 0]}>
          <sphereGeometry args={[0.022, 10, 8]} />
          <Toon color="#c3423f" />
        </mesh>
      </group>
      {/* Chocolate cake with a slice cut out. */}
      <mesh position={[0.05, 0.12, 0.17]}>
        <cylinderGeometry args={[0.1, 0.1, 0.11, 24, 1, false, 0.6, Math.PI * 2 - 0.6]} />
        <Toon color="#6b3e26" />
        <Ink />
      </mesh>
      <mesh position={[0.05, 0.181, 0.17]}>
        <cylinderGeometry args={[0.102, 0.102, 0.012, 24, 1, false, 0.6, Math.PI * 2 - 0.6]} />
        <Toon color="#3b2314" />
      </mesh>
      {/* A croissant and cookies on the front lip. */}
      <group position={[-0.16, 0.09, 0.08]} rotation={[0, 0.4, 0]}>
        {[-0.05, 0, 0.05].map((z, i) => (
          <mesh key={z} position={[0, i === 1 ? 0.012 : 0, z]} rotation-x={Math.PI / 2} scale={i === 1 ? 1 : 0.8}>
            <capsuleGeometry args={[0.03, 0.03, 4, 10]} />
            <Toon color="#d9a35b" />
          </mesh>
        ))}
      </group>
      {[-0.2, -0.11].map((z) => (
        <Cyl key={z} position={[-0.17, 0.07, z]} r={0.04} h={0.015} color="#c8873a" />
      ))}
      {/* Glass box with a dark frame. */}
      <mesh position={[0, 0.27, 0]}>
        <boxGeometry args={[0.52, 0.42, 0.68]} />
        <Toon color={GLASS} transparent opacity={0.18} />
      </mesh>
      {[
        [-0.26, -0.34],
        [-0.26, 0.34],
        [0.26, -0.34],
        [0.26, 0.34],
      ].map(([x, z], i) => (
        <Part key={i} position={[x, 0.27, z]} size={[0.015, 0.42, 0.015]} color={CHARCOAL} />
      ))}
      <Part position={[0, 0.485, 0]} size={[0.54, 0.015, 0.7]} color={CHARCOAL} />
    </group>
  );
}

/** A tip jar with coins and a steel lid. */
function TipJar() {
  return (
    <group position={[5.36, 1.14, -1.0]}>
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.18, 18]} />
        <Toon color={GLASS} transparent opacity={0.35} />
      </mesh>
      <Cyl position={[0, 0.03, 0]} r={0.055} h={0.05} color={BRASS} />
      <Cyl position={[0, 0.185, 0]} r={0.062} h={0.012} color={STEEL} />
    </group>
  );
}

/** Two shelves behind the bar on brackets: labelled jars with lids, and stacked cups. */
function BackShelves() {
  return (
    <group>
      {[2.0, 2.5].map((y) => (
        <group key={y}>
          <Part position={[6.75, y, -2.8]} size={[0.3, 0.04, 3.4]} color={OAK} ink />
          {[-1.3, -4.3].map((z) => (
            <Part key={z} position={[6.83, y - 0.08, z]} size={[0.12, 0.12, 0.03]} color={CHARCOAL} />
          ))}
        </group>
      ))}
      {JAR_COLORS.map((color, i) => (
        <group key={color} position={[6.75, 2.02, -1.4 - i * 0.55]}>
          <mesh position={[0, 0.11, 0]}>
            <cylinderGeometry args={[0.075, 0.075, 0.22, 18]} />
            <Toon color={GLASS} transparent opacity={0.3} />
          </mesh>
          <Cyl position={[0, 0.08, 0]} r={0.069} h={0.15} color={color} />
          <Cyl position={[0, 0.235, 0]} r={0.08} h={0.03} color={OAK_DARK} />
          <Part position={[-0.077, 0.12, 0]} size={[0.005, 0.07, 0.09]} color={WHITE} />
        </group>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <group key={i} position={[6.75, 2.52, -1.6 - i * 0.9]}>
          {[0, 1, 2].map((k) => (
            <Cyl key={k} position={[0, 0.05 + k * 0.07, 0]} r={0.065} rTop={0.08} h={0.08} color={i % 2 ? TERRACOTTA : WHITE} ink={k === 2} />
          ))}
        </group>
      ))}
    </group>
  );
}

// Counter top at y 1.1; front edge near x 5.2, facing the brew-bar camera.
export default function BrewBar() {
  const slats = useCafeTexture("cladding", 3.8, 1);
  const marble = useCafeTexture("marble", 0.6, 2.4);
  return (
    <group>
      <mesh position={[5.6, 0.55, -2.8]}>
        <boxGeometry args={[0.8, 1.1, 3.8]} />
        <Toon color={OAK_DARK} surface="wood" />
        <Ink />
      </mesh>
      {/* Wood slats on the customer side, and a dark kick plate. */}
      <mesh position={[5.195, 0.62, -2.8]} rotation-y={-Math.PI / 2}>
        <planeGeometry args={[3.8, 0.92]} />
        <Toon color={CEDAR_TINT} map={slats} />
      </mesh>
      <mesh position={[5.19, 0.08, -2.8]}>
        <boxGeometry args={[0.03, 0.16, 3.8]} />
        <Toon color={CHARCOAL} />
      </mesh>
      <mesh position={[5.6, 1.12, -2.8]}>
        <boxGeometry args={[0.9, 0.04, 3.8]} />
        <Toon color="#ffffff" map={marble} />
        <Ink />
      </mesh>
      {/* A brass foot rail along the customer side. */}
      <mesh position={[5.05, 0.22, -2.8]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.025, 0.025, 3.7, 12]} />
        <Toon color={BRASS} />
      </mesh>
      {[-1.2, -2.8, -4.4].map((z) => (
        <Part key={z} position={[5.12, 0.22, z]} size={[0.14, 0.03, 0.03]} color={BRASS} />
      ))}
      <EspressoMachine />
      <Grinder />
      <PastryCase />
      <TipJar />
      <BackShelves />
    </group>
  );
}
