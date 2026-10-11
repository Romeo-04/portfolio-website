"use client";

// ============================================================
// CAFÉ SCENE (toon blockout)
// ============================================================
// Toon blockout: the storefront, menu board and wall of fame are built;
// the other stations are still placeholder boxes, and the four signature
// cups pour their stack as the visitor scrolls through the brew bar. Later
// steps swap the boxes for Blender models; every model mesh gets the same
// toon material and <Outlines>.
// ============================================================

import { Html, useProgress } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Color } from "three";
import type { Mesh, MeshBasicMaterial, ShaderMaterial } from "three";
import { INK, OUTLINE_THICKNESS } from "@/components/cafe/materials/toon";
import { Ink, Toon } from "@/components/cafe/kit";
import Checkout from "@/components/cafe/stations/checkout";
import MenuBoard from "@/components/cafe/stations/menu-board";
import Roastery from "@/components/cafe/stations/roastery";
import Specials, { type SpecialItem } from "@/components/cafe/stations/specials";
import Storefront from "@/components/cafe/stations/storefront";
import Wall from "@/components/cafe/stations/wall";
import { createPourMaterial, setFill } from "@/components/cafe/shaders/pour";
import { projectsData } from "@/data/portfolio";
import { drinkFor } from "@/lib/cafe/drinks";
import { cupFill, layerIndexAt } from "@/lib/cafe/pour";
import { setLoading } from "@/lib/cafe/loading";
import { getProgress } from "@/lib/cafe/scroll";
import { STATIONS, cameraPose, stationYaw } from "@/lib/cafe/stations";

const STATION_COLORS = ["#c0632f", "#3d5a40", "#8a5a3b", "#a8873c", "#5a3620", "#c8873a", "#7a4a2a"];

const CUP_HEIGHT = 0.4;
const LIQUID_HEIGHT = CUP_HEIGHT * 0.9;
const LIQUID_RADIUS_TOP = 0.165;
const LIQUID_RADIUS_BOTTOM = 0.13;

function LoadingReporter() {
  const { active, total, progress } = useProgress();
  useEffect(() => {
    setLoading({ active, total, progress });
  }, [active, total, progress]);
  return null;
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
  const colors = useMemo(() => drink.layers.map((l) => new Color(l.color)), [drink]);
  const liquid = useMemo<ShaderMaterial>(
    () => createPourMaterial(drink, LIQUID_HEIGHT),
    [drink],
  );
  useEffect(() => () => liquid.dispose(), [liquid]);
  const lastIdx = useRef(-1);
  const surfaceRef = useRef<Mesh>(null);
  const surfaceMat = useRef<MeshBasicMaterial>(null);
  useFrame(() => {
    const fill = cupFill(getProgress(), index, count);
    setFill(liquid, fill);
    const surface = surfaceRef.current;
    const mat = surfaceMat.current;
    if (!surface || !mat) return;
    surface.visible = fill > 0;
    surface.position.y = (fill - 0.5) * LIQUID_HEIGHT;
    const r = LIQUID_RADIUS_BOTTOM + (LIQUID_RADIUS_TOP - LIQUID_RADIUS_BOTTOM) * fill;
    surface.scale.set(r, r, 1);
    const idx = layerIndexAt(Math.min(fill, 0.999), colors.length);
    if (idx !== lastIdx.current) {
      lastIdx.current = idx;
      mat.color.copy(colors[idx]);
    }
  });

  return (
    <group position={[(index - (count - 1) / 2) * 0.6, CUP_HEIGHT / 2 + 0.15, 0.6]}>
      {/* Glass: a see-through toon shell with an ink rim. */}
      <mesh>
        <cylinderGeometry args={[0.18, 0.14, CUP_HEIGHT, 24, 1, true]} />
        <Toon color="#f6ead8" transparent opacity={0.25} />
      </mesh>
      <mesh position={[0, CUP_HEIGHT / 2, 0]} rotation-x={-Math.PI / 2}>
        <torusGeometry args={[0.18, OUTLINE_THICKNESS / 2, 6, 32]} />
        <meshBasicMaterial color={INK} />
      </mesh>
      {/* Liquid: slightly smaller so it sits inside the glass. */}
      <mesh material={liquid}>
        <cylinderGeometry args={[LIQUID_RADIUS_TOP, LIQUID_RADIUS_BOTTOM, LIQUID_HEIGHT, 24]} />
      </mesh>
      {/* Liquid surface: caps the stack at the fill line. */}
      <mesh ref={surfaceRef} rotation-x={-Math.PI / 2} visible={false}>
        <circleGeometry args={[1, 24]} />
        <meshBasicMaterial ref={surfaceMat} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-1} />
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
    <group position={[x, y, z]} rotation={[0, stationYaw("brew-bar"), 0]}>
      {signature.map((p, i) => (
        <PouringCup key={p.slug} project={p} index={i} count={signature.length} />
      ))}
    </group>
  );
}

const BUILT = new Set<string>(["storefront", "menu-board", "wall", "roastery", "checkout", "specials"]);

function PlaceholderShop({ reduced, specials }: { reduced: boolean; specials: SpecialItem[] }) {
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <Toon color="#3a2618" />
      </mesh>
      {STATIONS.filter((s) => !BUILT.has(s.id)).map((s) => {
        const i = STATIONS.indexOf(s);
        return (
          <group key={s.id} position={[...s.camera.target]} rotation={[0, stationYaw(s.id), 0]}>
            <mesh>
              <boxGeometry args={[1.6, 1, 0.6]} />
              <Toon color={STATION_COLORS[i]} />
              <Ink />
            </mesh>
            <Html center position={[0, 0.9, 0]} className="font-chalk pointer-events-none text-2xl whitespace-nowrap text-[#f5e9da]">
              {s.label}
            </Html>
          </group>
        );
      })}
      <Storefront reduced={reduced} />
      <MenuBoard />
      <Wall />
      <Roastery />
      <Checkout />
      <Specials items={specials} />
      <SignatureCups />
    </>
  );
}

export default function CafeScene({
  cut,
  specials,
  light: _light,
  onReady,
}: {
  cut: boolean;
  specials: SpecialItem[];
  light: boolean;
  onReady?: () => void;
}) {
  return (
    <div aria-hidden className="fixed inset-0">
      <Canvas camera={{ fov: 50, position: [...STATIONS[0].camera.position] }} dpr={[1, 2]} onCreated={() => onReady?.()}>
        <color attach="background" args={["#1b120c"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.6} />
        <pointLight position={[0, 3, 0]} intensity={8} color="#ffb36b" />
        <LoadingReporter />
        <CameraRig cut={cut} />
        <PlaceholderShop reduced={cut} specials={specials} />
      </Canvas>
    </div>
  );
}
