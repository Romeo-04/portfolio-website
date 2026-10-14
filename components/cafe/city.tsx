"use client";

// ============================================================
// THE CITY AROUND THE CAFÉ
// ============================================================
// The café is one shop on a sunny city street. In front: a sidewalk with
// street lamps and trees, a two-lane road with a crosswalk, and the far
// sidewalk the hero camera stands on. Either side: a row of pastel
// neighbours with shopfronts, striped awnings and windows. Behind: a hazy
// skyline that peeks over the roofs. Everything here is static, so it's
// merged into a handful of draw calls; the people, dogs, cars, clouds and
// birds live in city-life.tsx.
// ============================================================

import { Ink, Toon } from "@/components/cafe/kit";
import Merged from "@/components/cafe/merged";
import { CHARCOAL, CREAM, GREEN, GREEN_DARK, PAVEMENT, WHITE } from "@/components/cafe/palette";
import { Label } from "@/components/cafe/text3d";

type V3 = [number, number, number];

const ASPHALT = "#5d6169";
const CURB = "#cfc8bb";
const ROAD_NEAR = 3.6;
const ROAD_FAR = 10;

/** Small deterministic noise so the skyline is the same on every visit. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

type Shop = { sign: string; awning: [string, string] };
type Neighbour = {
  x0: number;
  x1: number;
  h: number;
  color: string;
  trim: string;
  shop?: Shop;
  tank?: boolean;
};

/** The two rows of neighbours, inner edge first; fronts sit on z = 0. */
const NEIGHBOURS: Neighbour[] = [
  {
    x0: -7.3,
    x1: -12.3,
    h: 9,
    color: "#e9a68b",
    trim: CREAM,
    shop: { sign: "BAKERY", awning: ["#fbf3e4", "#c4573a"] },
  },
  {
    x0: -12.5,
    x1: -17.5,
    h: 12.5,
    color: "#9cc5b0",
    trim: WHITE,
    shop: { sign: "FLOWERS", awning: ["#fbf3e4", "#3f7d43"] },
    tank: true,
  },
  {
    x0: -17.7,
    x1: -23.7,
    h: 7.5,
    color: "#f2d48a",
    trim: CREAM,
    shop: { sign: "RECORDS", awning: ["#2b2b2e", "#f3a712"] },
  },
  { x0: -23.9, x1: -31, h: 10.5, color: "#c9b6e4", trim: WHITE },
  {
    x0: 7.3,
    x1: 11.8,
    h: 8,
    color: "#8fb8de",
    trim: WHITE,
    shop: { sign: "BOOKS", awning: ["#fbf3e4", "#29335c"] },
  },
  {
    x0: 12,
    x1: 17.5,
    h: 11.5,
    color: "#f3c5c5",
    trim: CREAM,
    shop: { sign: "GELATO", awning: ["#fbf3e4", "#e07a8f"] },
    tank: true,
  },
  {
    x0: 17.7,
    x1: 22.7,
    h: 7,
    color: "#e3d6c3",
    trim: WHITE,
    shop: { sign: "CYCLES", awning: ["#fbf3e4", "#d0603f"] },
  },
  { x0: 22.9, x1: 31, h: 13.5, color: "#a7c7a0", trim: CREAM },
];

const DEPTH = 12;
const WINDOW_GLASS = "#a9d6ec";
const WINDOW_WARM = "#ffe6a6";

function Box({ position, size, color, ink = false }: { position: V3; size: V3; color: string; ink?: boolean }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <Toon color={color} />
      {ink && <Ink />}
    </mesh>
  );
}

