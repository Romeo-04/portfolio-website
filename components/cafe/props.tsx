"use client";

// ============================================================
// CAFÉ PROPS (built-in)
// ============================================================
// Furniture and decor for the daytime café: chairs, round tables, the
// chesterfield sofa, plants, planters, railings, wall sconces and the
// marquee letter. Low-poly toon pieces in the shared palette; each takes
// a position (and a y-rotation) so the room can arrange them.
// ============================================================

import { Ink, Toon } from "@/components/cafe/kit";
import { BULB, CHARCOAL, GREEN, GREEN_DARK, OAK, TERRACOTTA, WHITE } from "@/components/cafe/palette";

type V3 = [number, number, number];

export function Chair({ position, rotation = 0 }: { position: V3; rotation?: number }) {
  const legs: [number, number][] = [
    [-0.17, -0.17],
    [0.17, -0.17],
    [-0.17, 0.17],
    [0.17, 0.17],
  ];
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.42, 0.05, 0.42]} />
        <Toon color={OAK} />
        <Ink />
      </mesh>
      {legs.map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.22, z]}>
          <boxGeometry args={[0.03, 0.45, 0.03]} />
          <Toon color={CHARCOAL} />
        </mesh>
      ))}
      <mesh position={[0, 0.72, -0.19]}>
        <boxGeometry args={[0.4, 0.42, 0.03]} />
        <Toon color={CHARCOAL} />
      </mesh>
    </group>
  );
}

export function RoundTable({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.74, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.04, 28]} />
        <Toon color={OAK} />
        <Ink />
      </mesh>
      <mesh position={[0, 0.37, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.72, 8]} />
        <Toon color={CHARCOAL} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.04, 16]} />
        <Toon color={CHARCOAL} />
      </mesh>
      {/* A cup and saucer on the table. */}
      <mesh position={[0.12, 0.8, 0.05]}>
        <cylinderGeometry args={[0.04, 0.03, 0.08, 12]} />
        <Toon color={WHITE} />
      </mesh>
    </group>
  );
}

/** Table with two or three chairs around it. */
export function TableSet({ position, chairs = 3 }: { position: V3; chairs?: 2 | 3 }) {
  const [x, y, z] = position;
  const angles = chairs === 2 ? [0, Math.PI] : [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
  return (
    <group>
      <RoundTable position={position} />
      {angles.map((a) => (
        <Chair
          key={a}
          position={[x + Math.sin(a) * 0.72, y, z + Math.cos(a) * 0.72]}
          rotation={a + Math.PI}
        />
      ))}
    </group>
  );
}

export function Sofa({ position, rotation = 0 }: { position: V3; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[2.2, 0.42, 0.85]} />
        <Toon color={TERRACOTTA} />
        <Ink />
      </mesh>
      <mesh position={[0, 0.66, -0.32]}>
        <boxGeometry args={[2.2, 0.5, 0.22]} />
        <Toon color={TERRACOTTA} />
        <Ink />
      </mesh>
      {[-1.15, 1.15].map((x) => (
        <mesh key={x} position={[x, 0.45, 0]}>
          <boxGeometry args={[0.24, 0.62, 0.85]} />
          <Toon color={TERRACOTTA} />
          <Ink />
        </mesh>
      ))}
      {/* Cushion seams. */}
      {[-0.37, 0.37].map((x) => (
        <mesh key={x} position={[x, 0.47, 0.05]}>
          <boxGeometry args={[0.02, 0.02, 0.7]} />
          <Toon color="#9c3f27" />
        </mesh>
      ))}
    </group>
  );
}

export function Plant({ position, scale = 1 }: { position: V3; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.2, 0.15, 0.4, 14]} />
        <Toon color={WHITE} />
        <Ink />
      </mesh>
      {[
        [0, 0.62, 0, 0.3],
        [0.16, 0.52, 0.08, 0.22],
        [-0.15, 0.55, -0.06, 0.22],
        [0.02, 0.85, 0.04, 0.2],
      ].map(([x, y, z, r]) => (
        <mesh key={`${x}${y}`} position={[x, y, z]}>
          <icosahedronGeometry args={[r, 0]} />
          <Toon color={x === 0 ? GREEN : GREEN_DARK} />
          <Ink />
        </mesh>
      ))}
    </group>
  );
}

