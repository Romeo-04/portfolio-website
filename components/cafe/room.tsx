"use client";

// ============================================================
// ROOM (built-in)
// ============================================================
// The daytime café shell, after the user's reference: a light oak floor,
// cream walls, a red-brick wall, and a mezzanine over the back third with a
// black railing, tables, a rug and a glowing marquee "J". Pendant lamps,
// sconces, planters and table sets fill the ground floor. The roastery sits
// behind the back doorway. A Blender "room" model replaces all of this
// (see docs/cafe-models.md).
//
// Layout (metres): room x -7..7, z 0 (glass front) .. -9.5 (back wall,
// doorway |x| < 0.7, height 2.4), ceiling y 6. Mezzanine x -7..3,
// z -6..-9.5, floor at y 3.2; the double-height area on the right holds
// the bookshelf (specials station).
// ============================================================

import { useMemo } from "react";
import { Ink, Toon } from "@/components/cafe/kit";
import { BULB, CHARCOAL, CREAM, OAK, OAK_DARK, TERRACOTTA } from "@/components/cafe/palette";
import { MarqueeJ, Plant, Planter, Railing, Sconce, Sofa, TableSet, RoundTable } from "@/components/cafe/props";
import { brickTexture, floorTexture, plankTexture, repeated } from "@/components/cafe/textures";

/** Textured surfaces use white so the texture shows its own colours. */
const WHITE_TINT = "#ffffff";
const H = 6;
const MEZZ_Y = 3.2;

type V3 = [number, number, number];

function Wall({ size, position, color = CREAM }: { size: V3; position: V3; color?: string }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <Toon color={color} />
      <Ink />
    </mesh>
  );
}

function Lamp({ position, light }: { position: V3; light: boolean }) {
  const cord = H - position[1];
  return (
    <group position={position}>
      <mesh position={[0, cord / 2, 0]}>
        <cylinderGeometry args={[0.01, 0.01, cord, 6]} />
        <meshBasicMaterial color={CHARCOAL} />
      </mesh>
      <mesh>
        <coneGeometry args={[0.28, 0.3, 18, 1, true]} />
        <Toon color={CHARCOAL} />
        <Ink />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <sphereGeometry args={[0.08, 12, 8]} />
        <meshBasicMaterial color={BULB} toneMapped={false} />
      </mesh>
      {light && <pointLight position={[0, -0.25, 0]} intensity={1.4} distance={6} decay={2} color="#ffcf8a" />}
    </group>
  );
}