function NeighbourBuilding({ b, seed }: { b: Neighbour; seed: number }) {
  const r = rng(seed);
  const left = Math.min(b.x0, b.x1);
  const w = Math.abs(b.x1 - b.x0);
  const cx = left + w / 2;
  const cols = Math.max(2, Math.floor((w - 0.8) / 1.55));
  const floors = Math.max(1, Math.floor((b.h - 4.4) / 2.6) + 1);
  const windows: V3[] = [];
  for (let f = 0; f < floors; f++) {
    for (let c = 0; c < cols; c++) {
      windows.push([left + (w / cols) * (c + 0.5), 4.6 + f * 2.6, 0]);
    }
  }
  const stripes = 7;
  return (
    <group>
      {/* The block itself, a cornice and a plinth. */}
      <Box position={[cx, b.h / 2, -DEPTH / 2]} size={[w, b.h, DEPTH]} color={b.color} ink />
      <Box position={[cx, b.h - 0.15, 0.12]} size={[w + 0.25, 0.3, 0.3]} color={b.trim} />
      <Box position={[cx, 3.45, 0.06]} size={[w, 0.16, 0.14]} color={b.trim} />
      {/* Upper windows: a trim frame, glass (some lit warm) and a sill. */}
      {windows.map((p, i) => (
        <group key={i} position={p}>
          <Box position={[0, 0, 0.04]} size={[0.95, 1.4, 0.06]} color={b.trim} />
          <Box position={[0, 0, 0.06]} size={[0.75, 1.2, 0.06]} color={r() > 0.8 ? WINDOW_WARM : WINDOW_GLASS} />
          <Box position={[0, -0.72, 0.12]} size={[1.05, 0.08, 0.2]} color={b.trim} />
          {r() > 0.7 && <Box position={[0, -0.6, 0.18]} size={[0.8, 0.16, 0.16]} color={r() > 0.5 ? GREEN : "#e4572e"} />}
        </group>
      ))}
      {b.tank && (
        <group position={[cx + w * 0.2, b.h, -DEPTH / 2]}>
          <mesh position={[0, 1.1, 0]}>
            <cylinderGeometry args={[0.7, 0.7, 1.4, 14]} />
            <Toon color="#b07a4f" />
            <Ink />
          </mesh>
          <mesh position={[0, 2.0, 0]}>
            <coneGeometry args={[0.8, 0.5, 14]} />
            <Toon color={CHARCOAL} />
          </mesh>
          {[-0.45, 0.45].map((x) => (
            <Box key={x} position={[x, 0.2, 0]} size={[0.08, 0.4, 0.08]} color={CHARCOAL} />
          ))}
        </group>
      )}
      {b.shop ? (
        <group position={[cx, 0, 0]}>
          {/* Shop window, door and a striped awning. */}
          <Box position={[0, 1.55, 0.05]} size={[w - 0.9, 2.7, 0.06]} color="#9ccbe0" />
          {/* Mullions and a warm display shelf behind the glass. */}
          {[-1, 1].map((k) => (
            <Box key={k} position={[(k * (w - 0.9)) / 6, 1.55, 0.09]} size={[0.06, 2.7, 0.04]} color={b.trim} />
          ))}
          <Box position={[-0.6, 0.95, 0.09]} size={[w - 3, 0.12, 0.05]} color="#c9955f" />
          <Box position={[0, 0.2, 0.08]} size={[w - 0.7, 0.4, 0.1]} color={b.trim} />
          <Box position={[w / 2 - 1.2, 1.3, 0.1]} size={[1.0, 2.3, 0.06]} color={b.trim} />
          <Box position={[w / 2 - 1.2, 1.25, 0.12]} size={[0.8, 2.1, 0.06]} color="#7a4b33" />
          <Box position={[w / 2 - 1.2, 1.55, 0.14]} size={[0.5, 1.0, 0.04]} color="#9ccbe0" />
          <group position={[0, 3.05, 0.55]} rotation-x={0.38}>
            {Array.from({ length: stripes }, (_, i) => (
              <Box
                key={i}
                position={[-(w - 0.4) / 2 + ((w - 0.4) / stripes) * (i + 0.5), 0, 0]}
                size={[(w - 0.4) / stripes, 0.06, 1.15]}
                color={b.shop!.awning[i % 2]}
              />
            ))}
          </group>
          <Box position={[0, 3.75, 0.1]} size={[Math.min(w - 1, 3.2), 0.5, 0.08]} color={CHARCOAL} />
          <Label font="display" fontSize={0.3} letterSpacing={0.08} color="#fff8ec" position={[0, 3.75, 0.15]}>
            {b.shop.sign}
          </Label>
        </group>
      ) : (
        <group position={[cx, 0, 0]}>
          {/* A residential entrance instead of a shop. */}
          <Box position={[0, 1.2, 0.08]} size={[1.2, 2.4, 0.08]} color="#7a4b33" />
          <Box position={[0, 2.5, 0.15]} size={[1.6, 0.14, 0.4]} color={b.trim} />
          <Box position={[0, 0.08, 0.5]} size={[1.8, 0.16, 0.8]} color={CURB} />
        </group>
      )}
    </group>
  );
}

/** Taller, hazier towers further back that peek over the street. */
function Skyline() {
  const towers = (() => {
    const r = rng(41);
    const hazy = ["#c9d8e8", "#d9d0e8", "#e8dccd", "#bfd3dc", "#d4e0d0"];
    const list: {
      x: number;
      z: number;
      w: number;
      d: number;
      h: number;
      color: string;
    }[] = [];
    for (let x = -70; x < 70; x += 10 + r() * 7) {
      const z = -34 - r() * 22;
      list.push({
        x,
        z,
        w: 6 + r() * 5,
        d: 6 + r() * 4,
        h: 8 + r() * 11,
        color: hazy[Math.floor(r() * hazy.length)],
      });
    }
    return list;
  })();
  return (
    <group>
      {towers.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]}>
          <Box position={[0, t.h / 2, 0]} size={[t.w, t.h, t.d]} color={t.color} />
          {/* Bands of windows read as floors from far away. */}
          {Array.from({ length: Math.floor((t.h - 3) / 3) }, (_, f) => (
            <Box key={f} position={[0, 3 + f * 3, t.d / 2 + 0.02]} size={[t.w - 0.8, 0.9, 0.04]} color="#eef6fb" />
          ))}
          <Box position={[0, t.h + 0.2, 0]} size={[t.w * 0.5, 0.4, t.d * 0.5]} color="#aab7c4" />
        </group>
      ))}
    </group>
  );
}

