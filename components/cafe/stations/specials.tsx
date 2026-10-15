"use client";

// ============================================================
// STATION 6: TODAY'S SPECIALS (the bookshelf)
// ============================================================
// A tall black bookshelf of colourful books fills the double-height wall,
// after the user's reference. The visitor's recent GitHub repos are the
// highlighted books at eye level: they pull out one after another as the
// camera arrives, each with its name and language. With no repos, a
// "Sold out" card sits on the shelf instead (spec section 5).
// ============================================================

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { Color, Object3D, type Group, type InstancedMesh, type PointLight } from "three";
import { Ink, Toon } from "@/components/cafe/kit";
import { Label } from "@/components/cafe/text3d";
import { BOOK_COLORS, CHARCOAL } from "@/components/cafe/palette";
import { dwellT, trayOffset } from "@/lib/cafe/choreo";
import { getProgress } from "@/lib/cafe/scroll";
import { STATIONS, stationYaw } from "@/lib/cafe/stations";

export type SpecialItem = { id: number; name: string; language: string | null; url: string };

const [SX, , SZ] = STATIONS.find((s) => s.id === "specials")!.camera.target;

const WIDTH = 3.8;
const HEIGHT = 5.7;
const DEPTH = 0.32;
const ROW = 0.47;
const ROWS = 12;
/** Shelf board heights (bottom of each row). */
const BOARDS = Array.from({ length: ROWS }, (_, k) => 0.1 + k * ROW);
/** The eye-level row that holds the highlighted repo books. */
const FEATURED_ROW = 3;
const FEATURED_W = 0.14;
const FEATURED_GAP = 0.34;

type Book = { x: number; y: number; w: number; h: number; color: string };

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

/** Filler books for every row, leaving room for the featured books. */
function fillerBooks(featuredSpan: number): Book[] {
  const r = rng(42);
  const books: Book[] = [];
  BOARDS.forEach((y, row) => {
    let x = -WIDTH / 2 + 0.06;
    while (x < WIDTH / 2 - 0.08) {
      const w = 0.05 + r() * 0.06;
      const inFeatured = row === FEATURED_ROW && Math.abs(x + w / 2) < featuredSpan / 2 + 0.05;
      if (!inFeatured && r() > 0.06) {
        const h = 0.26 + r() * 0.14;
        books.push({ x: x + w / 2, y: y + 0.02 + h / 2, w, h, color: BOOK_COLORS[Math.floor(r() * BOOK_COLORS.length)] });
      }
      x += w + 0.004;
    }
  });
  return books;
}

export default function Specials({ items }: { items: SpecialItem[] }) {
  const span = items.length > 0 ? items.length * FEATURED_GAP : 1.6;
  const books = useMemo(() => fillerBooks(span), [span]);
  const filler = useRef<InstancedMesh>(null);
  const featured = useRef<(Group | null)[]>([]);
  const labels = useRef<(Group | null)[]>([]);
  const soldOut = useRef<Group>(null);
  const light = useRef<PointLight>(null);
  const lastT = useRef(-1);

  useLayoutEffect(() => {
    const mesh = filler.current;
    if (!mesh) return;
    const o = new Object3D();
    const c = new Color();
    books.forEach((b, i) => {
      o.position.set(b.x, b.y, -DEPTH / 2 + 0.13);
      o.scale.set(b.w, b.h, 0.24);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
      mesh.setColorAt(i, c.set(b.color));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [books]);

  useFrame(() => {
    const t = dwellT(getProgress(), "specials");
    if (t === lastT.current) return;
    lastT.current = t;
    if (light.current) light.current.intensity = 2.5 * t;
    if (soldOut.current) soldOut.current.visible = t > 0.05;
    featured.current.forEach((g, i) => {
      if (!g) return;
      const pulled = 1 - trayOffset(t, i, items.length);
      g.position.z = -0.1 + pulled * 0.26;
      const label = labels.current[i];
      if (label) label.visible = pulled > 0.05;
    });
  });

  const rowY = BOARDS[FEATURED_ROW] + 0.02;

  // The shelf stands against the right wall, facing its camera.
  return (
    <group position={[SX, 0, SZ]} rotation={[0, stationYaw("specials"), 0]}>
      {/* Carcass: back, sides, top and shelf boards. */}
      <mesh position={[0, HEIGHT / 2, -DEPTH + 0.02]}>
        <boxGeometry args={[WIDTH, HEIGHT, 0.04]} />
        <Toon color={CHARCOAL} />
      </mesh>
      {[-WIDTH / 2, WIDTH / 2].map((x) => (
        <mesh key={x} position={[x, HEIGHT / 2, -DEPTH / 2]}>
          <boxGeometry args={[0.06, HEIGHT, DEPTH]} />
          <Toon color={CHARCOAL} />
          <Ink />
        </mesh>
      ))}
      {[...BOARDS, HEIGHT].map((y) => (
        <mesh key={y} position={[0, y, -DEPTH / 2]}>
          <boxGeometry args={[WIDTH, 0.04, DEPTH]} />
          <Toon color={CHARCOAL} />
        </mesh>
      ))}

      <instancedMesh ref={filler} args={[undefined, undefined, books.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <Toon color="#ffffff" />
      </instancedMesh>

      <pointLight ref={light} position={[0, rowY + 0.8, 0.9]} intensity={0} color="#ffe2b0" distance={4} />

      {items.length === 0 ? (
        <group ref={soldOut} position={[0, rowY + 0.2, 0.06]} visible={false}>
          <mesh>
            <planeGeometry args={[1.5, 0.3]} />
            <Toon color={CHARCOAL} />
          </mesh>
          <Label font="chalk" fontSize={0.1} color="#f6efe2" position={[0, 0, 0.005]}>
            Sold out — check back soon
          </Label>
        </group>
      ) : (
        items.map((item, i) => {
          const x = (i - (items.length - 1) / 2) * FEATURED_GAP;
          return (
            <group
              key={item.id}
              ref={(g) => {
                featured.current[i] = g;
              }}
              position={[x, rowY, -0.1]}
            >
              <mesh position={[0, 0.2, 0]}>
                <boxGeometry args={[FEATURED_W, 0.4, 0.28]} />
                <Toon color={BOOK_COLORS[(i * 5) % BOOK_COLORS.length]} />
                <Ink />
              </mesh>
              {/* A little shelf tag that pops up with the repo's name. */}
              <group
                ref={(g) => {
                  labels.current[i] = g;
                }}
                position={[0, 0.52, 0.16]}
                visible={false}
              >
                <mesh>
                  <planeGeometry args={[0.32, 0.13]} />
                  <Toon color="#fbfaf6" />
                </mesh>
                <Label font="display" fontSize={0.034} maxWidth={0.3} textAlign="center" color="#20262a" position={[0, 0.02, 0.004]}>
                  {item.name}
                </Label>
                <Label font="body" fontSize={0.026} color="#6b5d4f" position={[0, -0.035, 0.004]}>
                  {item.language ?? ""}
                </Label>
              </group>
            </group>
          );
        })
      )}
    </group>
  );
}
