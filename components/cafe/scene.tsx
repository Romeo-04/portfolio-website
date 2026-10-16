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
import type { Group, Mesh, MeshBasicMaterial, PerspectiveCamera } from "three";
import { INK, OUTLINE_THICKNESS } from "@/components/cafe/materials/toon";
import Effects from "@/components/cafe/effects";
import { Ink, Toon } from "@/components/cafe/kit";
import { Label } from "@/components/cafe/text3d";
import Model from "@/components/cafe/model";
import Room from "@/components/cafe/room";
import Barista from "@/components/cafe/barista";
import City from "@/components/cafe/city";
import CityLife from "@/components/cafe/city-life";
import Regulars from "@/components/cafe/regulars";
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
import { openProject } from "@/lib/cafe/project-sheet";
import { getViewInset, subscribeViewInset } from "@/lib/cafe/view-inset";

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

/**
 * Shifts the rendered view right while a station panel is open, so the café
 * stays centred in the free space beside it, easing in and out.
 */
function ViewShift({ cut }: { cut: boolean }) {
  const current = useRef(0);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => subscribeViewInset(() => invalidate()), [invalidate]);
  useFrame(({ camera, size }, dt) => {
    const target = getViewInset();
    const k = cut ? 1 : 1 - Math.exp(-6 * dt);
    current.current += (target - current.current) * k;
    if (Math.abs(target - current.current) < 0.5) current.current = target;
    const cam = camera as PerspectiveCamera;
    if (current.current === 0) {
      if (cam.view?.enabled) cam.clearViewOffset();
    } else {
      cam.setViewOffset(size.width, size.height, -current.current, 0, size.width, size.height);
    }
    if (current.current !== target) invalidate();
  });
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

const CARD_W = 0.56;
const CARD_H = 0.34;
/** The plaque hangs on the counter's front face, just under the cup. */
const CARD_TOP = -0.27;
const CARD_Z = 0.225;
/** Room for text inside the plaque's margins. */
const CARD_TEXT_W = CARD_W - 0.07;

/** Shrinks long names so they stay on one line inside the plaque. */
function titleSize(title: string): number {
  return Math.min(0.06, CARD_TEXT_W / (title.length * 0.54));
}

/**
 * A plaque on the counter front under each signature cup, like a drink
 * label: the project's name, its category and the drink recipe its stack
 * makes, set large enough to read from the bar. It drops in as the cup
 * starts to fill.
 */
const CupCard = forwardRef<Group, { project: (typeof projectsData)[number]; recipe: string[] }>(function CupCard({ project, recipe }, ref) {
  return (
    <group ref={ref} position={[0, CARD_TOP, CARD_Z]} visible={false}>
      <group position={[0, -CARD_H / 2, 0]}>
        <mesh>
          <boxGeometry args={[CARD_W, CARD_H, 0.012]} />
          <Toon color="#fbf3e4" />
          <Ink />
        </mesh>
        <mesh position={[0, CARD_H / 2 - 0.016, 0.007]}>
          <planeGeometry args={[CARD_W, 0.032]} />
          <Toon color="#d0603f" />
        </mesh>
        <Label font="display" fontSize={titleSize(project.title)} color="#2b1a10" position={[0, CARD_H / 2 - 0.085, 0.009]}>
          {project.title}
        </Label>
        <Label font="body" fontSize={0.034} letterSpacing={0.08} color="#b0482a" position={[0, CARD_H / 2 - 0.14, 0.009]}>
          {project.category.toUpperCase()}
        </Label>
        <Label
          font="body"
          fontSize={0.033}
          lineHeight={1.2}
          maxWidth={CARD_TEXT_W}
          textAlign="center"
          anchorY="top"
          color="#4a3a2e"
          position={[0, CARD_H / 2 - 0.175, 0.009]}
        >
          {recipe.join(" · ")}
        </Label>
      </group>
    </group>
  );
});

/** The café's mark on a cup: a cream bean on a dark badge with a cream ring. */
function CafeBadge({ r }: { r: number }) {
  return (
    <group>
      <mesh>
        <circleGeometry args={[r, 28]} />
        <meshBasicMaterial color="#3b2314" />
      </mesh>
      <mesh position={[0, 0, 0.001]}>
        <ringGeometry args={[r * 0.8, r * 0.92, 28]} />
        <meshBasicMaterial color="#fbf3e4" />
      </mesh>
      <group rotation-z={-0.5} position={[0, 0, 0.002]}>
        <mesh scale={[r * 0.36, r * 0.52, 1]}>
          <circleGeometry args={[1, 20]} />
          <meshBasicMaterial color="#fbf3e4" />
        </mesh>
        <mesh position={[0, 0, 0.001]} rotation-z={0.15}>
          <planeGeometry args={[r * 0.1, r * 0.9]} />
          <meshBasicMaterial color="#3b2314" />
        </mesh>
      </group>
    </group>
  );
}

