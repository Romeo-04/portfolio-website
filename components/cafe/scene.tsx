"use client";

// ============================================================
// CAFÉ SCENE (toon blockout)
// ============================================================
// The whole shop in toon style: room shell, storefront, menu board, wall
// of fame, roastery, specials case, checkout and the brew bar, plus four
// signature cups that pour their stack as the visitor scrolls. The room and
// brew bar swap for Blender models when registered; every model mesh gets
// the same toon material and ink outline.
//
// Smoothness: the camera eases toward its scroll pose (lib/cafe/damp.ts),
// and after a short warm-up the canvas only draws when something changes —
// scroll, a camera still settling, or rain on screen — instead of every
// frame. The warm-up keeps continuous frames while PerformanceMonitor takes
// its samples, so idle gaps never read as a slow device.
// ============================================================

import { PerformanceMonitor, useProgress } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Color } from "three";
import type { Mesh, MeshBasicMaterial, ShaderMaterial } from "three";
import { INK, OUTLINE_THICKNESS } from "@/components/cafe/materials/toon";
import Effects from "@/components/cafe/effects";
import { Toon } from "@/components/cafe/kit";
import Model from "@/components/cafe/model";
import Room from "@/components/cafe/room";
import BrewBar from "@/components/cafe/stations/brew-bar";
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
import { qualityFor } from "@/lib/cafe/quality";
import { setLoading } from "@/lib/cafe/loading";
import { CAMERA_LAMBDA, dampVec3, distance3, shouldSnap } from "@/lib/cafe/damp";
import { getProgress, subscribeProgress } from "@/lib/cafe/scroll";
import { STATIONS, cameraPose, stationYaw, type Vec3 } from "@/lib/cafe/stations";

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

/** Continuous frames for this long, then draw only on demand. */
const WARMUP_MS = 3500;

function FrameDriver() {
  const setFrameloop = useThree((s) => s.setFrameloop);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const timer = setTimeout(() => setFrameloop("demand"), WARMUP_MS);
    const unsubscribe = subscribeProgress(() => invalidate());
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [setFrameloop, invalidate]);
  return null;
}

function CameraRig({ cut }: { cut: boolean }) {
  const pos = useRef<Vec3 | null>(null);
  const look = useRef<Vec3 | null>(null);
  useFrame(({ camera, invalidate }, dt) => {
    const pose = cameraPose(getProgress(), { cut });
    // Reduced motion cuts; the first frame and teleports (deep links,
    // menu jumps) snap; everything else eases toward the pose.
    if (cut || !pos.current || !look.current || shouldSnap(look.current, pose.target)) {
      pos.current = pose.position;
      look.current = pose.target;
    } else {
      pos.current = dampVec3(pos.current, pose.position, CAMERA_LAMBDA, dt);
      look.current = dampVec3(look.current, pose.target, CAMERA_LAMBDA, dt);
    }
    camera.position.set(...pos.current);
    camera.lookAt(...look.current);
    // Keep drawing until the camera has settled on its pose.
    if (distance3(pos.current, pose.position) > 1e-3 || distance3(look.current, pose.target) > 1e-3) {
      invalidate();
    }
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

function Shop({ reduced, specials, lampLights }: { reduced: boolean; specials: SpecialItem[]; lampLights: boolean }) {
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <Toon color="#3a2618" />
      </mesh>
      <Model name="room" fallback={<Room lampLights={lampLights} />} />
      <Model name="brew-bar" fallback={<BrewBar />} />
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
  light,
  onReady,
}: {
  cut: boolean;
  specials: SpecialItem[];
  light: boolean;
  onReady?: () => void;
}) {
  const [declined, setDeclined] = useState(false);
  const quality = qualityFor({ light, declined, reduced: cut });
  return (
    <div aria-hidden className="fixed inset-0">
      <Canvas camera={{ fov: 50, position: [...STATIONS[0].camera.position] }} dpr={quality.dpr} onCreated={() => onReady?.()}>
        {!declined && <PerformanceMonitor onDecline={() => setDeclined(true)} />}
        <color attach="background" args={["#1b120c"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.6} />
        <pointLight position={[0, 3, 0]} intensity={8} color="#ffb36b" />
        <LoadingReporter />
        <FrameDriver />
        <CameraRig cut={cut} />
        <Shop reduced={cut} specials={specials} lampLights={quality.effects} />
        {quality.effects && <Effects grain={quality.grain} />}
      </Canvas>
    </div>
  );
}
