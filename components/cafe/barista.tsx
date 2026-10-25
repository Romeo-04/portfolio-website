"use client";

// ============================================================
// THE BARISTA (Jhezra)
// ============================================================
// A stylised, game-like chibi of the site owner standing behind the brew
// bar, modelled on the owner's photo: full wavy black hair with a middle part,
// fair skin, almond eyes and an open smile, a white collared shirt and a
// terracotta apron with a name tag. Built from primitives in the
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

const SKIN = "#f6d5bc";
const HAIR = "#17141a";
const PANTS = "#2f2f35";
/** Almond eyes: wider than tall. Blinking scales this down. */
const EYE_HEIGHT = 0.62;
/** [x, y, z, radius] bumps that give the hair its fluffy, wavy volume. */
const HAIR_TUFTS: [number, number, number, number][] = [
  [-0.09, 0.2, 0.05, 0.1],
  [0.08, 0.21, 0.03, 0.1],
  [0, 0.22, -0.07, 0.11],
  [-0.17, 0.08, 0.02, 0.09],
  [0.17, 0.08, 0.02, 0.09],
  [-0.15, 0.13, -0.1, 0.1],
  [0.15, 0.13, -0.1, 0.1],
];
/** [x, tilt, length] for the locks on one side of a middle part; the other
 *  side mirrors them, so the fringe opens like curtains from the centre. */
const FRINGE_SIDE: [number, number, number][] = [
  [0.06, 0.7, 1.3],
  [0.11, 0.5, 1.15],
  [0.15, 0.32, 1.0],
  [0.18, 0.18, 0.85],
];
const FRINGE = [-1, 1].flatMap((side) =>
  FRINGE_SIDE.map(([x, tilt, length]) => [side * x, side * tilt, length] as const),
);

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
    eyes.current.forEach((e) => e && (e.scale.y = EYE_HEIGHT * blink));

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

        {/* Head, hair and face: a soft oval face under full, wavy black hair. */}
        <group ref={head} position={[0, 1.5, 0]}>
          <mesh scale={[0.96, 1.08, 1]}>
            <sphereGeometry args={[0.22, 28, 22]} />
            <Toon color={SKIN} />
            <Ink />
          </mesh>
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * 0.205, -0.02, 0]} scale={[0.6, 1, 0.8]}>
              <sphereGeometry args={[0.05, 10, 8]} />
              <Toon color={SKIN} />
            </mesh>
          ))}
          {/* Hair cap, tilted back so the hairline sits high and the part shows. */}
          <mesh position={[0, 0.04, -0.02]} rotation={[-0.6, 0, 0]} scale={[1.1, 1.08, 1.1]}>
            <sphereGeometry args={[0.225, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.56]} />
            <Toon color={HAIR} />
            <Ink />
          </mesh>
          {/* Volume: soft waves on the crown and over the ears. */}
          {HAIR_TUFTS.map(([x, y, z, r], i) => (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[r, 14, 10]} />
              <Toon color={HAIR} />
            </mesh>
          ))}
          {/* Fringe: wavy locks parted in the middle, falling to the brows. */}
          {FRINGE.map(([x, tilt, length], i) => (
            <mesh key={i} position={[x, 0.11, 0.205 - Math.abs(x) * 0.4]} rotation={[-0.4, x * 1.6, tilt]} scale={[0.4, length, 0.3]}>
              <sphereGeometry args={[0.075, 12, 10]} />
              <Toon color={HAIR} />
            </mesh>
          ))}
          {/* Almond eyes with a glint, straight brows, open smile and blush. */}
          {[-0.072, 0.072].map((x, i) => (
            <group key={x} position={[x, 0.005, 0.198]}>
              <mesh
                ref={(m) => {
                  eyes.current[i] = m;
                }}
                scale={[1.05, EYE_HEIGHT, 0.45]}
              >
                <sphereGeometry args={[0.028, 14, 12]} />
                <meshBasicMaterial color="#1b1410" />
              </mesh>
              <mesh position={[0.009, 0.007, 0.014]}>
                <sphereGeometry args={[0.006, 8, 6]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              <mesh position={[0, 0.045, 0.006]} rotation-z={x < 0 ? 0.08 : -0.08}>
                <boxGeometry args={[0.058, 0.009, 0.01]} />
                <meshBasicMaterial color={HAIR} />
              </mesh>
            </group>
          ))}
          {/* Open smile: a half-moon mouth with a row of teeth. */}
          <mesh position={[0, -0.08, 0.207]} rotation={[-0.2, 0, Math.PI]}>
            <circleGeometry args={[0.042, 20, 0, Math.PI]} />
            <meshBasicMaterial color="#7a3330" />
          </mesh>
          <mesh position={[0, -0.087, 0.209]} rotation-x={-0.2}>
            <planeGeometry args={[0.062, 0.013]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {[-0.12, 0.12].map((x) => (
            <mesh key={x} position={[x, -0.05, 0.165]} scale={[1, 0.6, 0.3]}>
              <sphereGeometry args={[0.03, 10, 8]} />
              <meshBasicMaterial color="#f2a090" transparent opacity={0.45} depthWrite={false} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