function StreetLamp({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 2.1, 0]}>
        <cylinderGeometry args={[0.06, 0.09, 4.2, 10]} />
        <Toon color={CHARCOAL} />
        <Ink />
      </mesh>
      <Box position={[0, 4.15, -0.3]} size={[0.08, 0.08, 0.7]} color={CHARCOAL} />
      <mesh position={[0, 4.0, -0.6]}>
        <coneGeometry args={[0.28, 0.3, 12]} />
        <Toon color={CHARCOAL} />
      </mesh>
      <mesh position={[0, 3.86, -0.6]}>
        <sphereGeometry args={[0.12, 10, 8]} />
        <meshBasicMaterial color="#fff2c8" toneMapped={false} />
      </mesh>
    </group>
  );
}

function Tree({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.1, 16]} />
        <Toon color="#8a6a4d" />
      </mesh>
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 2.6, 8]} />
        <Toon color="#7a5236" />
        <Ink />
      </mesh>
      {(
        [
          [0, 3.0, 0, 1.1, GREEN],
          [0.6, 2.6, 0.2, 0.8, GREEN_DARK],
          [-0.6, 2.7, -0.1, 0.85, GREEN],
          [0.1, 3.6, -0.2, 0.75, GREEN_DARK],
        ] as const
      ).map(([px, py, pz, r, c], i) => (
        <mesh key={i} position={[px, py, pz]}>
          <icosahedronGeometry args={[r, 1]} />
          <Toon color={c} />
          <Ink />
        </mesh>
      ))}
    </group>
  );
}

function Hydrant({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.13, 0.15, 0.7, 12]} />
        <Toon color="#d64933" />
        <Ink />
      </mesh>
      <mesh position={[0, 0.74, 0]}>
        <sphereGeometry args={[0.13, 12, 8]} />
        <Toon color="#d64933" />
      </mesh>
      <Box position={[0, 0.45, 0]} size={[0.42, 0.1, 0.1]} color="#d64933" />
    </group>
  );
}

function Ground() {
  const dashes = [];
  for (let x = -58; x <= 58; x += 4) dashes.push(x);
  return (
    <group>
      {/* Pavement under everything, out to the horizon. */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, -10]}>
        <planeGeometry args={[160, 120]} />
        <Toon color="#d8d1c4" />
      </mesh>
      {/* Café-side sidewalk, curbs, road and the far sidewalk. */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.001, ROAD_NEAR / 2]}>
        <planeGeometry args={[120, ROAD_NEAR]} />
        <Toon color={PAVEMENT} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.002, (ROAD_NEAR + ROAD_FAR) / 2]}>
        <planeGeometry args={[120, ROAD_FAR - ROAD_NEAR]} />
        <Toon color={ASPHALT} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.001, ROAD_FAR + 6]}>
        <planeGeometry args={[120, 12]} />
        <Toon color={PAVEMENT} />
      </mesh>
      <Box position={[0, 0.07, ROAD_NEAR]} size={[120, 0.14, 0.2]} color={CURB} />
      <Box position={[0, 0.07, ROAD_FAR]} size={[120, 0.14, 0.2]} color={CURB} />
      {/* Centre dashes and a zebra crossing left of the café. */}
      {dashes.map((x) => (
        <Box key={x} position={[x, 0.004, (ROAD_NEAR + ROAD_FAR) / 2]} size={[1.8, 0.004, 0.14]} color="#f4e7b0" />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <Box key={i} position={[-10.5, 0.005, ROAD_NEAR + 0.6 + i * 0.75]} size={[3, 0.004, 0.42]} color="#f3f1ea" />
      ))}
    </group>
  );
}

export default function City() {
  return (
    <Merged>
      <Ground />
      {NEIGHBOURS.map((b, i) => (
        <NeighbourBuilding key={b.x0} b={b} seed={i * 31 + 7} />
      ))}
      <Skyline />
      {[-8.4, 8.4, -20, 20].map((x) => (
        <StreetLamp key={x} x={x} z={3.2} />
      ))}
      {[-14.8, 14.8, -27, 27].map((x) => (
        <Tree key={x} x={x} z={2.9} />
      ))}
      <Tree x={-6} z={13} scale={1.15} />
      <Tree x={7} z={13.5} scale={1.1} />
      <Hydrant x={-9.3} z={3.1} />
    </Merged>
  );
}
