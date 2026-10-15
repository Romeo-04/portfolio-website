"use client";

// ============================================================
// CITY LIFE
// ============================================================
// Everything that moves on the street: people strolling past the café
// (some walking dogs, some carrying a coffee), someone on the bench
// sipping, a dog waiting by the door, cars on the road, clouds drifting
// and birds overhead. All chibi toon figures built from primitives, in the
// same style as the barista. They only animate (and only ask for frames)
// while the visitor is at the storefront, and they stand still for reduced
// motion. None of them cast sun shadows (a moving caster would force the
// shadow map to redraw every frame); soft blob shadows ground them instead.
// ============================================================

import { useFrame } from "@react-three/fiber";
import { useCallback, useMemo, useRef, type ReactNode } from "react";
import { Quaternion, Vector3, type Group } from "three";
import { Ink, Toon } from "@/components/cafe/kit";
import { CHARCOAL, TERRACOTTA, WHITE } from "@/components/cafe/palette";
import { getProgress } from "@/lib/cafe/scroll";
import { stationIndexAt } from "@/lib/cafe/stations";

type V3 = [number, number, number];

/** People and cars loop across this stretch of street. */
const WALK_SPAN = 68;
const DRIVE_SPAN = 120;

const wrap = (v: number, span: number) => ((((v + span / 2) % span) + span) % span) - span / 2;

/** Animate only at the storefront, where the street is in view. */
function streetInView(): boolean {
  return stationIndexAt(getProgress()) === 0;
}

function Blob({ radius = 0.3 }: { radius?: number }) {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0.012, 0]}>
      <circleGeometry args={[radius, 16]} />
      <meshBasicMaterial color="#1b120c" transparent opacity={0.16} depthWrite={false} />
    </mesh>
  );
}

// ---------------------------------------------------------------- people

type Look = {
  skin: string;
  hair: string;
  shirt: string;
  pants: string;
  style: "short" | "bun" | "long" | "cap";
  coffee?: boolean;
};

type Limbs = {
  legL: Group | null;
  legR: Group | null;
  armL: Group | null;
  armR: Group | null;
  body: Group | null;
};

/** A chibi person facing +z, about 1.75 m tall. Limbs are exposed for posing. */
type LimbRig = (key: keyof Limbs, g: Group | null) => void;