/** Long box planter with bushes, like the ones by the windows. */
export function Planter({ position, length = 1.6, rotation = 0 }: { position: V3; length?: number; rotation?: number }) {
  const bushes = Math.max(2, Math.round(length / 0.45));
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[length, 0.5, 0.45]} />
        <Toon color={CHARCOAL} />
        <Ink />
      </mesh>
      {Array.from({ length: bushes }, (_, i) => (
        <mesh key={i} position={[-length / 2 + (i + 0.5) * (length / bushes), 0.62, 0]}>
          <icosahedronGeometry args={[0.28, 0]} />
          <Toon color={i % 2 ? GREEN_DARK : GREEN} />
          <Ink />
        </mesh>
      ))}
    </group>
  );
}

/** A straight black railing from a to b (posts every ~0.8 m). */
export function Railing({ from, to, y }: { from: [number, number]; to: [number, number]; y: number }) {
  const [x1, z1] = from;
  const [x2, z2] = to;
  const len = Math.hypot(x2 - x1, z2 - z1);
  const angle = Math.atan2(x2 - x1, z2 - z1);
  const posts = Math.max(2, Math.round(len / 0.8) + 1);
  return (
    <group position={[x1, y, z1]} rotation={[0, angle, 0]}>
      {Array.from({ length: posts }, (_, i) => (
        <mesh key={i} position={[0, 0.5, (i / (posts - 1)) * len]}>
          <boxGeometry args={[0.04, 1, 0.04]} />
          <Toon color={CHARCOAL} />
        </mesh>
      ))}
      {[1, 0.5].map((h) => (
        <mesh key={h} position={[0, h, len / 2]}>
          <boxGeometry args={[0.04, 0.04, len]} />
          <Toon color={CHARCOAL} />
        </mesh>
      ))}
    </group>
  );
}

/** Wall lamp: a black arm and a warm bulb that the bloom picks up. */
export function Sconce({ position, rotation = 0 }: { position: V3; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0, 0.12]}>
        <boxGeometry args={[0.04, 0.04, 0.24]} />
        <Toon color={CHARCOAL} />
      </mesh>
      <mesh position={[0, -0.06, 0.24]}>
        <sphereGeometry args={[0.07, 12, 8]} />
        <meshBasicMaterial color={BULB} toneMapped={false} />
      </mesh>
    </group>
  );
}

/**
 * A marquee letter "J" built from bars with bulbs along it, like the lit
 * letter on the brick wall in the reference. Faces +z.
 */
export function MarqueeJ({ position, rotation = 0 }: { position: V3; rotation?: number }) {
  // Segments of a block "J": top bar, stem, bottom curve (approximated).
  const bars: { p: V3; s: V3 }[] = [
    { p: [0.1, 0.95, 0], s: [0.7, 0.16, 0.1] },
    { p: [0.25, 0.4, 0], s: [0.16, 1.0, 0.1] },
    { p: [0, -0.08, 0], s: [0.5, 0.16, 0.1] },
    { p: [-0.2, 0.12, 0], s: [0.16, 0.4, 0.1] },
  ];
  const bulbs: V3[] = [
    [-0.15, 0.95, 0.07],
    [0.1, 0.95, 0.07],
    [0.35, 0.95, 0.07],
    [0.25, 0.65, 0.07],
    [0.25, 0.35, 0.07],
    [0.25, 0.05, 0.07],
    [0, -0.08, 0.07],
    [-0.2, 0.05, 0.07],
    [-0.2, 0.28, 0.07],
  ];
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {bars.map((b) => (
        <mesh key={b.p.join()} position={b.p}>
          <boxGeometry args={b.s} />
          <Toon color="#e8b04a" />
          <Ink />
        </mesh>
      ))}
      {bulbs.map((p) => (
        <mesh key={p.join()} position={p}>
          <sphereGeometry args={[0.045, 10, 8]} />
          <meshBasicMaterial color={BULB} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
