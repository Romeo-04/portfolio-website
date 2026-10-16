"use client";

// ============================================================
// REGULARS
// ============================================================
// The testimonials, as people: each one stands on the sidewalk outside the
// café holding a coffee, with a quote bubble bobbing over their head.
// Clicking a person (or their bubble) opens their testimonial card, which
// grows out of the spot that was clicked.
// ============================================================

import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useCallback, useRef, useState } from "react";
import type { Group } from "three";
import { Blob, Person, type LimbRig, type Limbs } from "@/components/cafe/city-life";
import { Ink, Toon } from "@/components/cafe/kit";
import { Label } from "@/components/cafe/text3d";
import { testimonialsData, type Testimonial } from "@/data/portfolio";
import { openTestimonial } from "@/lib/cafe/testimonial-sheet";

/** Spots on the sidewalk near the curb, clear of the door, bench and planters. */
const SPOTS: { x: number; z: number; yaw: number }[] = [
  { x: -2.9, z: 3.05, yaw: 0.35 },
  { x: -1.75, z: 3.15, yaw: -0.25 },
  { x: 3.1, z: 3.1, yaw: -0.3 },
  { x: 4.2, z: 2.95, yaw: 0.2 },
];

function Regular({ t, index, still }: { t: Testimonial; index: number; still: boolean }) {
  const spot = SPOTS[index % SPOTS.length];
  const limbs = useRef<Limbs>({ legL: null, legR: null, armL: null, armR: null, body: null });
  const bubble = useRef<Group>(null);
  const [hover, setHover] = useState(false);
  const rig = useCallback<LimbRig>((key, g) => {
    limbs.current[key] = g;
  }, []);

  // Runs on the frames CityLife already draws while the street is in view.
  useFrame(({ clock }) => {
    const l = limbs.current;
    const t0 = still ? 0 : clock.getElapsedTime() + index * 1.7;
    // Coffee held up in front; the other hand on the hip now and then.
    if (l.armR) l.armR.rotation.x = -0.95 - Math.max(0, Math.sin(t0 * 0.6)) ** 6 * 0.7;
    if (l.armL) l.armL.rotation.z = -0.12 - Math.sin(t0 * 0.9) * 0.05;
    if (l.body) l.body.position.y = Math.sin(t0 * 1.6) * 0.008;
    if (bubble.current) {
      bubble.current.position.y = 2.45 + Math.sin(t0 * 1.8) * 0.05;
      const s = hover ? 1.15 : 1;
      bubble.current.scale.setScalar(bubble.current.scale.x + (s - bubble.current.scale.x) * 0.2);
    }
  });

  return (
    <group
      position={[spot.x, 0, spot.z]}
      rotation-y={spot.yaw}
      onClick={(e) => {
        e.stopPropagation();
        openTestimonial(index, { x: e.nativeEvent.clientX - 40, y: e.nativeEvent.clientY - 40, w: 80, h: 80 });
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "";
      }}
    >
      <Blob />
      <Person look={{ ...t.look, coffee: true }} rig={rig} />
      {/* Quote bubble with a tail pointing at them. */}
      <group ref={bubble} position={[0, 2.45, 0]} rotation-y={-spot.yaw}>
        <RoundedBox args={[0.72, 0.46, 0.08]} radius={0.12} smoothness={3}>
          <Toon color={hover ? "#fff3df" : "#fbf3e4"} />
          <Ink />
        </RoundedBox>
        <mesh position={[0, -0.28, 0]} rotation-z={Math.PI}>
          <coneGeometry args={[0.09, 0.14, 3]} />
          <Toon color="#fbf3e4" />
        </mesh>
        <Label font="display" fontSize={0.42} color="#d0603f" position={[0, -0.09, 0.045]}>
          {"“”"}
        </Label>
      </group>
    </group>
  );
}

export default function Regulars({ still }: { still: boolean }) {
  return (
    <group userData={{ noShadow: true }}>
      {testimonialsData.slice(0, SPOTS.length).map((t, i) => (
        <Regular key={`${t.name}-${i}`} t={t} index={i} still={still} />
      ))}
    </group>
  );
}
