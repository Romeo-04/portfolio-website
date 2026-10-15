"use client";

// ============================================================
// THE BARISTA (Jhezra)
// ============================================================
// A stylised, game-like chibi of the site owner standing behind the brew
// bar: short black side-swept hair, a friendly face, white shirt with rolled
// sleeves, terracotta apron with a name tag. Built from primitives in the
// shared toon style so it matches the café, and animated in code:
// breathing, blinking, a head that follows the camera, and a wave when the
// visitor reaches the brew bar. It only asks for frames at the brew bar, so
// the on-demand canvas can rest elsewhere.
// ============================================================

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";
import { Ink, Toon } from "@/components/cafe/kit";
import { CHARCOAL, CREAM, TERRACOTTA, WHITE } from "@/components/cafe/palette";
import { Label } from "@/components/cafe/text3d";
import { personalInfo } from "@/data/portfolio";
import { dwellT } from "@/lib/cafe/choreo";
import { getProgress } from "@/lib/cafe/scroll";
import { requestShadowUpdate } from "@/lib/cafe/shadows";
import { stationIndexAt } from "@/lib/cafe/stations";

const SKIN = "#f1c6a2";
const HAIR = "#1d1a1a";
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
  const eyes = useRef<(Mesh | null)[]>([]);
  const waveArm = useRef<Group>(null);

  useFrame(({ clock, camera, invalidate }) => {
    const p = getProgress();
    const time = clock.getElapsedTime();

    // Breathing.
    if (body.current) body.current.scale.y = 1 + Math.sin(time * 1.6) * 0.012;

    // Blink every few seconds.
    const blink = time % 3.6 < 0.12 ? 0.1 : 1;
    eyes.current.forEach((e) => e && (e.scale.y = blink));

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

        {/* Head, hair and face. */}
        <group ref={head} position={[0, 1.5, 0]}>
          <mesh scale={[1, 1.05, 1]}>
            <sphereGeometry args={[0.22, 28, 22]} />
            <Toon color={SKIN} />
            <Ink />
          </mesh>
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * 0.215, -0.01, 0]} scale={[0.6, 1, 0.8]}>
              <sphereGeometry args={[0.05, 10, 8]} />
              <Toon color={SKIN} />
            </mesh>
          ))}
          {/* Hair cap. */}
          <mesh position={[0, 0.03, -0.02]} rotation={[-0.32, 0, -0.22]} scale={[1.06, 1, 1.06]}>
            <sphereGeometry args={[0.225, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <Toon color={HAIR} />
            <Ink />
          </mesh>
          {/* Side-swept fringe: one soft swoop across the forehead. */}
          <mesh position={[-0.05, 0.13, 0.13]} rotation={[0.45, 0, -0.35]} scale={[1.35, 0.42, 0.7]}>
            <sphereGeometry args={[0.13, 20, 14]} />
            <Toon color={HAIR} />
          </mesh>
          {/* Eyes with a glint, brows, smile and blush. */}
          {[-0.075, 0.075].map((x, i) => (
            <group key={x} position={[x, 0, 0.195]}>
              <mesh
                ref={(m) => {
                  eyes.current[i] = m;
                }}
                scale={[0.8, 1, 0.5]}
              >
                <sphereGeometry args={[0.03, 14, 12]} />
                <meshBasicMaterial color="#1b1410" />
              </mesh>
              <mesh position={[0.01, 0.012, 0.016]}>
                <sphereGeometry args={[0.008, 8, 6]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              <mesh position={[0, 0.055, 0.005]} rotation-z={x < 0 ? 0.12 : -0.12}>
                <boxGeometry args={[0.055, 0.012, 0.01]} />
                <meshBasicMaterial color={HAIR} />
              </mesh>
            </group>
          ))}
          <mesh position={[0, -0.075, 0.2]} rotation={[0.2, 0, Math.PI]}>
            <torusGeometry args={[0.035, 0.008, 6, 16, Math.PI]} />
            <meshBasicMaterial color="#6b2f22" />
          </mesh>
          {[-0.12, 0.12].map((x) => (
            <mesh key={x} position={[x, -0.05, 0.17]} scale={[1, 0.6, 0.3]}>
              <sphereGeometry args={[0.03, 10, 8]} />
              <meshBasicMaterial color="#f29a8a" transparent opacity={0.6} depthWrite={false} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
