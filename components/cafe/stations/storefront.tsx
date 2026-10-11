"use client";

// ============================================================
// STATION 1: STOREFRONT
// ============================================================
// A rainy night street. The door swings inward while the camera holds at
// the storefront, and warm light shows through. Rain falls in real time;
// with reduced motion it stays still.
// ============================================================

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { BufferAttribute, Group, Mesh } from "three";
import { Ink, Toon } from "@/components/cafe/kit";
import { personalInfo } from "@/data/portfolio";
import { doorAngle, dwellT } from "@/lib/cafe/choreo";
import { getProgress } from "@/lib/cafe/scroll";
import { stationProgress } from "@/lib/cafe/stations";

const RAIN_COUNT = 400;
const RAIN_TOP = 8;

function Rain({ reduced }: { reduced: boolean }) {
  const positions = useMemo(() => {
    const p = new Float32Array(RAIN_COUNT * 3);
    // Seeded so the memo stays pure (react-hooks/purity forbids Math.random).
    let seed = 1;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    rand(); // warm-up: the first draw of a seed this small is near zero
    for (let i = 0; i < RAIN_COUNT; i++) {
      p[i * 3] = (rand() - 0.5) * 12;
      p[i * 3 + 1] = rand() * RAIN_TOP;
      p[i * 3 + 2] = 1 + rand() * 9;
    }
    return p;
  }, []);
  const attr = useRef<BufferAttribute>(null);

  useFrame((_, delta) => {
    if (reduced || !attr.current) return;
    const arr = attr.current.array as Float32Array;
    for (let i = 0; i < RAIN_COUNT; i++) {
      const y = arr[i * 3 + 1] - delta * 6;
      arr[i * 3 + 1] = y < 0 ? RAIN_TOP : y;
    }
    attr.current.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute ref={attr} attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#9fb4c7" size={0.04} transparent opacity={0.6} />
    </points>
  );
}

export default function Storefront({ reduced }: { reduced: boolean }) {
  const door = useRef<Group>(null);
  const warm = useRef<Mesh>(null);

  useFrame(() => {
    const p = getProgress();
    if (door.current) door.current.rotation.y = doorAngle(dwellT(p, "storefront"));
    // Hide the glow plane once the camera is indoors so it can't block the view.
    if (warm.current) warm.current.visible = stationProgress(p, "storefront") < 1;
  });

  return (
    <group>
      {/* Facade: two walls and a lintel around a 1 × 2.2 doorway. */}
      <mesh position={[-1.6, 1.4, 0]}>
        <boxGeometry args={[2.2, 2.8, 0.3]} />
        <Toon color="#5a3620" />
        <Ink />
      </mesh>
      <mesh position={[1.6, 1.4, 0]}>
        <boxGeometry args={[2.2, 2.8, 0.3]} />
        <Toon color="#5a3620" />
        <Ink />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[1, 0.6, 0.3]} />
        <Toon color="#5a3620" />
        <Ink />
      </mesh>
      {/* Warm light behind the door. */}
      <mesh ref={warm} position={[0, 1.1, -1.2]}>
        <planeGeometry args={[1, 2.2]} />
        <meshBasicMaterial color="#ffb36b" />
      </mesh>
      {/* Door, hinged on its left edge; positive rotation swings it inward. */}
      <group ref={door} position={[-0.5, 0, 0.05]}>
        <mesh position={[0.5, 1.1, 0]}>
          <boxGeometry args={[1, 2.2, 0.08]} />
          <Toon color="#3d5a40" />
          <Ink />
        </mesh>
      </group>
      <Html transform position={[0, 3.3, 0.2]} distanceFactor={4} className="font-chalk pointer-events-none text-5xl whitespace-nowrap text-[#ffb36b]">
        {personalInfo.firstName}&apos;s Café
      </Html>
      <Rain reduced={reduced} />
    </group>
  );
}
