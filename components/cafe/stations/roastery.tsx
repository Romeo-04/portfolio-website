"use client";

// ============================================================
// STATION 5: ROASTERY
// ============================================================
// Beans ride a conveyor and roast from green to dark as the visitor
// scrolls; each job is one batch label along the belt (spec station 5).
// ============================================================

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { Color, Object3D, type InstancedMesh } from "three";
import { Ink, Toon } from "@/components/cafe/kit";
import { experienceData } from "@/data/portfolio";
import { CONVEYOR_END, CONVEYOR_START, beanX, dwellT, roastColor, stagger } from "@/lib/cafe/choreo";
import { getProgress } from "@/lib/cafe/scroll";
import { STATIONS } from "@/lib/cafe/stations";

const RZ = STATIONS.find((s) => s.id === "roastery")!.camera.target[2];
const BEANS = 48;
const BELT_Y = 0.55;

export default function Roastery() {
  const beans = useRef<InstancedMesh>(null);
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  const dummy = useMemo(() => new Object3D(), []);
  const color = useMemo(() => new Color(), []);
  const offsets = useMemo(() => Array.from({ length: BEANS }, (_, i) => i / BEANS), []);

  useLayoutEffect(() => {
    // Instance colours must exist before the first frame sets them.
    beans.current?.setColorAt(0, color.set(roastColor(0)));
  }, [color]);

  useFrame(() => {
    const t = dwellT(getProgress(), "roastery");
    const mesh = beans.current;
    if (mesh) {
      offsets.forEach((offset, i) => {
        const x = beanX(t, offset);
        dummy.position.set(x, BELT_Y + 0.06, (i % 3) * 0.12 - 0.12);
        dummy.rotation.set(0, i, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        const along = (x - CONVEYOR_START) / (CONVEYOR_END - CONVEYOR_START);
        mesh.setColorAt(i, color.set(roastColor(along)));
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
    labels.current.forEach((el, i) => {
      if (el) el.style.opacity = String(stagger(t, i, experienceData.length));
    });
  });

  // The conveyor runs across the roastery target, facing its camera.
  return (
    <group position={[0, 0, RZ]}>
      <mesh position={[0, BELT_Y / 2, 0]}>
        <boxGeometry args={[CONVEYOR_END - CONVEYOR_START + 0.4, BELT_Y, 0.5]} />
        <Toon color="#2b1a10" />
        <Ink />
      </mesh>
      <instancedMesh ref={beans} args={[undefined, undefined, BEANS]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshToonMaterial />
      </instancedMesh>
      {experienceData.map((e, i) => (
        <Html
          key={e.title}
          transform
          distanceFactor={3}
          position={[CONVEYOR_START + ((i + 0.5) / experienceData.length) * (CONVEYOR_END - CONVEYOR_START), 1.4, 0]}
          className="pointer-events-none"
        >
          <div
            ref={(el) => {
              labels.current[i] = el;
            }}
            style={{ opacity: 0 }}
            className="font-receipt w-[200px] rounded-sm bg-[#f6ead8] p-2 text-center text-[11px] leading-tight text-[#1b120c]"
          >
            <strong className="block">{e.title}</strong>
            {e.organization}
            <br />
            {e.period}
          </div>
        </Html>
      ))}
    </group>
  );
}
