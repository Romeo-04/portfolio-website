"use client";

// ============================================================
// CAFÉ SCENE (placeholder blockout)
// ============================================================
// Build step 1: every station is a coloured box with a label, so the
// camera rail and scroll timing can be tuned before any Blender model
// exists. Step 2 adds the toon material; step 5 swaps in real models.
// ============================================================

import { Html } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { projectsData } from "@/data/portfolio";
import { drinkFor } from "@/lib/cafe/drinks";
import { getProgress } from "@/lib/cafe/scroll";
import { STATIONS, cameraPose } from "@/lib/cafe/stations";

const STATION_COLORS = ["#c0632f", "#3d5a40", "#8a5a3b", "#a8873c", "#5a3620", "#c8873a", "#7a4a2a"];

function CameraRig({ cut }: { cut: boolean }) {
  useFrame(({ camera }) => {
    const pose = cameraPose(getProgress(), { cut });
    camera.position.set(...pose.position);
    camera.lookAt(...pose.target);
  });
  return null;
}

function SignatureCups() {
  const brewBar = STATIONS.find((s) => s.id === "brew-bar");
  if (!brewBar) throw new Error("brew-bar station missing");
  const [x, y, z] = brewBar.camera.target;
  const signature = projectsData.filter((p) => p.featured);
  return (
    <group position={[x, y, z]}>
      {signature.map((p, i) => (
        <mesh key={p.slug} position={[(i - (signature.length - 1) / 2) * 0.6, 0.35, 0.6]}>
          <cylinderGeometry args={[0.18, 0.14, 0.4, 24]} />
          <meshStandardMaterial color={drinkFor(p).layers[0].color} />
        </mesh>
      ))}
    </group>
  );
}

function PlaceholderShop() {
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#3a2618" />
      </mesh>
      {STATIONS.map((s, i) => (
        <group key={s.id} position={[...s.camera.target]}>
          <mesh>
            <boxGeometry args={[1.6, 1, 0.6]} />
            <meshStandardMaterial color={STATION_COLORS[i]} />
          </mesh>
          <Html center position={[0, 0.9, 0]} className="font-chalk pointer-events-none text-2xl whitespace-nowrap text-[#f5e9da]">
            {s.label}
          </Html>
        </group>
      ))}
      <SignatureCups />
    </>
  );
}

export default function CafeScene({ cut }: { cut: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0">
      <Canvas camera={{ fov: 50, position: [...STATIONS[0].camera.position] }} dpr={[1, 2]}>
        <color attach="background" args={["#1b120c"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <pointLight position={[0, 3, 0]} intensity={8} color="#ffb36b" />
        <CameraRig cut={cut} />
        <PlaceholderShop />
      </Canvas>
    </div>
  );
}
