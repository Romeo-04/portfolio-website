"use client";

// ============================================================
// CAFÉ SCENE (toon blockout)
// ============================================================
// Build step 2: the placeholder stations get the toon look (three light
// bands and ink outlines), and the four signature cups pour their stack
// as the visitor scrolls through the brew bar. Step 5 swaps the boxes for
// Blender models; every model mesh gets the same toon material and
// <Outlines>.
// ============================================================

import { Html, Outlines } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Mesh, MeshToonMaterial, ShaderMaterial } from "three";
import { INK, OUTLINE_THICKNESS, toonGradient } from "@/components/cafe/materials/toon";
import { createPourMaterial, setFill } from "@/components/cafe/shaders/pour";
import { projectsData } from "@/data/portfolio";
import { drinkFor } from "@/lib/cafe/drinks";
import { cupFill, layerIndexAt } from "@/lib/cafe/pour";
import { getProgress } from "@/lib/cafe/scroll";
import { STATIONS, cameraPose } from "@/lib/cafe/stations";

const STATION_COLORS = ["#c0632f", "#3d5a40", "#8a5a3b", "#a8873c", "#5a3620", "#c8873a", "#7a4a2a"];

const CUP_HEIGHT = 0.4;

function Ink() {
  return <Outlines thickness={OUTLINE_THICKNESS} color={INK} />;
}

function CameraRig({ cut }: { cut: boolean }) {
  useFrame(({ camera }) => {
    const pose = cameraPose(getProgress(), { cut });
    camera.position.set(...pose.position);
    camera.lookAt(...pose.target);
  });
  return null;
}

function PouringCup({
  project,
  index,
  count,
}: {
  project: (typeof projectsData)[number];
  index: number;
  count: number;
}) {
  const drink = useMemo(() => drinkFor(project), [project]);
  const layers = drink.layers;
  const liquid = useMemo<ShaderMaterial>(
    () => createPourMaterial(drink, CUP_HEIGHT * 0.9),
    [drink],
  );
  const surfaceRef = useRef<Mesh>(null);
  const surfaceMat = useRef<MeshToonMaterial>(null);
  useFrame(() => {
    const fill = cupFill(getProgress(), index, count);
    setFill(liquid, fill);
    const surface = surfaceRef.current;
    const mat = surfaceMat.current;
    if (!surface || !mat) return;
    surface.visible = fill > 0;
    surface.position.y = (fill - 0.5) * CUP_HEIGHT * 0.9;
    const r = 0.13 + (0.165 - 0.13) * fill;
    surface.scale.set(r, r, 1);
    mat.color.set(layers[layerIndexAt(Math.min(fill, 0.999), layers.length)].color);
  });

  return (
    <group position={[(index - (count - 1) / 2) * 0.6, CUP_HEIGHT / 2 + 0.15, 0.6]}>
      {/* Glass: a see-through toon shell with an ink rim. */}
      <mesh>
        <cylinderGeometry args={[0.18, 0.14, CUP_HEIGHT, 24, 1, true]} />
        <meshToonMaterial color="#f6ead8" gradientMap={toonGradient()} transparent opacity={0.25} />
        <Ink />
      </mesh>
      {/* Liquid: slightly smaller so it sits inside the glass. */}
      <mesh material={liquid}>
        <cylinderGeometry args={[0.165, 0.13, CUP_HEIGHT * 0.9, 24]} />
      </mesh>
      {/* Liquid surface: caps the stack at the fill line. */}
      <mesh ref={surfaceRef} rotation-x={-Math.PI / 2} visible={false}>
        <circleGeometry args={[1, 24]} />
        <meshToonMaterial ref={surfaceMat} gradientMap={toonGradient()} />
      </mesh>
    </group>
  );
}

function SignatureCups() {
  const brewBar = STATIONS.find((s) => s.id === "brew-bar");
  if (!brewBar) throw new Error("brew-bar station missing");
  const [x, y, z] = brewBar.camera.target;
  const signature = projectsData.filter((p) => p.featured);
  return (
    <group position={[x, y, z]}>
      {signature.map((p, i) => (
        <PouringCup key={p.slug} project={p} index={i} count={signature.length} />
      ))}
    </group>
  );
}

function PlaceholderShop() {
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshToonMaterial color="#3a2618" gradientMap={toonGradient()} />
      </mesh>
      {STATIONS.map((s, i) => (
        <group key={s.id} position={[...s.camera.target]}>
          <mesh>
            <boxGeometry args={[1.6, 1, 0.6]} />
            <meshToonMaterial color={STATION_COLORS[i]} gradientMap={toonGradient()} />
            <Ink />
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
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.6} />
        <pointLight position={[0, 3, 0]} intensity={8} color="#ffb36b" />
        <CameraRig cut={cut} />
        <PlaceholderShop />
      </Canvas>
    </div>
  );
}