function Person({ look, rig, seated = false }: { look: Look; rig: LimbRig; seated?: boolean }) {
  const set = (key: keyof Limbs) => (g: Group | null) => rig(key, g);
  return (
    <group ref={set("body")}>
      {[-0.09, 0.09].map((x) => (
        <group key={x} ref={set(x < 0 ? "legL" : "legR")} position={[x, 0.85, 0]} rotation-x={seated ? -Math.PI / 2 : 0}>
          <mesh position={[0, -0.38, 0]}>
            <capsuleGeometry args={[0.07, 0.5, 4, 10]} />
            <Toon color={look.pants} surface="linen" />
          </mesh>
          <mesh position={[0, -0.8, 0.05]}>
            <boxGeometry args={[0.12, 0.08, 0.22]} />
            <Toon color={CHARCOAL} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 1.13, 0]}>
        <capsuleGeometry args={[0.19, 0.3, 6, 14]} />
        <Toon color={look.shirt} surface="linen" />
        <Ink />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} ref={set(side < 0 ? "armL" : "armR")} position={[side * 0.24, 1.32, 0]} rotation-z={side * 0.12}>
          <mesh position={[0, -0.2, 0]}>
            <capsuleGeometry args={[0.055, 0.3, 4, 8]} />
            <Toon color={look.shirt} surface="linen" />
          </mesh>
          <mesh position={[0, -0.41, 0]}>
            <sphereGeometry args={[0.055, 10, 8]} />
            <Toon color={look.skin} />
          </mesh>
          {look.coffee && side > 0 && (
            <group position={[0, -0.45, 0.06]}>
              <mesh>
                <cylinderGeometry args={[0.05, 0.04, 0.14, 10]} />
                <Toon color={WHITE} />
              </mesh>
              <mesh>
                <cylinderGeometry args={[0.052, 0.046, 0.06, 10]} />
                <Toon color={TERRACOTTA} />
              </mesh>
            </group>
          )}
        </group>
      ))}
      <group position={[0, 1.62, 0]}>
        <mesh>
          <sphereGeometry args={[0.2, 18, 14]} />
          <Toon color={look.skin} />
          <Ink />
        </mesh>
        <mesh position={[0, 0.03, -0.02]} rotation-x={-0.3}>
          <sphereGeometry args={[0.21, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <Toon color={look.hair} />
        </mesh>
        {look.style === "bun" && (
          <mesh position={[0, 0.2, -0.08]}>
            <sphereGeometry args={[0.09, 12, 10]} />
            <Toon color={look.hair} />
          </mesh>
        )}
        {look.style === "long" && (
          <mesh position={[0, -0.12, -0.1]}>
            <capsuleGeometry args={[0.17, 0.22, 4, 12]} />
            <Toon color={look.hair} />
          </mesh>
        )}
        {look.style === "cap" && (
          <group position={[0, 0.1, 0]}>
            <mesh>
              <sphereGeometry args={[0.215, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
              <Toon color={look.shirt} surface="linen" />
            </mesh>
            <mesh position={[0, 0, 0.2]} rotation-x={0.15}>
              <boxGeometry args={[0.26, 0.03, 0.16]} />
              <Toon color={look.shirt} surface="linen" />
            </mesh>
          </group>
        )}
        {[-0.07, 0.07].map((x) => (
          <mesh key={x} position={[x, -0.01, 0.18]} scale={[0.8, 1, 0.5]}>
            <sphereGeometry args={[0.025, 10, 8]} />
            <meshBasicMaterial color="#1b1410" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ---------------------------------------------------------------- dogs

type DogLook = { coat: string; ears: string; size: number };
type DogParts = {
  legs: (Group | null)[];
  tail: Group | null;
  head: Group | null;
};
type DogRig = (part: "tail" | "head" | number, g: Group | null) => void;

/** A chibi dog facing +z. */
function Dog({ look, rig }: { look: DogLook; rig: DogRig }) {
  return (
    <group scale={look.size}>
      <mesh position={[0, 0.38, 0]} rotation-x={Math.PI / 2}>
        <capsuleGeometry args={[0.13, 0.34, 6, 12]} />
        <Toon color={look.coat} />
        <Ink />
      </mesh>
      {[
        [-0.08, 0.16],
        [0.08, 0.16],
        [-0.08, -0.16],
        [0.08, -0.16],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0.3, z]} ref={(g) => rig(i, g)}>
          <mesh position={[0, -0.13, 0]}>
            <capsuleGeometry args={[0.035, 0.18, 4, 6]} />
            <Toon color={look.coat} />
          </mesh>
        </group>
      ))}
      <group position={[0, 0.55, 0.26]} ref={(g) => rig("head", g)}>
        <mesh>
          <sphereGeometry args={[0.13, 14, 12]} />
          <Toon color={look.coat} />
          <Ink />
        </mesh>
        <mesh position={[0, -0.03, 0.12]}>
          <boxGeometry args={[0.1, 0.08, 0.1]} />
          <Toon color={look.coat} />
        </mesh>
        <mesh position={[0, 0.0, 0.18]}>
          <sphereGeometry args={[0.025, 8, 6]} />
          <meshBasicMaterial color="#1b1410" />
        </mesh>
        {[-0.05, 0.05].map((x) => (
          <mesh key={x} position={[x, 0.04, 0.11]}>
            <sphereGeometry args={[0.018, 8, 6]} />
            <meshBasicMaterial color="#1b1410" />
          </mesh>
        ))}
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.11, 0.04, -0.02]} rotation-z={side * 0.5}>
            <boxGeometry args={[0.05, 0.14, 0.08]} />
            <Toon color={look.ears} />
          </mesh>
        ))}
      </group>
      <group position={[0, 0.45, -0.26]} ref={(g) => rig("tail", g)}>
        <mesh position={[0, 0.07, -0.03]} rotation-x={-0.6}>
          <capsuleGeometry args={[0.025, 0.14, 4, 6]} />
          <Toon color={look.ears} />
        </mesh>
      </group>
      <Blob radius={0.28} />
    </group>
  );
}

