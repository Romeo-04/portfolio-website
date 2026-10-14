"use client";

// ============================================================
// CAFÉ PROPS (built-in)
// ============================================================
// Furniture and decor for the daytime café: chairs, round tables, the
// chesterfield sofa, plants, planters, railings, wall sconces, framed art
// prints and the marquee letter. Low-poly toon pieces in the shared palette; each takes
// a position (and a y-rotation) so the room can arrange them.
// ============================================================

import { Ink, Toon } from "@/components/cafe/kit";
import { RoundedBox } from "@react-three/drei";
import { BRASS, BULB, CHARCOAL, CREAM, GREEN, GREEN_DARK, OAK, OAK_DARK, TERRACOTTA, WHITE } from "@/components/cafe/palette";
import { useCafeTexture, type TextureName } from "@/components/cafe/textures";

type V3 = [number, number, number];

/** Bentwood bistro chair: round seat, splayed legs, a footring and a curved spindle back. Back faces -z. */
export function Chair({ position, rotation = 0 }: { position: V3; rotation?: number }) {
  const legs = [0.25, 0.75, 1.25, 1.75].map((k) => k * Math.PI);
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.46, 0]}>
        <cylinderGeometry args={[0.21, 0.2, 0.05, 24]} />
        <Toon color={OAK} />
        <Ink />
      </mesh>
      <mesh position={[0, 0.495, 0]}>
        <cylinderGeometry args={[0.18, 0.19, 0.025, 24]} />
        <Toon color={TERRACOTTA} />
      </mesh>
      {legs.map((a) => (
        <mesh key={a} position={[Math.sin(a) * 0.14, 0.22, Math.cos(a) * 0.14]} rotation={[Math.cos(a) * 0.12, 0, -Math.sin(a) * 0.12]}>
          <cylinderGeometry args={[0.017, 0.013, 0.46, 8]} />
          <Toon color={CHARCOAL} />
        </mesh>
      ))}
      <mesh position={[0, 0.17, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.15, 0.01, 6, 24]} />
        <Toon color={CHARCOAL} />
      </mesh>
      {/* Curved back rail on two posts, with spindles. */}
      {[-0.14, 0.14].map((x) => (
        <mesh key={x} position={[x, 0.68, -0.15]} rotation-x={-0.12}>
          <cylinderGeometry args={[0.016, 0.016, 0.44, 8]} />
          <Toon color={CHARCOAL} />
        </mesh>
      ))}
      {[-0.06, 0, 0.06].map((x) => (
        <mesh key={x} position={[x, 0.66, -0.16]} rotation-x={-0.12}>
          <cylinderGeometry args={[0.008, 0.008, 0.36, 6]} />
          <Toon color={CHARCOAL} />
        </mesh>
      ))}
      <mesh position={[0, 0.88, -0.05]} rotation={[Math.PI / 2, 0, Math.PI]}>
        <torusGeometry args={[0.17, 0.022, 8, 20, Math.PI]} />
        <Toon color={OAK_DARK} />
        <Ink />
      </mesh>
    </group>
  );
}

/** Round café table on a pedestal with a cross base, laid with a cup and a bud vase. */
export function RoundTable({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.745, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.035, 32]} />
        <Toon color={OAK} />
        <Ink />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.43, 0.4, 0.02, 32]} />
        <Toon color={OAK_DARK} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.035, 0.05, 0.68, 12]} />
        <Toon color={CHARCOAL} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.12, 0.05, 0.03, 12]} />
        <Toon color={CHARCOAL} />
      </mesh>
      {[0, Math.PI / 2].map((a) => (
        <mesh key={a} position={[0, 0.025, 0]} rotation-y={a}>
          <boxGeometry args={[0.56, 0.04, 0.06]} />
          <Toon color={CHARCOAL} />
        </mesh>
      ))}
      {/* Cup on a saucer, with coffee. */}
      <group position={[0.14, 0.765, 0.06]}>
        <mesh position={[0, 0.005, 0]}>
          <cylinderGeometry args={[0.075, 0.065, 0.01, 18]} />
          <Toon color={WHITE} />
        </mesh>
        <mesh position={[0, 0.045, 0]}>
          <cylinderGeometry args={[0.045, 0.035, 0.07, 16]} />
          <Toon color={WHITE} />
          <Ink />
        </mesh>
        <mesh position={[0, 0.078, 0]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.04, 16]} />
          <Toon color="#7a4a2e" />
        </mesh>
        <mesh position={[0.05, 0.048, 0]}>
          <torusGeometry args={[0.02, 0.006, 6, 12]} />
          <Toon color={WHITE} />
        </mesh>
      </group>
      {/* Bud vase with a flower. */}
      <group position={[-0.12, 0.765, -0.1]}>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.02, 0.035, 0.12, 12]} />
          <Toon color="#cfe6f2" />
        </mesh>
        <mesh position={[0, 0.17, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.14, 4]} />
          <Toon color={GREEN_DARK} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.03, 10, 8]} />
          <Toon color="#e4572e" />
        </mesh>
      </group>
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
        <Chair key={a} position={[x + Math.sin(a) * 0.72, y, z + Math.cos(a) * 0.72]} rotation={a + Math.PI} />
      ))}
    </group>
  );
}

