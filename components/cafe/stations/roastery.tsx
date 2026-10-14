"use client";

// ============================================================
// STATION 5: ROASTERY
// ============================================================
// Beans ride a conveyor and roast from green to dark as the visitor
// scrolls; each job is one batch label along the belt (spec station 5).
// ============================================================

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { Color, Object3D, type Group, type InstancedMesh } from "three";
import { Ink, Toon } from "@/components/cafe/kit";
import { Label } from "@/components/cafe/text3d";
import { toonGradient } from "@/components/cafe/materials/toon";
import { experienceData } from "@/data/portfolio";
import { CONVEYOR_END, CONVEYOR_START, ROAST_DARK, ROAST_GREEN, beanX, dwellT, easeOutBack, stagger } from "@/lib/cafe/choreo";
import { getProgress } from "@/lib/cafe/scroll";
import { STATIONS } from "@/lib/cafe/stations";

const RZ = STATIONS.find((s) => s.id === "roastery")!.camera.target[2];
const BEANS = 48;
const BELT_Y = 0.55;

export default function Roastery() {
  const beans = useRef<InstancedMesh>(null);
  const labels = useRef<(Group | null)[]>([]);
  const dummy = useMemo(() => new Object3D(), []);
  const color = useMemo(() => new Color(), []);
  const lastT = useRef(-1);
  const green = useMemo(() => new Color(ROAST_GREEN), []);
  const dark = useMemo(() => new Color(ROAST_DARK), []);
  const offsets = useMemo(() => Array.from({ length: BEANS }, (_, i) => i / BEANS), []);

  useLayoutEffect(() => {
    // Instance colours must exist before the first frame sets them.
    beans.current?.setColorAt(0, color.copy(green));
  }, [color, green]);

  useFrame(() => {
    const t = dwellT(getProgress(), "roastery");
    if (t === lastT.current) return;
    lastT.current = t;
    const mesh = beans.current;
    if (mesh) {
      offsets.forEach((offset, i) => {
        const x = beanX(t, offset);
        dummy.position.set(x, BELT_Y + 0.06, (i % 3) * 0.12 - 0.12);
        dummy.rotation.set(0, i, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        const along = (x - CONVEYOR_START) / (CONVEYOR_END - CONVEYOR_START);
        mesh.setColorAt(i, color.lerpColors(green, dark, Math.min(Math.max(along, 0), 1)));
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
    // Each batch sign pops in with a little overshoot, one after another.
    labels.current.forEach((g, i) => {
      if (!g) return;
      const s = stagger(t, i, experienceData.length);
      g.visible = s > 0;
      g.scale.setScalar(Math.max(0.001, easeOutBack(s)));
    });
  });

  // The conveyor runs across the roastery target, facing its camera.
  return (
    <group position={[0, 0, RZ]}>
      <mesh position={[0, BELT_Y / 2, 0]}>
        <boxGeometry args={[CONVEYOR_END - CONVEYOR_START + 0.4, BELT_Y, 0.5]} />
        <Toon color="#3a3a3e" />
        <Ink />
      </mesh>
      <instancedMesh ref={beans} args={[undefined, undefined, BEANS]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshToonMaterial gradientMap={toonGradient()} />
      </instancedMesh>
      {experienceData.map((e, i) => (
        <group
          key={`${e.title}-${e.organization}`}
          ref={(g) => {
            labels.current[i] = g;
          }}
          position={[CONVEYOR_START + ((i + 0.5) / experienceData.length) * (CONVEYOR_END - CONVEYOR_START), 1.45, 0]}
          visible={false}
        >
          <mesh position={[0, 0, -0.02]}>
            <boxGeometry args={[1.32, 0.5, 0.03]} />
            <Toon color="#a8743f" />
            <Ink />
          </mesh>
          <mesh>
            <planeGeometry args={[1.24, 0.42]} />
            <Toon color="#f6efe2" />
          </mesh>
          <Label font="display" fontSize={0.068} maxWidth={1.12} textAlign="center" lineHeight={1.05} color="#2b2b2e" position={[0, 0.08, 0.005]}>
            {e.title}
          </Label>
          <Label font="body" fontSize={0.045} maxWidth={1.12} textAlign="center" color="#6b5d4f" position={[0, -0.1, 0.005]}>
            {`${e.organization}
${e.period}`}
          </Label>
        </group>
      ))}
    </group>
  );
}
