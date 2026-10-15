"use client";

// ============================================================
// STATION 7: CHECKOUT
// ============================================================
// The register prints a receipt with the contact details as the visitor
// scrolls in; the tip jar points at the socials (spec station 7). Visual
// only: the links live in the Quick Order menu.
// ============================================================

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { Ink, Toon } from "@/components/cafe/kit";
import { Label } from "@/components/cafe/text3d";
import { personalInfo } from "@/data/portfolio";
import { dwellT, receiptLength } from "@/lib/cafe/choreo";
import { getProgress } from "@/lib/cafe/scroll";
import { STATIONS, stationYaw } from "@/lib/cafe/stations";

const [CX, , CZ] = STATIONS.find((s) => s.id === "checkout")!.camera.target;
const RECEIPT_HEIGHT = 0.9;

export default function Checkout() {
  const paper = useRef<Group>(null);
  // troika text mesh; typed loosely because drei doesn't export the type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const text = useRef<any>(null);
  const tips = useRef<Group>(null);
  const lastT = useRef(-1);

  useFrame(() => {
    const t = dwellT(getProgress(), "checkout");
    if (t === lastT.current) return;
    lastT.current = t;
    const len = receiptLength(t);
    if (tips.current) tips.current.visible = t > 0.05;
    if (paper.current) {
      paper.current.scale.y = Math.max(len, 0.001);
      paper.current.visible = len > 0;
    }
    // Printed lines appear from the top as the paper feeds out.
    if (text.current) text.current.clipRect = [-1, -len * RECEIPT_HEIGHT, 1, 1];
  });

  // The register stands at the checkout target, facing its camera.
  return (
    <group position={[CX, 0, CZ]} rotation={[0, stationYaw("checkout"), 0]}>
      {/* Counter: oak body with inset panels, a dark top and a kick plate. */}
      <mesh position={[0, 0.48, 0]}>
        <boxGeometry args={[1.4, 0.96, 0.8]} />
        <Toon color="#d9a86c" surface="wood" />
        <Ink />
      </mesh>
      {[-0.35, 0.35].map((x) => (
        <mesh key={x} position={[x, 0.52, 0.405]}>
          <boxGeometry args={[0.56, 0.62, 0.02]} />
          <Toon color="#c8955c" surface="wood" />
        </mesh>
      ))}
      <mesh position={[0, 0.04, 0.41]}>
        <boxGeometry args={[1.4, 0.08, 0.02]} />
        <Toon color="#2b2b2e" surface="metal" />
      </mesh>
      <mesh position={[0, 0.985, 0]}>
        <boxGeometry args={[1.5, 0.05, 0.88]} />
        <Toon color="#5a3620" surface="wood" />
        <Ink />
      </mesh>
      {/* Receipt printer with a paper roll and a slot. */}
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[0.6, 0.28, 0.4]} />
        <Toon color="#2b2b2e" surface="metal" />
        <Ink />
      </mesh>
      <mesh position={[0, 1.3, -0.08]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.09, 0.09, 0.56, 18]} />
        <Toon color="#fbf6ee" />
      </mesh>
      <mesh position={[0, 1.3, 0.205]}>
        <boxGeometry args={[0.58, 0.015, 0.02]} />
        <Toon color="#111113" />
      </mesh>
      {[-0.22, -0.17].map((x) => (
        <mesh key={x} position={[x, 1.12, 0.205]}>
          <boxGeometry args={[0.03, 0.03, 0.01]} />
          <meshBasicMaterial color={x < -0.2 ? "#8cb369" : "#f3a712"} toneMapped={false} />
        </mesh>
      ))}
      {/* POS screen on a stand, turned toward the customer. */}
      <group position={[-0.52, 1.01, -0.05]} rotation-y={0.35}>
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.02, 0.05, 0.24, 10]} />
          <Toon color="#2b2b2e" surface="metal" />
        </mesh>
        <mesh position={[0, 0.3, 0.02]} rotation-x={-0.25}>
          <boxGeometry args={[0.3, 0.2, 0.02]} />
          <Toon color="#2b2b2e" surface="metal" />
          <Ink />
        </mesh>
        <mesh position={[0, 0.3, 0.033]} rotation-x={-0.25}>
          <planeGeometry args={[0.26, 0.16]} />
          <meshBasicMaterial color="#cfe6f2" toneMapped={false} />
        </mesh>
      </group>
      {/* Service bell. */}
      <group position={[0.3, 1.01, 0.25]}>
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
          <Toon color="#2b2b2e" surface="metal" />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <sphereGeometry args={[0.05, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <Toon color="#d9a441" surface="metal" />
          <Ink />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.03, 6]} />
          <Toon color="#d9a441" surface="metal" />
        </mesh>
      </group>
      {/* Receipt hangs from the printer slot; scale.y grows it downward. */}
      <group ref={paper} position={[0, 1.3, 0.42]}>
        <mesh position={[0, -RECEIPT_HEIGHT / 2, 0]}>
          <planeGeometry args={[0.56, RECEIPT_HEIGHT]} />
          <Toon color="#fbf6ee" />
        </mesh>
      </group>
      <Label
        ref={text}
        font="receipt"
        fontSize={0.034}
        lineHeight={1.5}
        maxWidth={0.5}
        textAlign="center"
        anchorY="top"
        color="#1b120c"
        position={[0, 1.24, 0.44]}
        clipRect={[-1, 0, 1, 1]}
      >
        {`THANK YOU

${personalInfo.email}
${personalInfo.github.replace("https://", "")}
linkedin.com/in/jhezra-tolentino

Come again!`}
      </Label>
      {/* Tip jar with coins. */}
      <mesh position={[0.5, 1.135, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.25, 16, 1, true]} />
        <Toon color="#f6ead8" transparent opacity={0.35} />
      </mesh>
      <mesh position={[0.5, 1.04, 0]}>
        <cylinderGeometry args={[0.095, 0.095, 0.06, 16]} />
        <Toon color="#d9a441" surface="metal" />
      </mesh>
      <mesh position={[0.5, 1.265, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.1, 0.008, 6, 20]} />
        <Toon color="#b9bfc5" />
      </mesh>
      <group ref={tips} position={[0.5, 1.42, 0]} visible={false}>
        <Label font="display" fontSize={0.06} color="#2b2b2e">
          Tips → GitHub · LinkedIn
        </Label>
      </group>
    </group>
  );
}