/** Trot cycle for a dog's legs and tail. */
function trot(parts: DogParts, phase: number, wag: number) {
  parts.legs.forEach((g, i) => {
    if (g) g.rotation.x = Math.sin(phase + (i === 0 || i === 3 ? 0 : Math.PI)) * 0.6;
  });
  if (parts.tail) parts.tail.rotation.z = Math.sin(wag) * 0.6;
}

// ---------------------------------------------------------------- walkers

type Walker = {
  look: Look;
  lane: number;
  dir: 1 | -1;
  speed: number;
  offset: number;
  dog?: DogLook;
};

const WALKERS: Walker[] = [
  {
    look: {
      skin: "#f1c6a2",
      hair: "#2a1d17",
      shirt: "#e4572e",
      pants: "#2f3e5c",
      style: "short",
      coffee: true,
    },
    lane: 2.7,
    dir: 1,
    speed: 1.25,
    offset: 0,
  },
  {
    look: {
      skin: "#c98e65",
      hair: "#1d1a1a",
      shirt: "#f3c13a",
      pants: "#3b3b40",
      style: "bun",
    },
    lane: 1.95,
    dir: -1,
    speed: 1.15,
    offset: 12,
    dog: { coat: "#d9a35b", ears: "#a8743f", size: 1 },
  },
  {
    look: {
      skin: "#f6d2b8",
      hair: "#c4573a",
      shirt: "#669bbc",
      pants: "#e9e2d4",
      style: "long",
      coffee: true,
    },
    lane: 2.75,
    dir: 1,
    speed: 1.2,
    offset: 30,
  },
  {
    look: {
      skin: "#8d5a3b",
      hair: "#1d1a1a",
      shirt: "#8cb369",
      pants: "#2b2b2e",
      style: "cap",
    },
    lane: 1.9,
    dir: -1,
    speed: 1.35,
    offset: 41,
  },
  {
    look: {
      skin: "#f1c6a2",
      hair: "#6b4a2f",
      shirt: "#c3423f",
      pants: "#29335c",
      style: "long",
    },
    lane: 2.65,
    dir: 1,
    speed: 1.1,
    offset: 52,
    dog: { coat: "#f4f1ea", ears: "#3b2a20", size: 0.8 },
  },
  {
    look: {
      skin: "#e8b48f",
      hair: "#3a2a20",
      shirt: "#5b8e7d",
      pants: "#d9c3a0",
      style: "short",
    },
    lane: 2.0,
    dir: -1,
    speed: 1.2,
    offset: 60,
    dog: { coat: "#5b3a26", ears: "#3b2318", size: 1.15 },
  },
  {
    look: {
      skin: "#f6d2b8",
      hair: "#e8c26a",
      shirt: "#bc4b51",
      pants: "#3b3b40",
      style: "bun",
      coffee: true,
    },
    lane: 2.8,
    dir: 1,
    speed: 1.3,
    offset: 20,
  },
];

