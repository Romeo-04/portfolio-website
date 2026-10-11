"use client";

// ============================================================
// STATION 6: TODAY'S SPECIALS
// ============================================================
// A lit pastry case. Recent GitHub repos slide in on trays as the visitor
// scrolls in; with none, a "Sold out" sign (spec station 6, section 5).
// ============================================================

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, PointLight } from "three";
import { Ink, Toon } from "@/components/cafe/kit";
import { dwellT, trayOffset } from "@/lib/cafe/choreo";
import { getProgress } from "@/lib/cafe/scroll";
import { STATIONS, stationYaw } from "@/lib/cafe/stations";

const [SX, , SZ] = STATIONS.find((s) => s.id === "specials")!.camera.target;
const CASE_X = SX + 0.4;
const CASE_Z = SZ;

export type SpecialItem = { id: number; name: string; language: string | null };

/** Tray slot i: two shelves of three, in case space (front faces +z). */
function slot(i: number): [number, number, number] {
  return [((i % 3) - 1) * 0.7, i < 3 ? 0.95 : 0.45, 0];
}

export default function Specials({ items }: { items: SpecialItem[] }) {
  const trays = useRef<(Group | null)[]>([]);
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  const light = useRef<PointLight>(null);

  useFrame(() => {
    const t = dwellT(getProgress(), "specials");
    if (light.current) light.current.intensity = 3 * t;
    trays.current.forEach((g, i) => {
      if (!g) return;
      const out = trayOffset(t, i, items.length);
      const [x, y, z] = slot(i);
      g.position.set(x + out * 2.5, y, z);
      g.visible = out < 1;
      // drei Html ignores the parent's visible flag, so hide the label too.
      const label = labels.current[i];
      if (label) label.style.visibility = out < 1 ? "visible" : "hidden";
    });
  });

  // The case stands just behind the specials target, facing its camera.
  return (
    <group position={[CASE_X, 0, CASE_Z]} rotation={[0, stationYaw("specials"), 0]}>
      <mesh position={[0, 0.7, -0.3]}>
        <boxGeometry args={[2.3, 1.4, 0.1]} />
        <Toon color="#5a3620" />
        <Ink />
      </mesh>
      {[0.3, 0.8].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[2.3, 0.05, 0.6]} />
          <Toon color="#8a5a3b" />
          <Ink />
        </mesh>
      ))}
      <pointLight ref={light} position={[0, 1.3, 0.4]} intensity={0} color="#ffd9a0" distance={3} />
      {items.length === 0 ? (
        <Html transform position={[0, 0.7, 0.2]} distanceFactor={2} className="font-chalk pointer-events-none text-3xl whitespace-nowrap text-[#ffb36b]">
          Sold out — check back soon
        </Html>
      ) : (
        items.map((item, i) => (
          <group
            key={item.id}
            ref={(g) => {
              trays.current[i] = g;
            }}
          >
            <mesh>
              <boxGeometry args={[0.6, 0.06, 0.4]} />
              <Toon color="#f6ead8" />
              <Ink />
            </mesh>
            <Html transform position={[0, 0.16, 0.1]} distanceFactor={1.4} className="pointer-events-none">
              <div
                ref={(el) => {
                  labels.current[i] = el;
                }}
                style={{ visibility: "hidden" }}
                className="font-receipt w-[120px] text-center text-[10px] leading-tight text-[#f5e9da]"
              >
                <strong className="block">{item.name}</strong>
                {item.language ?? ""}
              </div>
            </Html>
          </group>
        ))
      )}
    </group>
  );
}
