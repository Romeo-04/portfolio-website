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

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import { Ink, Toon } from "@/components/cafe/kit";
import { CHARCOAL, CONCRETE, GLASS } from "@/components/cafe/palette";
import { Planter, Sconce } from "@/components/cafe/props";
import { plankTexture, repeated } from "@/components/cafe/textures";
import { doorAngle, dwellT } from "@/lib/cafe/choreo";
import { getProgress } from "@/lib/cafe/scroll";
import { stationProgress } from "@/lib/cafe/stations";

const FRONT_W = 14;
const GLASS_TOP = 3.0;
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
  const sign = useRef<HTMLDivElement>(null);
  const cladding = useMemo(() => repeated(plankTexture(), FRONT_W, 2.7), []);

  useFrame(() => {
    const p = getProgress();
    if (door.current) door.current.rotation.y = doorAngle(dwellT(p, "storefront"));
    // drei Html ignores walls: hide the sign once the camera is inside.
    if (sign.current) sign.current.style.visibility = stationProgress(p, "storefront") < 1 ? "visible" : "hidden";
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
          <Toon color={GLASS} transparent opacity={0.18} />
        </mesh>
      ))}
      {MULLIONS.map((x) => (
        <Bar key={x} position={[x, (BASE + GLASS_TOP) / 2, 0]} size={[0.08, GLASS_TOP - BASE, 0.12]} />
      ))}
      <Bar position={[0, GLASS_TOP, 0]} size={[FRONT_W, 0.1, 0.14]} />
      <Bar position={[0, BASE + 0.05, 0]} size={[FRONT_W, 0.1, 0.14]} />
      {/* Transom over the door. */}
      <Bar position={[0, 2.78, 0]} size={[DOOR_W, 0.06, 0.12]} />
      <mesh position={[0, 2.89, 0]}>
        <planeGeometry args={[DOOR_W, 0.16]} />
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
      <Html transform position={[0, GLASS_TOP + 0.3, 0.71]} distanceFactor={4} className="pointer-events-none">
        <div
          ref={sign}
          className="font-cafe text-6xl font-black tracking-[0.12em] whitespace-nowrap text-white"
        >
          {SIGN}
        </div>
      </Html>

      {/* Wood cladding above the awning. */}
      <mesh position={[0, GLASS_TOP + 0.55 + 1.35, 0]}>
        <boxGeometry args={[FRONT_W + 0.2, 2.7, 0.3]} />
        <Toon color="#ffffff" map={cladding} />
        <Ink />
      </mesh>

      {/* Wall lights and planters out front. */}
      <Sconce position={[-6.4, 2.55, 0.08]} />
      <Sconce position={[6.4, 2.55, 0.08]} />
      <Planter position={[-4.6, 0, 0.95]} length={2.6} />
      <Planter position={[4.6, 0, 0.95]} length={2.6} />
    </group>
  );
}