/** A tufted chesterfield: rolled arms, buttoned back, three seat cushions, pillows and wooden feet. */
export function Sofa({ position, rotation = 0 }: { position: V3; rotation?: number }) {
  const LEATHER = TERRACOTTA;
  const SEAM = "#9c3f27";
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Base and feet. */}
      <RoundedBox args={[2.2, 0.3, 0.85]} radius={0.05} smoothness={2} position={[0, 0.24, 0]}>
        <Toon color={LEATHER} />
        <Ink />
      </RoundedBox>
      {[
        [-1.0, 0.36],
        [1.0, 0.36],
        [-1.0, -0.36],
        [1.0, -0.36],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.05, z]}>
          <cylinderGeometry args={[0.04, 0.03, 0.1, 10]} />
          <Toon color="#5a3620" />
        </mesh>
      ))}
      {/* Seat cushions. */}
      {[-0.68, 0, 0.68].map((x) => (
        <RoundedBox key={x} args={[0.66, 0.14, 0.66]} radius={0.05} smoothness={2} position={[x, 0.45, 0.06]}>
          <Toon color={LEATHER} />
          <Ink />
        </RoundedBox>
      ))}
      {/* Buttoned back. */}
      <RoundedBox args={[2.2, 0.52, 0.22]} radius={0.07} smoothness={2} position={[0, 0.66, -0.32]}>
        <Toon color={LEATHER} />
        <Ink />
      </RoundedBox>
      {[-0.8, -0.4, 0, 0.4, 0.8].flatMap((x) =>
        [0.58, 0.76].map((y, k) => (
          <mesh key={`${x}${y}`} position={[x + (k ? 0.2 : 0), y, -0.205]}>
            <sphereGeometry args={[0.018, 8, 6]} />
            <Toon color={SEAM} />
          </mesh>
        )),
      )}
      {/* Rolled arms. */}
      {[-1.1, 1.1].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <RoundedBox args={[0.24, 0.5, 0.85]} radius={0.06} smoothness={2} position={[0, 0.4, 0]}>
            <Toon color={LEATHER} />
            <Ink />
          </RoundedBox>
          <mesh position={[0, 0.66, 0]} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.14, 0.14, 0.85, 16]} />
            <Toon color={LEATHER} />
            <Ink />
          </mesh>
        </group>
      ))}
      {/* Throw pillows. */}
      {(
        [
          [-0.75, "#f0c987", 0.3],
          [0.78, "#fbf3e4", -0.25],
        ] as const
      ).map(([x, color, tilt]) => (
        <RoundedBox key={x} args={[0.36, 0.34, 0.12]} radius={0.05} smoothness={2} position={[x, 0.66, -0.12]} rotation={[-0.25, 0, tilt]}>
          <Toon color={color} />
          <Ink />
        </RoundedBox>
      ))}
    </group>
  );
}

/** One long leaf on a short stem, tilted out from the centre. */
function Leaf({ angle, tilt, length, color, y }: { angle: number; tilt: number; length: number; color: string; y: number }) {
  return (
    <group position={[0, y, 0]} rotation={[0, angle, 0]}>
      <group rotation-x={tilt}>
        <mesh position={[0, length * 0.45, 0]}>
          <cylinderGeometry args={[0.008, 0.01, length * 0.9, 5]} />
          <Toon color={GREEN_DARK} />
        </mesh>
        <mesh position={[0, length * 0.95, 0]} scale={[0.5, 1, 0.12]}>
          <sphereGeometry args={[length * 0.42, 12, 8]} />
          <Toon color={color} />
          <Ink />
        </mesh>
      </group>
    </group>
  );
}

