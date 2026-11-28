"use client";

// ============================================================
// THE BARISTA (Jhezra)
// ============================================================
// A stylised, game-like chibi of the site owner standing behind the brew
// bar, after the illustrated barista: a cream crew-neck sweater and a
// terracotta bib apron with straps over the shoulders and a name tag, built
// from primitives in the shared toon style, under a head modelled in
// Blender on the owner's photo (see barista-head.tsx). Animated in code:
// breathing, blinking, a head that follows the camera, and a wave when the
// visitor reaches the brew bar. It only asks for frames at the brew bar, so
// the on-demand canvas can rest elsewhere.
// ============================================================

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { CatmullRomCurve3, ExtrudeGeometry, Shape, Vector3, type Group, type Object3D } from "three";
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
const TAG_EDGE = "#6b4a36";

/** The apron's bib: narrow at the chest, flaring at the armholes to the waist. */
function apronGeometry() {
  const s = new Shape();
  s.moveTo(-0.17, -0.28);
  s.lineTo(0.17, -0.28);
  s.lineTo(0.17, 0.06);
  s.quadraticCurveTo(0.12, 0.12, 0.115, 0.27);
  s.lineTo(-0.115, 0.27);
  s.quadraticCurveTo(-0.12, 0.12, -0.17, 0.06);
  s.closePath();
  return new ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: false, curveSegments: 10 });
}

/** A flat strap from the bib's top corner, over the shoulder, down the back. */
function strapGeometry(side: number) {
  const x = side * 0.1;
  const path = new CatmullRomCurve3([
    new Vector3(x, 1.12, 0.188),
    new Vector3(x, 1.2, 0.16),
    new Vector3(x, 1.275, 0.088),
    new Vector3(x, 1.3, 0),
    new Vector3(x, 1.275, -0.088),
    new Vector3(x, 1.2, -0.16),
    new Vector3(x, 1.1, -0.19),
  ]);
  const band = new Shape();
  band.moveTo(-0.018, -0.004);
  band.lineTo(0.018, -0.004);
  band.lineTo(0.018, 0.004);
  band.lineTo(-0.018, 0.004);
  band.closePath();
  return new ExtrudeGeometry(band, { steps: 24, bevelEnabled: false, extrudePath: path });
}

/** Four fingers fanned out and a thumb toward the head, for the wave. */
const FINGERS: [number, number, number][] = [
  // x, length, tilt
  [-0.03, 0.04, -0.18],
  [-0.01, 0.05, -0.06],
  [0.01, 0.05, 0.06],
  [0.03, 0.042, 0.18],
];

export default function Barista() {
  const body = useRef<Group>(null);
  const head = useRef<Group>(null);
  const eyes = useRef<(Object3D | null)[]>([]);
  const glints = useRef<(Object3D | null)[]>([]);
  const waveArm = useRef<Group>(null);
  const apron = useMemo(() => apronGeometry(), []);
  const straps = useMemo(() => [strapGeometry(-1), strapGeometry(1)], []);
  useEffect(() => () => [apron, ...straps].forEach((g) => g.dispose()), [apron, straps]);

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

        {/* Torso: cream crew-neck sweater. */}
        <mesh position={[0, 0.95, 0]}>
          <capsuleGeometry args={[0.2, 0.32, 6, 18]} />
          <Toon color={WHITE} surface="linen" />
          <Ink />
        </mesh>
        <mesh position={[0, 1.29, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.072, 0.016, 8, 24]} />
          <Toon color={WHITE} surface="linen" />
        </mesh>

        {/* Bib apron, straps over the shoulders, and the name tag. */}
        <mesh geometry={apron} position={[0, 0.86, 0.165]}>
          <Toon color={TERRACOTTA} surface="linen" />
          <Ink />
        </mesh>
        {straps.map((g, i) => (
          <mesh key={i} geometry={g}>
            <Toon color={TERRACOTTA} surface="linen" />
          </mesh>
        ))}
        <mesh position={[0.065, 1.02, 0.1955]}>
          <planeGeometry args={[0.142, 0.06]} />
          <Toon color={TAG_EDGE} />
        </mesh>
        <mesh position={[0.065, 1.02, 0.1965]}>
          <planeGeometry args={[0.132, 0.05]} />
          <Toon color={CREAM} />
        </mesh>
        <Label font="display" fontSize={0.028} color={CHARCOAL} position={[0.065, 1.02, 0.198]}>
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
          {/* Open hand, palm out: the fingers run on along the arm. */}
          <mesh position={[0, -0.43, 0]} scale={[1, 1.05, 0.5]}>
            <sphereGeometry args={[0.052, 14, 10]} />
            <Toon color={SKIN} />
          </mesh>
          {FINGERS.map(([x, length, tilt]) => (
            <mesh key={x} position={[x * 1.15, -0.47 - length / 2, 0]} rotation-z={tilt}>
              <capsuleGeometry args={[0.012, length, 3, 8]} />
              <Toon color={SKIN} />
            </mesh>
          ))}
          <mesh position={[0.05, -0.41, 0.008]} rotation-z={0.9}>
            <capsuleGeometry args={[0.013, 0.035, 3, 8]} />
            <Toon color={SKIN} />
          </mesh>
        </group>

        {/* Neck. */}
        <mesh position={[0, 1.27, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 0.1, 12]} />
          <Toon color={SKIN} />
        </mesh>

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
