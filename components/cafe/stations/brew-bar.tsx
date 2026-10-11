"use client";

// ============================================================
// BREW BAR (built-in)
// ============================================================
// The counter the signature cups sit on, with an espresso machine at its
// far end. A Blender "brew-bar" model replaces it (see docs/cafe-models.md).
// The cups themselves stay in scene.tsx because they pour with scroll.
// ============================================================

import { Ink, Toon } from "@/components/cafe/kit";

// Counter top at y 1.1; front edge near x 5.2, facing the brew-bar camera.
export default function BrewBar() {
  return (
    <group>
      <mesh position={[5.6, 0.55, -3]}>
        <boxGeometry args={[0.8, 1.1, 4.2]} />
        <Toon color="#5a3620" />
        <Ink />
      </mesh>
      <mesh position={[5.6, 1.12, -3]}>
        <boxGeometry args={[0.9, 0.04, 4.3]} />
        <Toon color="#2b1a10" />
        <Ink />
      </mesh>
      {/* Espresso machine */}
      <group position={[5.8, 1.14, -4.6]}>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.5, 0.6, 0.7]} />
          <Toon color="#b8b8b8" />
          <Ink />
        </mesh>
        <mesh position={[-0.28, 0.32, 0]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.07, 0.07, 0.12, 16]} />
          <Toon color="#2b1a10" />
          <Ink />
        </mesh>
        <mesh position={[0, 0.66, 0]}>
          <boxGeometry args={[0.4, 0.12, 0.5]} />
          <Toon color="#c0632f" />
          <Ink />
        </mesh>
      </group>
    </group>
  );
}