function WalkingPerson({ w, still }: { w: Walker; still: boolean }) {
  const root = useRef<Group>(null);
  const limbs = useRef<Limbs>({
    legL: null,
    legR: null,
    armL: null,
    armR: null,
    body: null,
  });
  const dog = useRef<DogParts>({ legs: [], tail: null, head: null });
  const personRig = useCallback<LimbRig>((key, g) => {
    limbs.current[key] = g;
  }, []);
  const dogPartsRig = useCallback<DogRig>((part, g) => {
    if (typeof part === "number") dog.current.legs[part] = g;
    else dog.current[part] = g;
  }, []);

  // A leash from the free hand to the dog's collar, fixed in the walker's frame.
  const leash = useMemo(() => {
    const hand = new Vector3(-0.25, 0.96, 0.2);
    const collar = new Vector3(-0.55, 0.45 * (w.dog?.size ?? 1), 0.75);
    const mid = hand.clone().add(collar).multiplyScalar(0.5);
    const dir = collar.clone().sub(hand);
    const q = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir.clone().normalize());
    return { mid: mid.toArray() as V3, q, length: dir.length() };
  }, [w.dog]);

  const place = (t: number) => {
    const g = root.current;
    if (!g) return;
    const x = wrap(w.offset + w.dir * w.speed * t, WALK_SPAN);
    g.position.set(x, 0, w.lane);
    const phase = t * w.speed * 5.2;
    const swing = Math.sin(phase) * 0.55;
    const { legL, legR, armL, armR, body } = limbs.current;
    if (legL) legL.rotation.x = swing;
    if (legR) legR.rotation.x = -swing;
    // The leash hand stays forward; the other arm swings.
    if (armL) armL.rotation.x = w.dog ? -0.5 : -swing * 0.8;
    if (armR) armR.rotation.x = w.look.coffee ? -0.9 : swing * 0.8;
    if (body) body.position.y = Math.abs(Math.cos(phase)) * 0.035;
    if (w.dog) trot(dog.current, phase * 1.6, t * 12);
  };

  useFrame(({ clock }) => {
    if (still) return;
    if (!streetInView()) return;
    place(clock.getElapsedTime());
  });

  return (
    <group
      ref={(g) => {
        root.current = g;
        if (g) place(0);
      }}
    >
      <group rotation-y={w.dir > 0 ? Math.PI / 2 : -Math.PI / 2}>
        <Person look={w.look} rig={personRig} />
        <Blob />
        {w.dog && (
          <>
            <group position={[-0.55, 0, 0.75]}>
              <Dog look={w.dog} rig={dogPartsRig} />
            </group>
            <mesh position={leash.mid} quaternion={leash.q}>
              <cylinderGeometry args={[0.008, 0.008, leash.length, 4]} />
              <meshBasicMaterial color="#c3423f" />
            </mesh>
          </>
        )}
      </group>
    </group>
  );
}

// ---------------------------------------------------------------- regulars

/** Someone on the café bench, sipping a coffee now and then. */
function BenchSitter({ still }: { still: boolean }) {
  const limbs = useRef<Limbs>({
    legL: null,
    legR: null,
    armL: null,
    armR: null,
    body: null,
  });
  const rig = useCallback<LimbRig>((key, g) => {
    limbs.current[key] = g;
  }, []);
  useFrame(({ clock }) => {
    if (still || !streetInView()) return;
    const t = clock.getElapsedTime();
    const sip = Math.max(0, Math.sin(t * 0.7)) ** 3;
    if (limbs.current.armR) limbs.current.armR.rotation.x = -0.7 - sip * 1.2;
    if (limbs.current.armL) limbs.current.armL.rotation.x = -0.3;
  });
  return (
    <group position={[2.1, 0.03, 1.02]}>
      <group position={[0, -0.36, 0.02]}>
        <Person
          look={{
            skin: "#e8b48f",
            hair: "#1d1a1a",
            shirt: "#f0c987",
            pants: "#29335c",
            style: "short",
            coffee: true,
          }}
          rig={rig}
          seated
        />
      </group>
    </group>
  );
}

/** A dog waiting by the door, tail going. */
function WaitingDog({ still }: { still: boolean }) {
  const parts = useRef<DogParts>({ legs: [], tail: null, head: null });
  const rig = useCallback<DogRig>((part, g) => {
    if (typeof part === "number") parts.current.legs[part] = g;
    else parts.current[part] = g;
  }, []);
  useFrame(({ clock }) => {
    if (still || !streetInView()) return;
    const t = clock.getElapsedTime();
    if (parts.current.tail) parts.current.tail.rotation.z = Math.sin(t * 14) * 0.7;
    if (parts.current.head) parts.current.head.rotation.z = Math.sin(t * 0.8) * 0.25;
  });
  return (
    <group position={[-1.35, 0, 1.15]} rotation-y={0.4}>
      <Dog look={{ coat: "#e0b77a", ears: "#8a5a3b", size: 1.05 }} rig={rig} />
    </group>
  );
}

// ---------------------------------------------------------------- cars

type CarSpec = {
  color: string;
  lane: number;
  dir: 1 | -1;
  speed: number;
  offset: number;
};