/** A potted plant: a white pot with a rim and soil, and a spray of leaves. */
export function Plant({ position, scale = 1 }: { position: V3; scale?: number }) {
  const leaves = Array.from({ length: 9 }, (_, i) => ({
    angle: (i / 9) * Math.PI * 2 + (i % 2) * 0.3,
    tilt: 0.35 + (i % 3) * 0.18,
    length: 0.34 + ((i * 7) % 5) * 0.04,
    color: i % 2 ? GREEN : GREEN_DARK,
  }));
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.2, 0.15, 0.4, 18]} />
        <Toon color={WHITE} />
        <Ink />
      </mesh>
      <mesh position={[0, 0.39, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.05, 18]} />
        <Toon color={WHITE} />
      </mesh>
      <mesh position={[0, 0.405, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 0.02, 18]} />
        <Toon color="#4a2c1a" />
      </mesh>
      {leaves.map((l, i) => (
        <Leaf key={i} {...l} y={0.4} />
      ))}
      <Leaf angle={0.4} tilt={0.05} length={0.5} color={GREEN} y={0.4} />
    </group>
  );
}

/** Long box planter with an oak cap, round bushes and a scatter of flowers. */
export function Planter({ position, length = 1.6, rotation = 0 }: { position: V3; length?: number; rotation?: number }) {
  const bushes = Math.max(2, Math.round(length / 0.4));
  const flowers = ["#f3a712", "#e4572e", "#fbf3e4"];
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[length, 0.5, 0.45]} />
        <Toon color={CHARCOAL} />
        <Ink />
      </mesh>
      <mesh position={[0, 0.51, 0]}>
        <boxGeometry args={[length + 0.06, 0.04, 0.51]} />
        <Toon color={OAK} />
      </mesh>
      {Array.from({ length: bushes }, (_, i) => {
        const x = -length / 2 + (i + 0.5) * (length / bushes);
        return (
          <group key={i} position={[x, 0.6, 0]}>
            <mesh>
              <icosahedronGeometry args={[0.24, 1]} />
              <Toon color={i % 2 ? GREEN_DARK : GREEN} />
              <Ink />
            </mesh>
            <mesh position={[0.08, 0.1, 0.06]}>
              <icosahedronGeometry args={[0.15, 1]} />
              <Toon color={i % 2 ? GREEN : GREEN_DARK} />
            </mesh>
            <mesh position={[-0.06, 0.16, 0.16]}>
              <sphereGeometry args={[0.035, 8, 6]} />
              <Toon color={flowers[i % flowers.length]} />
            </mesh>
          </group>
        );
      })}
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
      <mesh position={[0, 0, 0.01]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
        <Toon color={BRASS} />
      </mesh>
      <mesh position={[0, 0.02, 0.13]}>
        <boxGeometry args={[0.03, 0.03, 0.24]} />
        <Toon color={CHARCOAL} />
      </mesh>
      <mesh position={[0, -0.02, 0.24]}>
        <cylinderGeometry args={[0.03, 0.03, 0.05, 12]} />
        <Toon color={BRASS} />
      </mesh>
      <mesh position={[0, -0.1, 0.24]}>
        <sphereGeometry args={[0.055, 12, 8]} />
        <meshBasicMaterial color={BULB} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.1, 0.24]}>
        <sphereGeometry args={[0.09, 16, 12]} />
        <meshBasicMaterial color="#fff6e0" transparent opacity={0.28} depthWrite={false} />
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

/** A square painted print in a thin oak frame with a cream mat; faces +z. */
export function ArtPrint({
  art,
  position,
  rotation = 0,
  size = 0.9,
}: {
  art: Extract<TextureName, `art-${string}`>;
  position: V3;
  rotation?: number;
  size?: number;
}) {
  const map = useCafeTexture(art);
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh>
        <boxGeometry args={[size + 0.1, size + 0.1, 0.04]} />
        <Toon color={OAK} />
        <Ink />
      </mesh>
      <mesh position={[0, 0, 0.021]}>
        <planeGeometry args={[size, size]} />
        <Toon color={CREAM} />
      </mesh>
      <mesh position={[0, 0, 0.023]}>
        <planeGeometry args={[size * 0.84, size * 0.84]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>
    </group>
  );
}