/** Glass radius at height y (the glass tapers from 0.14 at the base to 0.18 at the rim). */
const glassR = (y: number) => 0.14 + 0.04 * (y / CUP_HEIGHT + 0.5);

/** Kraft sleeve round the middle of the cup, carrying the café's badge. */
function Sleeve() {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[glassR(0.065) + 0.006, glassR(-0.065) + 0.006, 0.13, 28, 1, true]} />
        <Toon color="#c99a66" surface="canvas" />
        <Ink />
      </mesh>
      <group position={[0, 0, glassR(0) + 0.009]} rotation-x={-0.1}>
        <CafeBadge r={0.05} />
      </group>
    </group>
  );
}

/**
 * The finishing touch once the cup is full: a swirl of whipped cream with
 * a drizzle and a straw on a glass, or milk foam with a latte-art heart and
 * a dusting on a mug or cup.
 */
function Topping({ kind, dust }: { kind: "whip" | "foam"; dust: string }) {
  const rim = CUP_HEIGHT / 2;
  if (kind === "whip") {
    return (
      <group position={[0, rim, 0]}>
        <mesh position={[0, 0.02, 0]} scale={[0.19, 0.08, 0.19]}>
          <sphereGeometry args={[1, 20, 12]} />
          <Toon color="#fbf3e4" />
          <Ink />
        </mesh>
        <mesh position={[0, 0.085, 0]} scale={[0.12, 0.07, 0.12]}>
          <sphereGeometry args={[1, 18, 10]} />
          <Toon color="#fbf3e4" />
          <Ink />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <coneGeometry args={[0.055, 0.09, 14]} />
          <Toon color="#fbf3e4" />
          <Ink />
        </mesh>
        {/* Drizzle rings. */}
        {[
          [0.06, 0.155],
          [0.12, 0.1],
        ].map(([y, r]) => (
          <mesh key={y} position={[0, y, 0]} rotation-x={Math.PI / 2 - 0.12}>
            <torusGeometry args={[r, 0.008, 6, 28]} />
            <Toon color={dust} />
          </mesh>
        ))}
        {/* Striped straw. */}
        <mesh position={[0.07, 0.12, -0.02]} rotation-z={-0.35}>
          <cylinderGeometry args={[0.014, 0.014, 0.42, 10]} />
          <Toon color="#e4572e" />
          <Ink />
        </mesh>
      </group>
    );
  }
  return (
    <group position={[0, rim - 0.012, 0]}>
      <mesh rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.172, 28]} />
        <Toon color="#f1e2c8" />
      </mesh>
      {/* Latte-art heart: two lobes and a point. */}
      <group position={[0, 0.002, 0.02]} rotation-x={-Math.PI / 2}>
        {[-0.03, 0.03].map((x) => (
          <mesh key={x} position={[x, 0.02, 0]}>
            <circleGeometry args={[0.038, 18]} />
            <meshBasicMaterial color="#c08a5c" />
          </mesh>
        ))}
        <mesh position={[0, -0.015, 0]} rotation-z={Math.PI}>
          <circleGeometry args={[0.062, 3]} />
          <meshBasicMaterial color="#c08a5c" />
        </mesh>
      </group>
      {[
        [-0.1, -0.05],
        [0.11, -0.03],
        [-0.06, 0.1],
        [0.08, 0.09],
        [0.0, -0.11],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.003, z]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.009, 8]} />
          <meshBasicMaterial color={dust} />
        </mesh>
      ))}
    </group>
  );
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
  const card = useRef<Group>(null);
  const topping = useRef<Group>(null);
  useFrame(() => {
    const fill = cupFill(getProgress(), index, count);
    setFill(liquid, fill);
    // The topping lands as the last of the pour settles.
    if (topping.current) {
      const s = easeOutBack(Math.min(1, Math.max(0, (fill - 0.92) / 0.08)));
      topping.current.scale.setScalar(Math.max(0.001, s));
      topping.current.visible = fill > 0.92;
    }
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
    <group
      position={[(index - (count - 1) / 2) * 0.6, CUP_HEIGHT / 2 + 0.15, 0.6]}
      // Clicking a cup or its plaque opens the project, growing from the pointer.
      onClick={(e) => {
        e.stopPropagation();
        openProject(project.slug, { x: e.nativeEvent.clientX - 30, y: e.nativeEvent.clientY - 30, w: 60, h: 60 });
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
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
      <Sleeve />
      <group ref={topping} visible={false}>
        <Topping kind={drink.topping.kind} dust={drink.topping.dust} />
      </group>
      <CupCard ref={card} project={project} recipe={drink.layers.map((l) => l.name)} />
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
      <Regulars still={still} />
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
        <ViewShift cut={cut} />
        {/* Fonts for the 3D text load first; the intro covers the wait. */}
        <Suspense fallback={null}>
          <Shop specials={specials} lampLights={quality.effects} still={cut} />
        </Suspense>
        {quality.effects && <Effects />}
      </Canvas>
    </div>
  );
}