const CARS: CarSpec[] = [
  { color: "#e4572e", lane: 5.2, dir: -1, speed: 7, offset: 0 },
  { color: "#5b8fd9", lane: 5.2, dir: -1, speed: 7, offset: 55 },
  { color: "#f3c13a", lane: 8.3, dir: 1, speed: 6.4, offset: 20 },
  { color: "#7fbf7b", lane: 8.3, dir: 1, speed: 6.4, offset: 80 },
];

function Car({ car, still }: { car: CarSpec; still: boolean }) {
  const root = useRef<Group>(null);
  const wheels = useRef<(Group | null)[]>([]);
  const place = (t: number) => {
    if (!root.current) return;
    root.current.position.set(wrap(car.offset + car.dir * car.speed * t, DRIVE_SPAN), 0, car.lane);
    wheels.current.forEach((w) => w && (w.rotation.x = -t * car.speed * 3));
  };
  useFrame(({ clock }) => {
    if (still || !streetInView()) return;
    place(clock.getElapsedTime());
  });
  return (
    <group
      ref={(g) => {
        root.current = g;
        if (g) place(0);
      }}
    >
      <group rotation-y={car.dir > 0 ? Math.PI / 2 : -Math.PI / 2}>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[1.7, 0.6, 3.8]} />
          <Toon color={car.color} surface="metal" />
          <Ink />
        </mesh>
        <mesh position={[0, 1.15, -0.25]}>
          <boxGeometry args={[1.5, 0.55, 2.0]} />
          <Toon color="#cfe8f5" />
          <Ink />
        </mesh>
        <mesh position={[0, 1.44, -0.25]}>
          <boxGeometry args={[1.56, 0.08, 2.06]} />
          <Toon color={car.color} surface="metal" />
        </mesh>
        {/* Window pillars, so the cabin reads as glass in a body-coloured frame. */}
        {[
          [-0.74, 0.74],
          [0.74, 0.74],
          [-0.74, -1.24],
          [0.74, -1.24],
          [-0.74, -0.25],
          [0.74, -0.25],
        ].map(([x, z], i) => (
          <mesh key={`p${i}`} position={[x, 1.15, z]}>
            <boxGeometry args={[0.06, 0.58, 0.1]} />
            <Toon color={car.color} surface="metal" />
          </mesh>
        ))}
        {/* Bumpers. */}
        {[1.93, -1.93].map((z) => (
          <mesh key={z} position={[0, 0.42, z]}>
            <boxGeometry args={[1.74, 0.16, 0.12]} />
            <Toon color={CHARCOAL} />
          </mesh>
        ))}
        {[-0.55, 0.55].map((x) => (
          <mesh key={x} position={[x, 0.68, 1.91]}>
            <boxGeometry args={[0.32, 0.14, 0.02]} />
            <meshBasicMaterial color="#fff6d6" toneMapped={false} />
          </mesh>
        ))}
        {[
          [-0.82, 1.2],
          [0.82, 1.2],
          [-0.82, -1.25],
          [0.82, -1.25],
        ].map(([x, z], i) => (
          <group
            key={i}
            position={[x, 0.32, z]}
            ref={(g) => {
              wheels.current[i] = g;
            }}
          >
            <mesh rotation-z={Math.PI / 2}>
              <cylinderGeometry args={[0.32, 0.32, 0.22, 14]} />
              <Toon color={CHARCOAL} />
            </mesh>
            <mesh position={[x > 0 ? 0.12 : -0.12, 0, 0]} rotation-z={Math.PI / 2}>
              <cylinderGeometry args={[0.14, 0.14, 0.02, 10]} />
              <Toon color="#d9d4ca" />
            </mesh>
          </group>
        ))}
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.012, 0]}>
          <planeGeometry args={[2, 4.2]} />
          <meshBasicMaterial color="#1b120c" transparent opacity={0.18} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------- sky life

const CLOUDS: { x: number; y: number; z: number; s: number }[] = [
  { x: -40, y: 22, z: -60, s: 3.2 },
  { x: -12, y: 26, z: -66, s: 4 },
  { x: 18, y: 20, z: -58, s: 3 },
  { x: 44, y: 24, z: -64, s: 3.6 },
  { x: 70, y: 21, z: -60, s: 3.1 },
  { x: -70, y: 25, z: -62, s: 3.4 },
];
const CLOUD_SPAN = 150;

