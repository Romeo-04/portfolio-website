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
import { Suspense, forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { BackSide, Color, Mesh as ThreeMesh, Object3D, ShaderMaterial } from "three";
import type { Group, Mesh, MeshBasicMaterial } from "three";
import { INK, OUTLINE_THICKNESS } from "@/components/cafe/materials/toon";
import Effects from "@/components/cafe/effects";
import { Ink, Toon } from "@/components/cafe/kit";
import { Label } from "@/components/cafe/text3d";
import Model from "@/components/cafe/model";
import Room from "@/components/cafe/room";
import Barista from "@/components/cafe/barista";
import City from "@/components/cafe/city";
import CityLife from "@/components/cafe/city-life";
import BrewBar from "@/components/cafe/stations/brew-bar";
import Checkout from "@/components/cafe/stations/checkout";
import MenuBoard from "@/components/cafe/stations/menu-board";
import Roastery from "@/components/cafe/stations/roastery";
import Specials, { type SpecialItem } from "@/components/cafe/stations/specials";
import Storefront from "@/components/cafe/stations/storefront";
import Wall from "@/components/cafe/stations/wall";
import { createPourMaterial, setFill } from "@/components/cafe/shaders/pour";
import { preloadCafeTextures } from "@/components/cafe/textures";
import { projectsData } from "@/data/portfolio";
import { drinkFor } from "@/lib/cafe/drinks";
import { cupFill, layerIndexAt } from "@/lib/cafe/pour";
import { qualityFor } from "@/lib/cafe/quality";
import { setLoading } from "@/lib/cafe/loading";
import { CAMERA_LAMBDA, dampVec3, distance3, shouldSnap } from "@/lib/cafe/damp";
import { getProgress, subscribeProgress } from "@/lib/cafe/scroll";
import { requestShadowUpdate, takeShadowUpdate } from "@/lib/cafe/shadows";
import { STATIONS, cameraPose, stationYaw, type Vec3 } from "@/lib/cafe/stations";
import { easeOutBack } from "@/lib/cafe/choreo";

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

const CARD_W = 0.54;
const CARD_H = 0.25;
/** The plaque hangs on the counter's front face, just under the cup. */
const CARD_TOP = -0.27;
const CARD_Z = 0.225;

/**
 * A plaque on the counter front under each signature cup, like a drink
 * label: the project's initial in a badge, its name and category, and the
 * drink recipe its stack makes. It drops in as the cup starts to fill.
 */
const CupCard = forwardRef<Group, { project: (typeof projectsData)[number]; recipe: string[]; mark: string }>(function CupCard(
  { project, recipe, mark },
  ref,
) {
  return (
    <group ref={ref} position={[0, CARD_TOP, CARD_Z]} visible={false}>
      <group position={[0, -CARD_H / 2, 0]}>
        <mesh>
          <boxGeometry args={[CARD_W, CARD_H, 0.012]} />
          <Toon color="#fbf3e4" />
          <Ink />
        </mesh>
        <mesh position={[0, CARD_H / 2 - 0.018, 0.007]}>
          <planeGeometry args={[CARD_W, 0.036]} />
          <Toon color="#d0603f" />
        </mesh>
        {/* Badge with the project's initial. */}
        <mesh position={[-CARD_W / 2 + 0.055, -0.01, 0.007]}>
          <circleGeometry args={[0.038, 24]} />
          <Toon color="#3b2314" />
        </mesh>
        <Label font="display" fontSize={0.046} color="#fbf3e4" position={[-CARD_W / 2 + 0.055, -0.008, 0.009]}>
          {mark}
        </Label>
        <Label
          font="display"
          fontSize={0.044}
          maxWidth={CARD_W - 0.13}
          anchorX="left"
          color="#2b2b2e"
          position={[-CARD_W / 2 + 0.11, 0.04, 0.009]}
        >
          {project.title}
        </Label>
        <Label font="body" fontSize={0.024} anchorX="left" color="#8a5a3b" position={[-CARD_W / 2 + 0.11, -0.002, 0.009]}>
          {project.category.toUpperCase()}
        </Label>
        <Label
          font="body"
          fontSize={0.024}
          lineHeight={1.15}
          maxWidth={CARD_W - 0.13}
          anchorX="left"
          anchorY="top"
          color="#5a4a3e"
          position={[-CARD_W / 2 + 0.11, -0.025, 0.009]}
        >
          {recipe.join(" · ")}
        </Label>
      </group>
    </group>
  );
});

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
  const card = useRef<Group>(null);
  useFrame(() => {
    const fill = cupFill(getProgress(), index, count);
    setFill(liquid, fill);
    // The name card pops up as its cup starts to fill.
    if (card.current) {
      const s = easeOutBack(Math.min(1, fill * 3));
      card.current.scale.setScalar(Math.max(0.001, s));
      card.current.visible = fill > 0;
    }
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
      {/* The cup's shape follows the drink: a mug gets a handle, a cup a saucer. */}
      {drink.cup === "mug" && (
        <mesh position={[0.2, 0.02, 0]}>
          <torusGeometry args={[0.07, 0.018, 8, 20, Math.PI * 1.3]} />
          <Toon color="#f6ead8" />
          <Ink />
        </mesh>
      )}
      {drink.cup === "cup" && (
        <mesh position={[0, -CUP_HEIGHT / 2 - 0.005, 0]}>
          <cylinderGeometry args={[0.26, 0.22, 0.02, 28]} />
          <Toon color="#fbf7ef" />
          <Ink />
        </mesh>
      )}
      <CupCard ref={card} project={project} recipe={drink.layers.map((l) => l.name)} mark={drink.mark} />
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

/** The sun: a warm key light that casts soft shadows on desktop. */
function Sun({ shadows }: { shadows: boolean }) {
  const target = useMemo(() => new Object3D(), []);
  return (
    <>
      <primitive object={target} position={[0, 0, -4]} />
      <directionalLight
        position={[7, 13, 12]}
        intensity={2.6}
        color="#fff1d6"
        target={target}
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-11}
        shadow-camera-right={11}
        shadow-camera-top={11}
        shadow-camera-bottom={-11}
        shadow-camera-near={1}
        shadow-camera-far={45}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-radius={4}
      />
    </>
  );
}

/**
 * Turns shadows on for every solid mesh, including model pieces that load
 * later. Glass and other transparent surfaces neither cast nor receive, and
 * the sky is skipped, so sunlight still pours through the shop front.
 */
function ShadowFlags({ enabled }: { enabled: boolean }) {
  const scene = useThree((s) => s.scene);
  const seen = useRef(-1);
  useFrame(() => {
    let count = 0;
    scene.traverse(() => count++);
    if (count === seen.current) return;
    seen.current = count;
    // Moving figures are marked noShadow: their shadows would force the
    // shadow map to redraw every frame. They keep soft blob shadows instead.
    const skip = new Set<Object3D>();
    scene.traverse((obj) => {
      if (obj.userData.noShadow) obj.traverse((child) => skip.add(child));
    });
    scene.traverse((obj) => {
      if (!(obj instanceof ThreeMesh)) return;
      if (skip.has(obj)) {
        obj.castShadow = false;
        obj.receiveShadow = false;
        return;
      }
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      // Custom shaders (ink outlines, the pour, the sky) are left out: an
      // outline hull would fatten every shadow.
      const solid = obj.name !== "sky" && mats.every((m) => !m.transparent && !(m instanceof ShaderMaterial));
      obj.castShadow = enabled && solid;
      obj.receiveShadow = enabled && solid;
    });
    requestShadowUpdate();
  });
  useEffect(() => {
    seen.current = -1;
  }, [enabled]);
  return null;
}

/**
 * Draws the sun's shadow map only when the shop changed: while scroll
 * progress moves (every station animates from it), during the warm-up,
 * and when something asks via requestShadowUpdate. Frames where only the
 * camera glides reuse the last map, which skips a full scene pass.
 */
function ShadowRefresh() {
  const get = useThree((s) => s.get);
  const last = useRef<number | null>(null);
  const start = useRef(0);
  useEffect(() => {
    const { shadowMap } = get().gl;
    shadowMap.autoUpdate = false;
    shadowMap.needsUpdate = true;
    start.current = performance.now();
    return () => {
      shadowMap.autoUpdate = true;
    };
  }, [get]);
  useFrame(({ gl }) => {
    const p = getProgress();
    const warming = performance.now() - start.current < WARMUP_MS;
    if (takeShadowUpdate() || warming || p !== last.current) gl.shadowMap.needsUpdate = true;
    last.current = p;
  });
  return null;
}

/** Toon sky: a big inside-out sphere fading from blue overhead to cream. */
function SkyDome() {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        side: BackSide,
        depthWrite: false,
        uniforms: {
          top: { value: new Color("#7fc4f0") },
          horizon: { value: new Color("#fdf1d8") },
        },
        vertexShader: /* glsl */ `
          varying float vY;
          void main() {
            vY = normalize(position).y;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 top;
          uniform vec3 horizon;
          varying float vY;
          void main() {
            float t = smoothstep(-0.05, 0.6, vY);
            gl_FragColor = vec4(mix(horizon, top, t), 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }
        `,
      }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);
  return (
    <mesh name="sky" material={material} renderOrder={-1}>
      <sphereGeometry args={[80, 32, 16]} />
    </mesh>
  );
}

