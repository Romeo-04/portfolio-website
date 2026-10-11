"use client";

// ============================================================
// STATION 7: CHECKOUT
// ============================================================
// The register prints a receipt with the contact details as the visitor
// scrolls in; the tip jar points at the socials (spec station 7). Visual
// only: the links live in the Quick Order menu.
// ============================================================

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { Ink, Toon } from "@/components/cafe/kit";
import { personalInfo } from "@/data/portfolio";
import { dwellT, receiptLength } from "@/lib/cafe/choreo";
import { getProgress } from "@/lib/cafe/scroll";
import { STATIONS, stationYaw } from "@/lib/cafe/stations";

const [CX, , CZ] = STATIONS.find((s) => s.id === "checkout")!.camera.target;
const RECEIPT_HEIGHT = 0.9;

export default function Checkout() {
  const paper = useRef<Group>(null);
  const text = useRef<HTMLDivElement>(null);
  const tips = useRef<HTMLDivElement>(null);
  const lastT = useRef(-1);

  useFrame(() => {
    const t = dwellT(getProgress(), "checkout");
    if (t === lastT.current) return;
    lastT.current = t;
    const len = receiptLength(t);
    if (tips.current) tips.current.style.opacity = String(t);
    if (paper.current) {
      paper.current.scale.y = Math.max(len, 0.001);
      paper.current.visible = len > 0;
    }
    if (text.current) text.current.style.clipPath = `inset(0 0 ${(1 - len) * 100}% 0)`;
  });

  // The register stands at the checkout target, facing its camera.
  return (
    <group position={[CX, 0, CZ]} rotation={[0, stationYaw("checkout"), 0]}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.4, 1, 0.8]} />
        <Toon color="#7a4a2a" />
        <Ink />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[0.6, 0.3, 0.4]} />
        <Toon color="#2b1a10" />
        <Ink />
      </mesh>
      {/* Receipt hangs from the printer slot; scale.y grows it downward. */}
      <group ref={paper} position={[0, 1.3, 0.42]}>
        <mesh position={[0, -RECEIPT_HEIGHT / 2, 0]}>
          <planeGeometry args={[0.4, RECEIPT_HEIGHT]} />
          <Toon color="#fbf6ee" />
        </mesh>
      </group>
      <Html transform position={[0, 1.3 - RECEIPT_HEIGHT / 2, 0.44]} distanceFactor={1.4} className="pointer-events-none">
        <div ref={text} style={{ clipPath: "inset(0 0 100% 0)" }} className="font-receipt w-[150px] text-[9px] leading-snug text-[#1b120c]">
          <p className="text-center font-bold">THANK YOU</p>
          <p>{personalInfo.email}</p>
          <p>{personalInfo.github.replace("https://", "")}</p>
          <p>linkedin.com/in/…</p>
          <p className="mt-1 text-center">Come again ☕</p>
        </div>
      </Html>
      <mesh position={[0.5, 1.12, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.25, 16, 1, true]} />
        <Toon color="#f6ead8" transparent opacity={0.35} />
      </mesh>
      <Html transform position={[0.5, 1.4, 0]} distanceFactor={1.4} className="font-chalk pointer-events-none text-sm whitespace-nowrap text-[#f5e9da]">
        <div ref={tips} style={{ opacity: 0 }}>
          Tips → GitHub · LinkedIn
        </div>
      </Html>
    </group>
  );
}
