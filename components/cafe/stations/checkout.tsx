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
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.4, 1, 0.8]} />
        <Toon color="#d9a86c" />
        <Ink />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[0.6, 0.3, 0.4]} />
        <Toon color="#2b2b2e" />
        <Ink />
      </mesh>
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
      <mesh position={[0.5, 1.12, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.25, 16, 1, true]} />
        <Toon color="#f6ead8" transparent opacity={0.35} />
      </mesh>
      <group ref={tips} position={[0.5, 1.42, 0]} visible={false}>
        <Label font="display" fontSize={0.06} color="#2b2b2e">
          Tips → GitHub · LinkedIn
        </Label>
      </group>
    </group>
  );
}
