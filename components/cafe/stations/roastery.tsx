"use client";

// ============================================================
// STATION 5: ROASTERY
// ============================================================
// Beans ride a conveyor and roast from green to dark as the visitor
// scrolls; each job is one batch label along the belt (spec station 5).
// ============================================================

import { useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Color, Object3D, SphereGeometry, type Group, type InstancedMesh } from "three";
import { Ink, Toon } from "@/components/cafe/kit";
import { Label } from "@/components/cafe/text3d";
import { toonGradient } from "@/components/cafe/materials/toon";
import { useCafeTexture } from "@/components/cafe/textures";
import { ORG_LOGOS, experienceData, type Experience, type OrgLogo } from "@/data/portfolio";
import { CONVEYOR_END, CONVEYOR_START, ROAST_DARK, ROAST_GREEN, beanX, dwellT, easeOutBack, stagger } from "@/lib/cafe/choreo";
import { getProgress } from "@/lib/cafe/scroll";
import { STATIONS } from "@/lib/cafe/stations";

const RZ = STATIONS.find((s) => s.id === "roastery")!.camera.target[2];
const BEANS = 96;
/** Half-roasted beans pass through cinnamon brown on the way to dark. */
const ROAST_MID = "#a0662f";
const BELT_Y = 0.55;

const BELT_LEN = CONVEYOR_END - CONVEYOR_START + 0.4;
const STEEL = "#b9bfc5";
const COPPER = "#c8763a";

/**
 * One coffee bean: an oval with a flat face and the centre crease running
 * down it in a slight S, the domed back underneath.
 */
function beanGeometry() {
  const g = new SphereGeometry(1, 16, 12);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    let y = pos.getY(i);
    const z = pos.getZ(i);
    if (y > 0) {
      y *= 0.45;
      const seam = x - 0.18 * Math.sin(z * 2.2);
      y -= 0.32 * Math.exp(-(seam * seam) / 0.012);
    }
    pos.setXYZ(i, x * 0.045, y * 0.032, z * 0.062);
  }
  g.computeVertexNormals();
  return g;
}

/** The belt on a steel frame: side rails, legs and a roller at each end. */
function Conveyor() {
  return (
    <group>
      <mesh position={[0, BELT_Y - 0.03, 0]}>
        <boxGeometry args={[BELT_LEN, 0.06, 0.46]} />
        <Toon color="#2f2f33" surface="canvas" />
        <Ink />
      </mesh>
      {[-0.26, 0.26].map((z) => (
        <mesh key={z} position={[0, BELT_Y + 0.02, z]}>
          <boxGeometry args={[BELT_LEN + 0.1, 0.08, 0.04]} />
          <Toon color={STEEL} surface="metal" />
          <Ink />
        </mesh>
      ))}
      {[-BELT_LEN / 2 + 0.15, 0, BELT_LEN / 2 - 0.15].flatMap((x) =>
        [-0.24, 0.24].map((z) => (
          <mesh key={`${x}${z}`} position={[x, (BELT_Y - 0.06) / 2, z]}>
            <boxGeometry args={[0.05, BELT_Y - 0.06, 0.05]} />
            <Toon color={STEEL} surface="metal" />
          </mesh>
        )),
      )}
      {[-BELT_LEN / 2, BELT_LEN / 2].map((x) => (
        <mesh key={x} position={[x, BELT_Y - 0.03, 0]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 14]} />
          <Toon color={STEEL} surface="metal" />
          <Ink />
        </mesh>
      ))}
    </group>
  );
}

