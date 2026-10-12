"use client";

// ============================================================
// PROCEDURAL TEXTURES
// ============================================================
// Brick, wood planks and floorboards drawn once on a canvas, so the room
// gets texture without any image downloads. Each is created lazily and
// shared; callers set repeat per surface by cloning.
// ============================================================

import { CanvasTexture, RepeatWrapping, SRGBColorSpace, type Texture } from "three";

function canvasTexture(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const g = canvas.getContext("2d");
  if (g) draw(g);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

/** Small deterministic noise so textures look the same on every visit. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

let brick: CanvasTexture | null = null;
/** One texture tile = 1 m × 1 m of brick. */
export function brickTexture(): CanvasTexture {
  if (brick) return brick;
  const r = rng(7);
  brick = canvasTexture(256, 256, (g) => {
    g.fillStyle = "#e9dccb"; // mortar
    g.fillRect(0, 0, 256, 256);
    const rows = 8;
    const h = 256 / rows;
    for (let row = 0; row < rows; row++) {
      const offset = row % 2 ? 32 : 0;
      for (let x = -64; x < 256; x += 64) {
        const shade = 0.86 + r() * 0.2;
        g.fillStyle = `rgb(${Math.round(196 * shade)}, ${Math.round(87 * shade)}, ${Math.round(58 * shade)})`;
        g.fillRect(x + offset + 3, row * h + 3, 58, h - 6);
      }
    }
  });
  return brick;
}

let planks: CanvasTexture | null = null;
/** Vertical cladding boards; one tile = 1 m wide. */
export function plankTexture(): CanvasTexture {
  if (planks) return planks;
  const r = rng(11);
  planks = canvasTexture(256, 256, (g) => {
    const boards = 6;
    const w = 256 / boards;
    for (let i = 0; i < boards; i++) {
      const shade = 0.88 + r() * 0.18;
      g.fillStyle = `rgb(${Math.round(176 * shade)}, ${Math.round(124 * shade)}, ${Math.round(80 * shade)})`;
      g.fillRect(i * w, 0, w, 256);
      g.fillStyle = "rgba(60, 35, 15, 0.35)";
      g.fillRect(i * w, 0, 2, 256);
      for (let k = 0; k < 6; k++) {
        g.fillStyle = `rgba(90, 55, 25, ${0.08 + r() * 0.08})`;
        g.fillRect(i * w + 4 + r() * (w - 8), r() * 256, 1.5, 40 + r() * 80);
      }
    }
  });
  return planks;
}

let floor: CanvasTexture | null = null;
/** Light oak floorboards; one tile = 2 m × 2 m. */
export function floorTexture(): CanvasTexture {
  if (floor) return floor;
  const r = rng(23);
  floor = canvasTexture(256, 256, (g) => {
    const rows = 8;
    const h = 256 / rows;
    for (let row = 0; row < rows; row++) {
      let x = -r() * 120;
      while (x < 256) {
        const len = 90 + r() * 110;
        const shade = 0.9 + r() * 0.14;
        g.fillStyle = `rgb(${Math.round(217 * shade)}, ${Math.round(168 * shade)}, ${Math.round(108 * shade)})`;
        g.fillRect(x, row * h, len, h);
        g.fillStyle = "rgba(90, 60, 30, 0.35)";
        g.fillRect(x, row * h, 1.5, h);
        x += len;
      }
      g.fillStyle = "rgba(90, 60, 30, 0.3)";
      g.fillRect(0, row * h, 256, 1.5);
    }
  });
  return floor;
}

/** A copy of a shared texture with its own repeat (the image stays shared). */
export function repeated(tex: Texture, x: number, y: number): Texture {
  const t = tex.clone();
  t.repeat.set(x, y);
  t.needsUpdate = true;
  return t;
}
