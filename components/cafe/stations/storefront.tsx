"use client";

// ============================================================
// STATION 1: STOREFRONT
// ============================================================
// A sunny street and a modern shop front, after the user's reference:
// black-framed floor-to-ceiling glass across the whole 14 m front, a glass
// door in the middle with a tall handle, a black awning band carrying the
// sign, wood cladding above, a concrete plinth, wall lights and planters.
// The lit café shows through the glass. The door swings inward while the
// camera holds at the storefront.
// ============================================================

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { Ink, Toon } from "@/components/cafe/kit";
import { Label } from "@/components/cafe/text3d";
import { CEDAR_TINT, CHARCOAL, CONCRETE, GLASS, OAK } from "@/components/cafe/palette";
import { Planter, Sconce } from "@/components/cafe/props";
import { useCafeTexture } from "@/components/cafe/textures";
import { doorAngle, dwellT } from "@/lib/cafe/choreo";
import { getProgress } from "@/lib/cafe/scroll";

const FRONT_W = 14;
const GLASS_TOP = 3.4;
const ROOF = 6.2;
const BASE = 0.15;
const DOOR_W = 1.0;
const SIGN = "JHEZRA'S CAFÉ";

/** Mullion x positions; the door opening sits between -0.5 and 0.5. */
const MULLIONS = [-7, -5.6, -4.2, -2.8, -1.4, -0.5, 0.5, 1.4, 2.8, 4.2, 5.6, 7];

function Bar({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <Toon color={CHARCOAL} />
    </mesh>
  );
}

export default function Storefront() {
  const door = useRef<Group>(null);
  const claddingH = ROOF - (GLASS_TOP + 0.55);
  const cladding = useCafeTexture("cladding", FRONT_W, claddingH);

  useFrame(() => {
    const p = getProgress();
    if (door.current) door.current.rotation.y = doorAngle(dwellT(p, "storefront"));
  });

  const panes: [number, number][] = [];
  for (let i = 0; i < MULLIONS.length - 1; i++) {
    const a = MULLIONS[i];
    const b = MULLIONS[i + 1];
    if (a === -0.5) continue; // the door opening
    panes.push([a, b]);
  }

  return (
    <group>
      {/* Concrete plinth. */}
      <mesh position={[0, BASE / 2, 0.15]}>
        <boxGeometry args={[FRONT_W + 0.4, BASE, 0.6]} />
        <Toon color={CONCRETE} />
        <Ink />
      </mesh>

      {/* Glass panes and their black frame. */}
      {panes.map(([a, b]) => (
        <mesh key={a} position={[(a + b) / 2, (BASE + GLASS_TOP) / 2, 0]}>
          <planeGeometry args={[b - a, GLASS_TOP - BASE]} />
          <Toon color={GLASS} transparent opacity={0.16} />
        </mesh>
      ))}
      {/* Soft diagonal sheen on alternate panes, so the glass reads as glass. */}
      {panes
        .filter((_, i) => i % 2 === 0)
        .map(([a, b]) => (
          <mesh key={`sheen${a}`} position={[(a + b) / 2, GLASS_TOP * 0.6, 0.01]} rotation-z={0.55}>
            <planeGeometry args={[0.22, GLASS_TOP * 0.9]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.14} depthWrite={false} />
          </mesh>
        ))}
      {MULLIONS.map((x) => (
        <Bar key={x} position={[x, (BASE + GLASS_TOP) / 2, 0]} size={[0.08, GLASS_TOP - BASE, 0.12]} />
      ))}
      <Bar position={[0, GLASS_TOP, 0]} size={[FRONT_W, 0.1, 0.14]} />
      <Bar position={[0, BASE + 0.05, 0]} size={[FRONT_W, 0.1, 0.14]} />
      {/* Transom over the door. */}
      <Bar position={[0, 2.78, 0]} size={[DOOR_W, 0.06, 0.12]} />
      <mesh position={[0, (2.81 + GLASS_TOP) / 2, 0]}>
        <planeGeometry args={[DOOR_W, GLASS_TOP - 2.81]} />
        <Toon color={GLASS} transparent opacity={0.18} />
      </mesh>

      {/* Door: glass in a black frame with a tall handle, hinged on its left
          edge; positive rotation swings it inward. */}
      <group ref={door} position={[-DOOR_W / 2, 0, 0.02]}>
        <group position={[DOOR_W / 2, 0, 0]}>
          <mesh position={[0, 1.45, 0]}>
            <planeGeometry args={[DOOR_W - 0.1, 2.5]} />
            <Toon color={GLASS} transparent opacity={0.22} />
          </mesh>
          <Bar position={[-DOOR_W / 2 + 0.03, 1.45, 0]} size={[0.06, 2.6, 0.06]} />
          <Bar position={[DOOR_W / 2 - 0.03, 1.45, 0]} size={[0.06, 2.6, 0.06]} />
          <Bar position={[0, 2.72, 0]} size={[DOOR_W, 0.06, 0.06]} />
          <Bar position={[0, 0.18, 0]} size={[DOOR_W, 0.08, 0.06]} />
          {/* Tall bar handle on both faces. */}
          <Bar position={[0.32, 1.3, 0.07]} size={[0.03, 1.1, 0.03]} />
          <Bar position={[0.32, 1.3, -0.07]} size={[0.03, 1.1, 0.03]} />
        </group>
      </group>

      {/* Awning band with the sign. */}
      <mesh position={[0, GLASS_TOP + 0.3, 0.3]}>
        <boxGeometry args={[FRONT_W + 0.6, 0.5, 0.8]} />
        <Toon color={CHARCOAL} />
        <Ink />
      </mesh>
      {/* The sign: chunky display letters with a soft drop shadow. */}
      <Label font="display" fontSize={0.4} letterSpacing={0.06} color="#1a1a1c" position={[0.025, GLASS_TOP + 0.275, 0.705]}>
        {SIGN}
      </Label>
      <Label font="display" fontSize={0.4} letterSpacing={0.06} color="#fff8ec" position={[0, GLASS_TOP + 0.3, 0.71]}>
        {SIGN}
      </Label>

      {/* Wood cladding above the awning. */}
      <mesh position={[0, GLASS_TOP + 0.55 + claddingH / 2, 0]}>
        <boxGeometry args={[FRONT_W + 0.2, claddingH, 0.3]} />
        <Toon color={CEDAR_TINT} map={cladding} />
        <Ink />
      </mesh>

      {/* Wall lights and planters out front. */}
      <Sconce position={[-6.4, 2.55, 0.08]} />
      <Sconce position={[6.4, 2.55, 0.08]} />
      <Planter position={[-4.6, 0, 0.95]} length={2.6} />
      {/* Doormat and a bench out front. */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.006, 0.6]}>
        <planeGeometry args={[1.3, 0.6]} />
        <Toon color={CHARCOAL} />
      </mesh>
      <group position={[2.4, 0, 1.0]}>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[1.4, 0.06, 0.4]} />
          <Toon color={OAK} />
          <Ink />
        </mesh>
        {[-0.6, 0.6].map((x) => (
          <mesh key={x} position={[x, 0.22, 0]}>
            <boxGeometry args={[0.06, 0.44, 0.36]} />
            <Toon color={CHARCOAL} />
          </mesh>
        ))}
      </group>
      <Planter position={[4.6, 0, 0.95]} length={2.6} />
    </group>
  );
}