/** A copper drum roaster at the dark-roast end: hopper, window door, cooling tray and a chimney. */
function DrumRoaster() {
  return (
    <group position={[2.3, 0, -0.5]} scale={0.85}>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.9, 0.7, 0.7]} />
        <Toon color="#2b2b2e" surface="metal" />
        <Ink />
      </mesh>
      <mesh position={[0, 1.02, 0]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.34, 0.34, 0.6, 24]} />
        <Toon color={COPPER} surface="copper" />
        <Ink />
      </mesh>
      {/* Front door with a glass window and a handle. */}
      <mesh position={[0, 1.02, 0.31]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.3, 0.3, 0.03, 24]} />
        <Toon color="#2b2b2e" surface="metal" />
      </mesh>
      <mesh position={[0, 1.02, 0.33]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.14, 0.14, 0.02, 20]} />
        <Toon color="#f3a712" emissive="#c8762a" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0.2, 0.92, 0.36]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.018, 0.018, 0.16, 8]} />
        <Toon color={STEEL} surface="metal" />
      </mesh>
      {/* Hopper of green beans on top. */}
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.24, 0.07, 0.36, 16]} />
        <Toon color={STEEL} surface="metal" />
        <Ink />
      </mesh>
      <mesh position={[0, 1.71, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.03, 16]} />
        <Toon color={ROAST_GREEN} />
      </mesh>
      {/* Chimney up to the ceiling. */}
      <mesh position={[0.25, 2.6, -0.2]}>
        <cylinderGeometry args={[0.08, 0.08, 2.6, 12]} />
        <Toon color={STEEL} surface="metal" />
        <Ink />
      </mesh>
      {/* Cooling tray with stirring arms, full of dark beans. */}
      <group position={[0.68, 0.78, 0.15]}>
        <mesh>
          <cylinderGeometry args={[0.4, 0.4, 0.1, 28]} />
          <Toon color={STEEL} surface="metal" />
          <Ink />
        </mesh>
        <mesh position={[0, 0.051, 0]}>
          <cylinderGeometry args={[0.37, 0.37, 0.01, 28]} />
          <Toon color={ROAST_DARK} />
        </mesh>
        {[0, Math.PI / 2].map((r) => (
          <mesh key={r} position={[0, 0.07, 0]} rotation-y={r + 0.4}>
            <boxGeometry args={[0.7, 0.02, 0.03]} />
            <Toon color={STEEL} surface="metal" />
          </mesh>
        ))}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.7, 10]} />
          <Toon color="#2b2b2e" surface="metal" />
        </mesh>
      </group>
      {/* Gauges on the cabinet. */}
      {[-0.25, 0.25].map((x) => (
        <group key={x} position={[x, 0.5, 0.36]} rotation-x={Math.PI / 2}>
          <mesh>
            <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
            <Toon color="#d9a441" />
          </mesh>
          <mesh position={[0, 0.011, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.004, 16]} />
            <Toon color="#fbfaf6" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Burlap sacks of green beans at the start of the belt. */
function BeanSacks() {
  return (
    <group position={[-2.75, 0, -0.45]}>
      {(
        [
          [0, 0, 0, 1],
          [-0.45, 0, 0.05, 0.9],
          [0.42, 0, 0.1, 0.85],
        ] as const
      ).map(([x, y, z, s], i) => (
        <group key={i} position={[x, y, z]} scale={s}>
          <mesh position={[0, 0.3, 0]} scale={[0.28, 0.36, 0.24]}>
            <sphereGeometry args={[1, 16, 12]} />
            <Toon color="#c9a77c" surface="burlap" />
            <Ink />
          </mesh>
          <mesh position={[0, 0.62, 0]}>
            <cylinderGeometry args={[0.16, 0.22, 0.08, 14]} />
            <Toon color="#b8956a" surface="burlap" />
          </mesh>
          <mesh position={[0, 0.665, 0]} scale={[1, 0.4, 1]}>
            <sphereGeometry args={[0.15, 12, 8]} />
            <Toon color={ROAST_GREEN} />
          </mesh>
          <mesh position={[0, 0.3, 0.235]}>
            <planeGeometry args={[0.2, 0.12]} />
            <Toon color="#8a5a3b" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const PLAQUE_W = 1.32;
const PLAQUE_H = 0.62;
const LOGO_H = 0.27;
/** Plaque scale and spacing: the row fits beside an open station panel. */
const PLAQUE_SCALE = 0.82;
const PLAQUE_GAP = 1.14;

/** One organisation logo, cut out (or on its own dark tile for the EDEN wordmark). */
function OrgLogoMark({ logo, x }: { logo: OrgLogo; x: number }) {
  const info = ORG_LOGOS[logo];
  const map = useCafeTexture(`logo-${logo}`, 1, 1);
  const w = info.dark ? 0.4 : LOGO_H * info.aspect;
  const h = info.dark ? w / info.aspect : LOGO_H;
  return (
    <group position={[x, 0, 0.004]}>
      {info.dark && (
        <mesh position={[0, 0, -0.001]}>
          <planeGeometry args={[w + 0.04, h + 0.08]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      )}
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={map} transparent={!info.dark} alphaTest={0.4} toneMapped={false} />
      </mesh>
    </group>
  );
}

/**
 * A framed plaque for one role: walnut moulding with a brass inlay, the
 * organisation's logos on the left, and the role, organisation and dates
 * set beside them like an engraved nameplate.
 */
function ExperiencePlaque({ e }: { e: Experience }) {
  const logos = e.logos ?? [];
  const widths = logos.map((k) => (ORG_LOGOS[k].dark ? 0.44 : LOGO_H * ORG_LOGOS[k].aspect));
  const span = widths.reduce((t, w) => t + w, 0) + Math.max(0, logos.length - 1) * 0.03;
  const left = -PLAQUE_W / 2 + 0.1;
  const textX = logos.length ? left + span + 0.1 : -PLAQUE_W / 2 + 0.12;
  const textW = PLAQUE_W / 2 - 0.08 - textX;
  const xs = widths.map((w, i) => left + widths.slice(0, i).reduce((t, v) => t + v + 0.03, 0) + w / 2);
  return (
    <group>
      <mesh position={[0, 0, -0.025]}>
        <boxGeometry args={[PLAQUE_W, PLAQUE_H, 0.05]} />
        <Toon color="#4a2c1a" surface="wood" />
        <Ink />
      </mesh>
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={[PLAQUE_W - 0.08, PLAQUE_H - 0.08]} />
        <Toon color="#c9a24a" surface="metal" />
      </mesh>
      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={[PLAQUE_W - 0.12, PLAQUE_H - 0.12]} />
        <Toon color="#f8f1e4" />
      </mesh>
      {logos.map((k, i) => (
        <OrgLogoMark key={k} logo={k} x={xs[i]} />
      ))}
      {logos.length > 0 && (
        <mesh position={[textX - 0.05, 0, 0.004]}>
          <planeGeometry args={[0.006, PLAQUE_H - 0.22]} />
          <meshBasicMaterial color="#c9a24a" />
        </mesh>
      )}
      <Label
        font="display"
        fontSize={0.058}
        maxWidth={textW}
        lineHeight={1.08}
        anchorX="left"
        anchorY="bottom"
        color="#2b1a10"
        position={[textX, 0.03, 0.005]}
      >
        {e.title}
      </Label>
      <Label font="body" fontSize={0.04} maxWidth={textW} anchorX="left" anchorY="top" color="#5a4536" position={[textX, -0.01, 0.005]}>
        {e.organization}
      </Label>
      <Label font="body" fontSize={0.034} letterSpacing={0.04} anchorX="left" anchorY="bottom" color="#b0482a" position={[textX, -PLAQUE_H / 2 + 0.1, 0.005]}>
        {e.period.toUpperCase()}
      </Label>
    </group>
  );
}

export default function Roastery() {
  const beans = useRef<InstancedMesh>(null);
  const labels = useRef<(Group | null)[]>([]);
  const dummy = useMemo(() => new Object3D(), []);
  const color = useMemo(() => new Color(), []);
  const lastT = useRef(-1);
  const green = useMemo(() => new Color(ROAST_GREEN), []);
  const mid = useMemo(() => new Color(ROAST_MID), []);
  const dark = useMemo(() => new Color(ROAST_DARK), []);
  const offsets = useMemo(() => Array.from({ length: BEANS }, (_, i) => i / BEANS), []);
  const bean = useMemo(() => beanGeometry(), []);
  useEffect(() => () => bean.dispose(), [bean]);
  // Fixed scatter across the belt so the beans lie like a real batch.
  const scatter = useMemo(
    () =>
      Array.from({ length: BEANS }, (_, i) => {
        const r = (k: number) => {
          const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
          return v - Math.floor(v);
        };
        return { z: (r(1) - 0.5) * 0.34, yaw: r(2) * Math.PI * 2, flip: r(3) > 0.7 ? Math.PI : 0, tilt: (r(4) - 0.5) * 0.4 };
      }),
    [],
  );

  useLayoutEffect(() => {
    // Instance colours must exist before the first frame sets them.
    beans.current?.setColorAt(0, color.copy(green));
  }, [color, green]);

  useFrame(() => {
    const t = dwellT(getProgress(), "roastery");
    if (t === lastT.current) return;
    lastT.current = t;
    const mesh = beans.current;
    if (mesh) {
      offsets.forEach((offset, i) => {
        const x = beanX(t, offset);
        const b = scatter[i];
        dummy.position.set(x, BELT_Y + 0.03, b.z);
        dummy.rotation.set(b.flip + b.tilt, b.yaw, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        const along = (x - CONVEYOR_START) / (CONVEYOR_END - CONVEYOR_START);
        const k = Math.min(Math.max(along, 0), 1);
        mesh.setColorAt(i, k < 0.5 ? color.lerpColors(green, mid, k * 2) : color.lerpColors(mid, dark, k * 2 - 1));
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
    // Each batch sign pops in with a little overshoot, one after another.
    labels.current.forEach((g, i) => {
      if (!g) return;
      const s = stagger(t, i, experienceData.length);
      g.visible = s > 0;
      g.scale.setScalar(Math.max(0.001, easeOutBack(s)));
    });
  });

  // The conveyor runs across the roastery target, facing its camera.
  return (
    <group position={[0, 0, RZ]}>
      <Conveyor />
      <DrumRoaster />
      <BeanSacks />
      {/* A painted sign on the back wall. */}
      <group position={[0, 2.08, -0.7]}>
        <mesh>
          <boxGeometry args={[2.1, 0.36, 0.05]} />
          <Toon color="#5a3620" surface="wood" />
          <Ink />
        </mesh>
        <Label font="display" fontSize={0.2} letterSpacing={0.06} color="#f6efe2" position={[0, 0, 0.03]}>
          ROASTED IN-HOUSE
        </Label>
      </group>
      <instancedMesh ref={beans} args={[bean, undefined, BEANS]}>
        <meshToonMaterial gradientMap={toonGradient()} />
      </instancedMesh>
      {experienceData.map((e, i) => (
        <group
          key={`${e.title}-${e.organization}`}
          ref={(g) => {
            labels.current[i] = g;
          }}
          position={[(i - (experienceData.length - 1) / 2) * PLAQUE_GAP, 1.58, 0]}
          visible={false}
        >
          <group scale={PLAQUE_SCALE}>
            <ExperiencePlaque e={e} />
          </group>
        </group>
      ))}
    </group>
  );
}