export default function Room({ lampLights }: { lampLights: boolean }) {
  const floorMap = useMemo(() => repeated(floorTexture(), 7, 4.75), []);
  const mezzMap = useMemo(() => repeated(floorTexture(), 5, 1.75), []);
  const brickUp = useMemo(() => repeated(brickTexture(), 3.5, 2.8), []);
  const sideCladding = useMemo(() => repeated(plankTexture(), 9.5, 1), []);

  return (
    <group>
      {/* ---------- Floor and ceiling ---------- */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.002, -4.75]}>
        <planeGeometry args={[14, 9.5]} />
        <Toon color={WHITE_TINT} map={floorMap} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position={[0, H, -4.75]}>
        <planeGeometry args={[14, 9.5]} />
        <Toon color={CREAM} />
      </mesh>

      {/* ---------- Walls (the glass front is the storefront) ---------- */}
      <Wall size={[0.2, H, 9.5]} position={[-7, H / 2, -4.75]} />
      <Wall size={[0.2, H, 9.5]} position={[7, H / 2, -4.75]} />
      <Wall size={[6.3, H, 0.2]} position={[-3.85, H / 2, -9.5]} />
      <Wall size={[6.3, H, 0.2]} position={[3.85, H / 2, -9.5]} />
      <Wall size={[1.4, H - 2.4, 0.2]} position={[0, 2.4 + (H - 2.4) / 2, -9.5]} />

      {/* Upstairs brick on the left wall, behind the marquee letter. */}
      <mesh position={[-6.89, MEZZ_Y + (H - MEZZ_Y) / 2, -7.75]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[3.5, H - MEZZ_Y]} />
        <Toon color="#ffffff" map={brickUp} />
      </mesh>

      {/* Exterior side cladding: charcoal below the awning line, wood above. */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 7.11, 1.5, -4.75]} rotation-y={(side * Math.PI) / 2}>
            <planeGeometry args={[9.5, 3]} />
            <Toon color={CHARCOAL} />
          </mesh>
          <mesh position={[side * 7.11, 4.6, -4.75]} rotation-y={(side * Math.PI) / 2}>
            <planeGeometry args={[9.5, 3.2]} />
            <Toon color="#ffffff" map={sideCladding} />
          </mesh>
        </group>
      ))}

      {/* ---------- Mezzanine ---------- */}
      <mesh position={[-2, MEZZ_Y - 0.1, -7.75]}>
        <boxGeometry args={[10, 0.2, 3.5]} />
        <Toon color={OAK_DARK} />
        <Ink />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[-2, MEZZ_Y + 0.002, -7.75]}>
        <planeGeometry args={[10, 3.5]} />
        <Toon color={WHITE_TINT} map={mezzMap} />
      </mesh>
      {[
        [-4, -6],
        [3, -6],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, (MEZZ_Y - 0.2) / 2, z]}>
          <boxGeometry args={[0.16, MEZZ_Y - 0.2, 0.16]} />
          <Toon color={CHARCOAL} />
        </mesh>
      ))}
      <Railing from={[-6.9, -6]} to={[3, -6]} y={MEZZ_Y} />
      <Railing from={[3, -6]} to={[3, -9.4]} y={MEZZ_Y} />

      {/* Upstairs: rug, tables, plant, marquee letter. */}
      <mesh rotation-x={-Math.PI / 2} position={[-3, MEZZ_Y + 0.01, -7.9]}>
        <planeGeometry args={[3, 2]} />
        <Toon color={TERRACOTTA} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[-3, MEZZ_Y + 0.012, -7.9]}>
        <planeGeometry args={[2.6, 1.6]} />
        <Toon color="#f0b27a" />
      </mesh>
      <TableSet position={[-5.2, MEZZ_Y, -7.4]} />
      <TableSet position={[-1.6, MEZZ_Y, -8.3]} chairs={2} />
      <TableSet position={[1.4, MEZZ_Y, -7.6]} chairs={2} />
      <Plant position={[2.3, MEZZ_Y, -9.0]} />
      <MarqueeJ position={[-6.82, 4.3, -7.8]} rotation={Math.PI / 2} />

      {/* ---------- Ground floor ---------- */}
      <TableSet position={[-4.6, 0, -1.4]} />
      <TableSet position={[2.2, 0, -1.0]} chairs={2} />
      <TableSet position={[-5.4, 0, -7.4]} chairs={2} />
      <Sofa position={[1.4, 0, -5.9]} />
      <RoundTable position={[1.6, 0, -4.7]} />
      <Planter position={[-4.6, 0, -0.45]} length={2.4} />
      <Planter position={[3.6, 0, -0.45]} length={1.6} />
      <Plant position={[-6.3, 0, -0.7]} scale={1.2} />
      <Plant position={[-6.3, 0, -8.9]} scale={1.1} />
      <Sconce position={[-6.68, 3.05, -1.2]} rotation={Math.PI / 2} />
      <Sconce position={[-6.68, 3.05, -4.8]} rotation={Math.PI / 2} />

      {[
        [-3, 4.4, -2.4],
        [3, 4.4, -2.4],
        [-0.4, 4.4, -4.3],
      ].map((p) => (
        <Lamp key={p.join()} position={p as V3} light={lampLights} />
      ))}

      {/* ---------- Roastery: x -4..4, z -9.5..-14 ---------- */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.002, -11.75]}>
        <planeGeometry args={[8, 4.5]} />
        <Toon color={OAK} />
      </mesh>
      <Wall size={[0.2, 4, 4.5]} position={[-4, 2, -11.75]} />
      <Wall size={[0.2, 4, 4.5]} position={[4, 2, -11.75]} />
      <Wall size={[8, 4, 0.2]} position={[0, 2, -14]} />
      <mesh rotation-x={Math.PI / 2} position={[0, 4, -11.75]}>
        <planeGeometry args={[8, 4.5]} />
        <Toon color={CREAM} />
      </mesh>
    </group>
  );
}
