"use client";

// ============================================================
// BREW BAR (built-in)
// ============================================================
// The counter the signature cups sit on, with an espresso machine at its
// far end. A Blender "brew-bar" model replaces it (see docs/cafe-models.md).
// The cups themselves stay in scene.tsx because they pour with scroll.
// ============================================================

import { Ink, Toon } from "@/components/cafe/kit";
import { BRASS, CHARCOAL, GLASS, OAK, OAK_DARK, TERRACOTTA, WHITE } from "@/components/cafe/palette";

const JAR_COLORS = ["#e4572e", "#f3a712", "#8cb369", "#669bbc", "#f0c987", "#bc4b51"];

// Counter top at y 1.1; front edge near x 5.2, facing the brew-bar camera.
export default function BrewBar() {
  return (
    <group>
      <mesh position={[5.6, 0.55, -2.8]}>
        <boxGeometry args={[0.8, 1.1, 3.8]} />
        <Toon color={OAK_DARK} />
        <Ink />
      </mesh>
      <mesh position={[5.6, 1.12, -2.8]}>
        <boxGeometry args={[0.9, 0.04, 3.8]} />
        <Toon color={WHITE} />
        <Ink />
      </mesh>
      {/* Espresso machine: x 5.595..6.045, z -4.65..-3.95, clear of the cups (z -3 +- 0.9 + 0.18) */}
      <group position={[5.82, 1.14, -4.3]}>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.45, 0.6, 0.7]} />
          <Toon color="#d9dde0" />
          <Ink />
        </mesh>
        <mesh position={[-0.26, 0.32, 0]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.07, 0.07, 0.12, 16]} />
          <Toon color={CHARCOAL} />
          <Ink />
        </mesh>
        <mesh position={[0, 0.66, 0]}>
          <boxGeometry args={[0.36, 0.12, 0.5]} />
          <Toon color={BRASS} />
          <Ink />
        </mesh>
      </group>
      {/* Cake display at the front end of the counter. */}
      <group position={[5.72, 1.14, -1.45]}>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.55, 0.04, 0.7]} />
          <Toon color={OAK} />
        </mesh>
        {[
          [-0.15, "#f2b5c4"],
          [0.15, "#7b4a2e"],
        ].map(([z, color]) => (
          <mesh key={String(z)} position={[0, 0.1, z as number]}>
            <cylinderGeometry args={[0.11, 0.11, 0.12, 20]} />
            <Toon color={color as string} />
            <Ink />
          </mesh>
        ))}
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.5, 0.4, 0.65]} />
          <Toon color={GLASS} transparent opacity={0.2} />
        </mesh>
      </group>
      {/* Wall shelf of jars behind the counter. */}
      <mesh position={[6.75, 2.0, -2.8]}>
        <boxGeometry args={[0.3, 0.04, 3.4]} />
        <Toon color={OAK} />
        <Ink />
      </mesh>
      {JAR_COLORS.map((color, i) => (
        <mesh key={color} position={[6.75, 2.13, -1.4 - i * 0.55]}>
          <cylinderGeometry args={[0.07, 0.07, 0.22, 12]} />
          <Toon color={color} />
          <Ink />
        </mesh>
      ))}
      <mesh position={[6.75, 2.5, -2.8]}>
        <boxGeometry args={[0.3, 0.04, 3.4]} />
        <Toon color={OAK} />
        <Ink />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[6.75, 2.63, -1.6 - i * 0.9]}>
          <cylinderGeometry args={[0.09, 0.07, 0.22, 12]} />
          <Toon color={i % 2 ? TERRACOTTA : WHITE} />
          <Ink />
        </mesh>
      ))}
    </group>
  );
}