function Clouds({ still }: { still: boolean }) {
  const refs = useRef<(Group | null)[]>([]);
  useFrame(({ clock }) => {
    if (still || !streetInView()) return;
    const t = clock.getElapsedTime();
    refs.current.forEach((g, i) => g && (g.position.x = wrap(CLOUDS[i].x + t * 0.8, CLOUD_SPAN)));
  });
  return (
    <>
      {CLOUDS.map((c, i) => (
        <group
          key={i}
          position={[c.x, c.y, c.z]}
          scale={c.s}
          ref={(g) => {
            refs.current[i] = g;
          }}
        >
          {(
            [
              [0, 0, 0, 1.3],
              [1.3, -0.3, 0.2, 1],
              [-1.3, -0.35, 0, 0.95],
              [0.5, 0.6, -0.2, 0.9],
              [-0.6, 0.45, 0.1, 0.8],
            ] as const
          ).map(([x, y, z, r], k) => (
            <mesh key={k} position={[x, y, z]} scale={[1, 0.75, 0.8]}>
              <sphereGeometry args={[r, 14, 10]} />
              <Toon color="#ffffff" emissive="#fff8ee" emissiveIntensity={0.35} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

function Birds({ still }: { still: boolean }) {
  const refs = useRef<(Group | null)[]>([]);
  const wings = useRef<(Group | null)[]>([]);
  const flock = [
    { x: -20, y: 13, z: -14, speed: 3.2 },
    { x: -21.5, y: 13.6, z: -15, speed: 3.2 },
    { x: -19, y: 14.1, z: -15.5, speed: 3.2 },
  ];
  useFrame(({ clock }) => {
    if (still || !streetInView()) return;
    const t = clock.getElapsedTime();
    refs.current.forEach((g, i) => {
      if (!g) return;
      g.position.x = wrap(flock[i].x + t * flock[i].speed, 90);
      g.position.y = flock[i].y + Math.sin(t * 0.9 + i) * 0.4;
    });
    wings.current.forEach((w, i) => w && (w.rotation.z = (i % 2 ? -1 : 1) * Math.sin(t * 10 + i) * 0.6));
  });
  return (
    <>
      {flock.map((b, i) => (
        <group
          key={i}
          position={[b.x, b.y, b.z]}
          ref={(g) => {
            refs.current[i] = g;
          }}
        >
          <mesh>
            <sphereGeometry args={[0.1, 8, 6]} />
            <meshBasicMaterial color={CHARCOAL} />
          </mesh>
          {[-1, 1].map((side) => (
            <group
              key={side}
              ref={(g) => {
                wings.current[i * 2 + (side > 0 ? 1 : 0)] = g;
              }}
            >
              <mesh position={[0, 0, side * 0.22]}>
                <boxGeometry args={[0.12, 0.02, 0.4]} />
                <meshBasicMaterial color={CHARCOAL} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </>
  );
}

/** Keeps frames coming while the street is on screen. */
function Pulse({ still }: { still: boolean }) {
  useFrame(({ invalidate }) => {
    if (!still && streetInView()) invalidate();
  });
  return null;
}

function NoShadow({ children }: { children: ReactNode }) {
  return <group userData={{ noShadow: true }}>{children}</group>;
}

/** `busy` false (phones, slow devices) keeps a smaller crowd. */
export default function CityLife({ still, busy }: { still: boolean; busy: boolean }) {
  const walkers = busy ? WALKERS : WALKERS.slice(0, 4);
  const cars = busy ? CARS : CARS.slice(0, 2);
  return (
    <NoShadow>
      <Pulse still={still} />
      {walkers.map((w, i) => (
        <WalkingPerson key={i} w={w} still={still} />
      ))}
      <BenchSitter still={still} />
      <WaitingDog still={still} />
      {cars.map((c, i) => (
        <Car key={i} car={c} still={still} />
      ))}
      <Clouds still={still} />
      {busy && <Birds still={still} />}
    </NoShadow>
  );
}
