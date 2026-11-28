"use client";

// ============================================================
// THE BARISTA (Jhezra)
// ============================================================
// A stylised, game-like chibi of the site owner standing behind the brew
// bar: a white collared shirt and a terracotta apron with a name tag, built
// from primitives in the shared toon style, under a head modelled in
// Blender on the owner's photo (see barista-head.tsx). Animated in code:
// breathing, blinking, a head that follows the camera, and a wave when the
// visitor reaches the brew bar. It only asks for frames at the brew bar, so
// the on-demand canvas can rest elsewhere.
// ============================================================

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Object3D } from "three";
import { BaristaHeadModel, PrimitiveHead, SKIN } from "@/components/cafe/barista-head";
import Model from "@/components/cafe/model";
import { Ink, Toon } from "@/components/cafe/kit";
import { CHARCOAL, CREAM, TERRACOTTA, WHITE } from "@/components/cafe/palette";
import { Label } from "@/components/cafe/text3d";
import { personalInfo } from "@/data/portfolio";
import { dwellT } from "@/lib/cafe/choreo";
import { getProgress } from "@/lib/cafe/scroll";
import { requestShadowUpdate } from "@/lib/cafe/shadows";
import { stationIndexAt } from "@/lib/cafe/stations";

const PANTS = "#2f2f35";

/** Behind the counter in the gap between two cups, facing the customers (-x). */
const POSITION: [number, number, number] = [6.35, 0, -2.5];
/** The primitives are modelled small; this brings him to a believable height. */
const SCALE = 1.35;
const FACING = -Math.PI / 2;
const BREW_BAR = 2;

export default function Barista() {
  const body = useRef<Group>(null);
  const head = useRef<Group>(null);
  const eyes = useRef<(Object3D | null)[]>([]);
  const glints = useRef<(Object3D | null)[]>([]);
  const waveArm = useRef<Group>(null);

  useFrame(({ clock, camera, invalidate }) => {
    const p = getProgress();
    const time = clock.getElapsedTime();

    // Breathing.
    if (body.current) body.current.scale.y = 1 + Math.sin(time * 1.6) * 0.012;

    // Blink every few seconds.
    const blink = time % 3.6 < 0.12 ? 0.1 : 1;
    eyes.current.forEach((e) => e && (e.scale.y = blink));
    glints.current.forEach((g) => g && (g.visible = blink === 1));

    // Head turns toward the camera, within a natural range.
    if (head.current) {
      const dx = camera.position.x - POSITION[0];
      const dz = camera.position.z - POSITION[2];
      const yaw = Math.atan2(dx, dz) - FACING;
      const wrapped = Math.atan2(Math.sin(yaw), Math.cos(yaw));
      head.current.rotation.y = Math.max(-0.6, Math.min(0.6, wrapped));
      head.current.rotation.z = Math.sin(time * 0.9) * 0.04;
    }

    // Wave while the camera settles at the brew bar.
    if (waveArm.current) {
      const t = dwellT(p, "brew-bar");
      const waving = t > 0.05 && t < 0.95 ? 1 : 0;
      waveArm.current.rotation.z = 0.2 + waving * (2.3 + Math.sin(time * 9) * 0.35);
      // The wave is the one move big enough to show in his shadow.
      if (waving) requestShadowUpdate();
    }

    // Keep animating only while the visitor is at the brew bar.
    if (stationIndexAt(p) === BREW_BAR) invalidate();
  });

  return (
    <group position={POSITION} rotation={[0, FACING, 0]} scale={SCALE}>
      <group ref={body}>
        {/* Legs and shoes (mostly hidden by the counter). */}
        {[-0.09, 0.09].map((x) => (
          <group key={x}>
            <mesh position={[x, 0.36, 0]}>
              <capsuleGeometry args={[0.075, 0.5, 4, 12]} />
              <Toon color={PANTS} surface="linen" />
            </mesh>
            <mesh position={[x, 0.05, 0.04]}>
              <boxGeometry args={[0.13, 0.08, 0.24]} />
              <Toon color="#3b2a20" />
            </mesh>
          </group>
        ))}

        {/* Torso: white shirt. */}
        <mesh position={[0, 0.95, 0]}>
          <capsuleGeometry args={[0.2, 0.32, 6, 18]} />
          <Toon color={WHITE} surface="linen" />
          <Ink />
        </mesh>

        {/* Apron, straps and name tag. */}
        <mesh position={[0, 0.86, 0.17]}>
          <boxGeometry args={[0.34, 0.56, 0.04]} />
          <Toon color={TERRACOTTA} surface="linen" />
          <Ink />
        </mesh>
        {[-0.11, 0.11].map((x) => (
          <mesh key={x} position={[x, 1.2, 0.15]} rotation-z={x > 0 ? -0.25 : 0.25}>
            <boxGeometry args={[0.035, 0.22, 0.03]} />
            <Toon color={TERRACOTTA} surface="linen" />
          </mesh>
        ))}
        <mesh position={[0.07, 1.0, 0.195]}>
          <planeGeometry args={[0.13, 0.05]} />
          <Toon color={CREAM} />
        </mesh>
        <Label font="display" fontSize={0.028} color={CHARCOAL} position={[0.07, 1.0, 0.197]}>
          {personalInfo.firstName}
        </Label>

        {/* Left arm resting at the side. */}
        <group position={[-0.25, 1.15, 0]} rotation-z={-0.2}>
          <mesh position={[0, -0.2, 0]}>
            <capsuleGeometry args={[0.058, 0.3, 4, 10]} />
            <Toon color={WHITE} surface="linen" />
            <Ink />
          </mesh>
          <mesh position={[0, -0.42, 0]}>
            <sphereGeometry args={[0.06, 12, 10]} />
            <Toon color={SKIN} />
          </mesh>
        </group>
        {/* Right arm: the waving one (pivots at the shoulder). */}
        <group ref={waveArm} position={[0.25, 1.15, 0]} rotation-z={0.2}>
          <mesh position={[0, -0.2, 0]}>
            <capsuleGeometry args={[0.058, 0.3, 4, 10]} />
            <Toon color={WHITE} surface="linen" />
            <Ink />
          </mesh>
          <mesh position={[0, -0.42, 0]}>
            <sphereGeometry args={[0.06, 12, 10]} />
            <Toon color={SKIN} />
          </mesh>
        </group>

        {/* Neck. */}
        <mesh position={[0, 1.27, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 0.1, 12]} />
          <Toon color={SKIN} />
        </mesh>

        {/* Shirt collar points, peeking above the apron straps. */}
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.06, 1.24, 0.1]} rotation={[0.5, 0, side * 0.9]}>
            <boxGeometry args={[0.1, 0.05, 0.012]} />
            <Toon color={WHITE} />
          </mesh>
        ))}

        {/* Head, hair and face, from Blender; primitives while it loads. */}
        <group ref={head} position={[0, 1.5, 0]}>
          <Model name="barista-head" fallback={<PrimitiveHead eyes={eyes} glints={glints} />}>
            {(src) => <BaristaHeadModel src={src} eyes={eyes} glints={glints} />}
          </Model>
        </group>
      </group>
    </group>
  );
}
