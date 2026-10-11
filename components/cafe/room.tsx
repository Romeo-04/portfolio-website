"use client";

// ============================================================
// ROOM (built-in)
// ============================================================
// The café shell in toon blockout: wood floor, walls, ceiling, night
// windows, pendant lamps, and the roastery behind the back doorway.
// A Blender "room" model replaces all of it (see docs/cafe-models.md).
// ============================================================

import { Ink, Toon } from "@/components/cafe/kit";

const WALL = "#6b4429";
const FLOOR = "#4a2f1d";
const CEILING = "#2b1a10";
const H = 4;

function Wall({ size, position }: { size: [number, number, number]; position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <Toon color={WALL} />
      <Ink />
    </mesh>
  );
}

function Lamp({ position, light }: { position: [number, number, number]; light: boolean }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.8, 6]} />
        <meshBasicMaterial color="#1b120c" />
      </mesh>
      <mesh>
        <coneGeometry args={[0.25, 0.25, 16, 1, true]} />
        <Toon color="#c0632f" />
        <Ink />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <sphereGeometry args={[0.08, 12, 8]} />
        <meshBasicMaterial color="#ffd9a0" />
      </mesh>
      {light && <pointLight position={[0, -0.2, 0]} intensity={2} distance={6} decay={2} color="#ffb36b" />}
    </group>
  );
}

export default function Room({ lampLights }: { lampLights: boolean }) {
  return (
    <group>
      {/* Main room: x -7..7, z 0..-9.5 */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.002, -4.75]}>
        <planeGeometry args={[14, 9.5]} />
        <Toon color={FLOOR} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position={[0, H, -4.75]}>
        <planeGeometry args={[14, 9.5]} />
        <Toon color={CEILING} />
      </mesh>
      <Wall size={[0.2, H, 9.5]} position={[-7, H / 2, -4.75]} />
      <Wall size={[0.2, H, 9.5]} position={[7, H / 2, -4.75]} />
      {/* Front wall either side of the storefront facade (x ±2.7) and above it. */}
      <Wall size={[4.3, H, 0.2]} position={[-4.85, H / 2, 0]} />
      <Wall size={[4.3, H, 0.2]} position={[4.85, H / 2, 0]} />
      <Wall size={[5.4, H - 2.8, 0.2]} position={[0, 2.8 + (H - 2.8) / 2, 0]} />
      {/* Night windows on the front wall. */}
      {[-4.85, 4.85].map((x) => (
        <mesh key={x} position={[x, 2, -0.11]} rotation-y={Math.PI}>
          <planeGeometry args={[2.4, 1.4]} />
          <meshBasicMaterial color="#1d2a3a" />
        </mesh>
      ))}
      {/* Back wall with a 1.4 × 2.4 doorway to the roastery. */}
      <Wall size={[6.3, H, 0.2]} position={[-3.85, H / 2, -9.5]} />
      <Wall size={[6.3, H, 0.2]} position={[3.85, H / 2, -9.5]} />
      <Wall size={[1.4, H - 2.4, 0.2]} position={[0, 2.4 + (H - 2.4) / 2, -9.5]} />
      {/* Roastery: x -4..4, z -9.5..-14 */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.002, -11.75]}>
        <planeGeometry args={[8, 4.5]} />
        <Toon color={FLOOR} />
      </mesh>
      <Wall size={[0.2, H, 4.5]} position={[-4, H / 2, -11.75]} />
      <Wall size={[0.2, H, 4.5]} position={[4, H / 2, -11.75]} />
      <Wall size={[8, H, 0.2]} position={[0, H / 2, -14]} />
      {[
        [-3, 3.2, -2.5],
        [0, 3.2, -2.5],
        [3, 3.2, -2.5],
        [-3, 3.2, -6.5],
        [0, 3.2, -6.5],
        [3, 3.2, -6.5],
      ].map((p) => (
        <Lamp key={p.join()} position={p as [number, number, number]} light={lampLights} />
      ))}
    </group>
  );
}