/** Pavement out front, with grass beds either side. */

// Fetch the painted textures alongside the fonts, before Shop suspends on them.
preloadCafeTextures();

function Shop({
  specials,
  lampLights,
  still,
}: {
  specials: SpecialItem[];
  lampLights: boolean;
  still: boolean;
}) {
  return (
    <>
      <SkyDome />
      <City />
      <CityLife still={still} busy={lampLights} />
      <Model name="room" fallback={<Room lampLights={lampLights} />} />
      <Model name="brew-bar" fallback={<BrewBar />} />
      <Barista />
      <Storefront />
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
  const quality = qualityFor({ light, declined });
  return (
    <div aria-hidden className="fixed inset-0">
      <Canvas shadows="percentage" camera={{ fov: 50, position: [...STATIONS[0].camera.position] }} dpr={quality.dpr} onCreated={() => onReady?.()}>
        {!declined && <PerformanceMonitor onDecline={() => setDeclined(true)} />}
        <color attach="background" args={["#bfe3f7"]} />
        {/* Daylight: blue sky above, warm bounce below, and a warm sun. */}
        <hemisphereLight args={["#d6ecff", "#f3dcb8", 1.05]} />
        <Sun shadows={quality.shadows} />
        <ambientLight intensity={0.15} />
        <ShadowFlags enabled={quality.shadows} />
        <ShadowRefresh />
        <LoadingReporter />
        <FrameDriver />
        <CameraRig cut={cut} />
        {/* Fonts for the 3D text load first; the intro covers the wait. */}
        <Suspense fallback={null}>
          <Shop specials={specials} lampLights={quality.effects} still={cut} />
        </Suspense>
        {quality.effects && <Effects />}
      </Canvas>
    </div>
  );
}
