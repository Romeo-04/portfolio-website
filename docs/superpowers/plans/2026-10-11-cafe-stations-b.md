# Café Stations B: Roastery, Specials, Checkout, Glow and Quality (Build Step 3b) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the station choreography: beans roast along the roastery
conveyor, repo trays slide into the lit specials case, and the checkout
receipt prints the contact details. Then add bloom and film grain, and
scale quality down on slow devices and in phone "light 3D" mode.

**Architecture:** Same pattern as step 3a. Pure, tested functions in
`lib/cafe/choreo.ts` and a new `lib/cafe/quality.ts`; one component per
station in `components/cafe/stations/`. GitHub specials are passed from the
server page to the scene through `CafeShell` as a small serialisable list.
Post-processing uses `@react-three/postprocessing`.

**Tech Stack:** R3F 9.8, drei 10.7 (`Html`, `PerformanceMonitor`),
@react-three/postprocessing 3.x, three 0.185, vitest 3.

**Spec:** `docs/superpowers/specs/2026-10-11-coffee-shop-portfolio-design.md`
(section 2 stations 5–7, section 3 "Stack" and "Performance", build step 3).

**Base branch:** `feat/cafe-stations-a`. Branch `feat/cafe-stations-b`
from it.

## Global Constraints

- Station animations are pure functions of scroll progress inside each
  station's dwell zone (`dwellT`), so they reverse when scrolling back.
- Specials: at most `SPECIALS_LIMIT` (6) trays. With none, the case shows a
  "Sold out" sign (spec section 5).
- Contact details on the receipt come from `personalInfo` (email, GitHub,
  LinkedIn). The 3D receipt is visual only; links live in the Quick Order
  menu.
- Effects: bloom `intensity 0.6`, `luminanceThreshold 0.8`, `mipmapBlur`;
  film grain `Noise opacity 0.06`; `Vignette darkness 0.5`.
- Reduced motion: no animated grain (Noise off). Bloom and vignette stay.
- Quality: desktop DPR `[1, 2]` with effects. When `PerformanceMonitor`
  reports a decline, DPR `[1, 1]` and effects off. Phone light 3D (entered
  from the menu page): DPR `[1, 1]` and effects off from the start (spec:
  "lower DPR, no post-processing except outlines").
- All new three code stays in the `next/dynamic` scene chunk.
- `/` and the menu modes keep working; `npm run build` green after each
  task.
- Commits follow `.claude/skills/git-operations/SKILL.md`. **No
  `Co-Authored-By` trailer or attribution footer.** Do not stage
  `lib/particle-shapes.ts` or `.superpowers/`.

## Review Focus

1. **GitHub returned nothing:** the case shows "Sold out" and no empty
   trays. Pinned in Task 3 by passing `[]` through; checked in the
   component by the `specials.length === 0` branch.
2. **Fewer than 6 repos** (e.g. 2): trays stagger over 2, not 6, so the
   last one still finishes inside the dwell zone. Pinned in Task 1
   (`trayOffset` uses the actual count).
3. **Performance decline and recovery:** after a decline, quality stays
   reduced (no flicker back and forth). Pinned in Task 1 (`qualityFor`)
   and Task 4 (the decline flag is sticky).
4. **Reduced motion with grain:** no Noise. Pinned in Task 1
   (`qualityFor` returns `grain: false`).
5. **Phone light 3D:** effects never mount. Pinned in Task 1 and Task 4.

---

## File Structure

| File | Responsibility |
|---|---|
| `lib/cafe/stations.ts` (modify) | Indoor camera layout, `stationYaw` |
| `components/cafe/stations/wall.tsx` (modify) | Follow the wall station's target |
| `lib/cafe/choreo.ts` (modify) | `roastColor`, `beanX`, `trayOffset`, `receiptLength` |
| `lib/cafe/choreo.test.ts` (modify) | Tests |
| `lib/cafe/quality.ts` | `qualityFor` |
| `lib/cafe/quality.test.ts` | Tests |
| `components/cafe/stations/roastery.tsx` | Conveyor, roasting beans, batch labels |
| `components/cafe/stations/specials.tsx` | Lit case, sliding repo trays, sold-out sign |
| `components/cafe/stations/checkout.tsx` | Register, printing receipt, tip jar |
| `components/cafe/effects.tsx` | Bloom, grain, vignette |
| `components/cafe/scene.tsx` (modify) | Render stations, quality, effects |
| `components/cafe/cafe-shell.tsx` (modify) | Pass `specials` and `light` to the scene |
| `app/cafe/page.tsx` (modify) | Pass specials to the shell |

---

### Task 0: Move every station inside the shop

Step 1 placed the specials case (z = 4), the checkout (z = 6) and half of
the wall of fame (z from -2 to 2) on the street side of the storefront door
(z = 0), and the menu-board and brew-bar cameras stood outside too. This
task moves them indoors. The room is x from -7 to 7, z from 0 to -9.5, with
the roastery behind it (z from -9.5 to -14). Station components now face
their camera through one tested helper instead of hard-coded angles.

**Files:**
- Modify: `lib/cafe/stations.ts`, `lib/cafe/stations.test.ts`,
  `components/cafe/stations/wall.tsx`, `components/cafe/scene.tsx`

**Interfaces:**
- Produces: `stationYaw(id: StationId): number`, the y-rotation that turns a
  model's +z face toward the station's camera.

- [ ] **Step 1: Write the failing test**

Append to `lib/cafe/stations.test.ts` (add `stationYaw` to the import):

```ts
describe("indoor layout", () => {
  it("keeps every station after the storefront inside the shop", () => {
    for (const s of STATIONS.slice(1)) {
      expect(s.camera.position[2]).toBeLessThan(0);
      expect(s.camera.target[2]).toBeLessThan(0);
      expect(Math.abs(s.camera.target[0])).toBeLessThan(7);
    }
  });
});

describe("stationYaw", () => {
  it("turns a +z face toward the camera", () => {
    expect(stationYaw("wall")).toBeCloseTo(Math.PI / 2);
    expect(stationYaw("specials")).toBeCloseTo(-Math.PI / 2);
    expect(stationYaw("storefront")).toBeCloseTo(0);
  });
});
```

- [ ] **Step 2: Run to see it fail**

Run: `npx vitest run lib/cafe/stations.test.ts`. Expected: FAIL (layout and missing export).

- [ ] **Step 3: Update the cameras in `lib/cafe/stations.ts`**

Change only these `camera` values; leave ids, labels and `menuSection`
alone:

| id | position | target |
|---|---|---|
| storefront | `[0, 1.6, 12]` (unchanged) | `[0, 1.5, 0]` (unchanged) |
| menu-board | `[0, 2, -0.5]` | `[0, 2.6, -4]` (unchanged) |
| brew-bar | `[3.5, 1.5, -2.5]` | `[6, 1, -3]` |
| wall | `[-3, 1.8, -3]` | `[-6, 1.8, -3]` |
| roastery | `[0, 1.8, -9.9]` | `[0, 1, -13.2]` |
| specials | `[3, 1.2, -6]` | `[5.5, 0.8, -6]` |
| checkout | `[-2, 1.5, -5.5]` | `[-4.5, 1.1, -7]` |

Add below `stationAnchor`:

```ts
/** y-rotation that turns a model's +z face toward the station's camera. */
export function stationYaw(id: StationId): number {
  const { position, target } = STATIONS[indexOf(id)].camera;
  return Math.atan2(position[0] - target[0], position[2] - target[2]);
}
```

- [ ] **Step 4: Make the wall follow its station**

In `components/cafe/stations/wall.tsx`, import `STATIONS` and `stationYaw`
from `@/lib/cafe/stations`. Replace the outer group's hard-coded
`position={[-6.4, 1.8, 0]} rotation={[0, Math.PI / 2, 0]}` with:

```tsx
const [tx, ty, tz] = STATIONS.find((s) => s.id === "wall")!.camera.target;
// ...
<group position={[tx - 0.4, ty, tz]} rotation={[0, stationYaw("wall"), 0]}>
```

Declare the target constant at module level, and update the comment above
the return to "The wall stands just behind the wall station's target,
facing its camera."

Also in `components/cafe/scene.tsx`, turn the brew-bar cups toward their
camera, so they spread across the view instead of lining up in depth.
Import `stationYaw`, and give `SignatureCups`' outer group
`rotation={[0, stationYaw("brew-bar"), 0]}`. In `PlaceholderShop`, give
each placeholder `<group>` `rotation={[0, stationYaw(s.id), 0]}` as well.
Add `components/cafe/scene.tsx` to this task's `git add`.

- [ ] **Step 5: Verify**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`. The
existing camera-pose tests read positions from `STATIONS`, so they still
pass.

- [ ] **Step 6: Commit**

```bash
git add lib/cafe/stations.ts lib/cafe/stations.test.ts components/cafe/stations/wall.tsx components/cafe/scene.tsx
git commit -m "fix: move every station inside the shop" -m "The specials case, checkout, half of the wall and two cameras sat on the street side of the storefront door, so the camera left the shop after entering it. Stations now sit inside one room with the roastery behind it, and components face their camera through stationYaw." -m "Verification: tests (new layout and yaw tests), tsc, lint and build green."
```

---

### Task 1: Choreography and quality math

**Files:**
- Modify: `lib/cafe/choreo.ts`, `lib/cafe/choreo.test.ts`
- Create: `lib/cafe/quality.ts`, `lib/cafe/quality.test.ts`

**Interfaces:**
- Produces (`choreo.ts`, added):
  - `ROAST_GREEN = "#7a9a3a"`, `ROAST_DARK = "#3b2314"`
  - `roastColor(t: number): string` (hex `#rrggbb`, green at 0, dark at 1)
  - `CONVEYOR_START = -3`, `CONVEYOR_END = 3`
  - `beanX(t: number, offset: number): number` (offset 0..1 along the belt)
  - `trayOffset(t: number, index: number, count: number): number` (1 = out of the case, 0 = in place)
  - `receiptLength(t: number): number` (0..1)
- Produces (`quality.ts`):
  - `type Quality = { dpr: [number, number]; effects: boolean; grain: boolean }`
  - `qualityFor(opts: { light: boolean; declined: boolean; reduced: boolean }): Quality`

- [ ] **Step 1: Write the failing tests**

Append to `lib/cafe/choreo.test.ts` (and add the new names to its import
from `@/lib/cafe/choreo`):

```ts
describe("roastColor", () => {
  it("goes from green beans to dark roast", () => {
    expect(roastColor(0)).toBe(ROAST_GREEN);
    expect(roastColor(1)).toBe(ROAST_DARK);
    expect(roastColor(0.5)).toMatch(/^#[0-9a-f]{6}$/);
    expect(roastColor(-1)).toBe(ROAST_GREEN);
  });
});

describe("beanX", () => {
  it("moves beans along the belt and wraps them", () => {
    expect(beanX(0, 0)).toBe(CONVEYOR_START);
    expect(beanX(0, 0.5)).toBeCloseTo((CONVEYOR_START + CONVEYOR_END) / 2);
    const x = beanX(0.9, 0.5);
    expect(x).toBeGreaterThanOrEqual(CONVEYOR_START);
    expect(x).toBeLessThanOrEqual(CONVEYOR_END);
  });
});

describe("trayOffset", () => {
  it("slides trays in one after another over the real count", () => {
    expect(trayOffset(0, 0, 2)).toBe(1);
    expect(trayOffset(1, 1, 2)).toBeCloseTo(0);
    expect(trayOffset(0.5, 1, 2)).toBe(1);
    expect(trayOffset(1, 1, 6)).toBeCloseTo(0);
  });
});

describe("receiptLength", () => {
  it("prints from 0 to full and reverses", () => {
    expect(receiptLength(0)).toBe(0);
    expect(receiptLength(1)).toBeCloseTo(1);
    expect(receiptLength(0.3)).toBeLessThan(receiptLength(0.6));
  });
});
```

`lib/cafe/quality.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { qualityFor } from "@/lib/cafe/quality";

describe("qualityFor", () => {
  it("gives desktop full quality", () => {
    expect(qualityFor({ light: false, declined: false, reduced: false })).toEqual({
      dpr: [1, 2],
      effects: true,
      grain: true,
    });
  });
  it("drops to DPR 1 and no effects after a performance decline", () => {
    expect(qualityFor({ light: false, declined: true, reduced: false })).toEqual({
      dpr: [1, 1],
      effects: false,
      grain: false,
    });
  });
  it("keeps phone light 3D lean from the start", () => {
    expect(qualityFor({ light: true, declined: false, reduced: false })).toEqual({
      dpr: [1, 1],
      effects: false,
      grain: false,
    });
  });
  it("turns grain off for reduced motion but keeps bloom", () => {
    expect(qualityFor({ light: false, declined: false, reduced: true })).toEqual({
      dpr: [1, 2],
      effects: true,
      grain: false,
    });
  });
});
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run lib/cafe/choreo.test.ts lib/cafe/quality.test.ts`
Expected: FAIL, missing exports / module.

- [ ] **Step 3: Implement**

Append to `lib/cafe/choreo.ts`:

```ts
export const ROAST_GREEN = "#7a9a3a";
export const ROAST_DARK = "#3b2314";

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Bean colour as it roasts: green at 0, dark roast at 1. */
export function roastColor(t: number): string {
  const x = clamp01(t);
  const a = hexToRgb(ROAST_GREEN);
  const b = hexToRgb(ROAST_DARK);
  const mix = a.map((v, i) => Math.round(v + (b[i] - v) * x));
  return `#${mix.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export const CONVEYOR_START = -2.2;
export const CONVEYOR_END = 2.2;

/** A bean's x on the belt: starts at `offset` and travels one belt length. */
export function beanX(t: number, offset: number): number {
  const span = CONVEYOR_END - CONVEYOR_START;
  const along = (offset + clamp01(t)) % 1;
  return CONVEYOR_START + along * span;
}

/** 1 = tray still outside the case, 0 = in place. */
export function trayOffset(t: number, index: number, count: number): number {
  return 1 - easeInOut(stagger(t, index, count));
}

export function receiptLength(t: number): number {
  return easeInOut(t);
}
```

Create `lib/cafe/quality.ts`:

```ts
// Render quality (spec section 3, "Performance"). Phone light 3D and slow
// devices drop to DPR 1 with no post-processing; a decline is sticky so
// quality never flickers back. Reduced motion turns off the animated grain.

export type Quality = { dpr: [number, number]; effects: boolean; grain: boolean };

export function qualityFor(opts: {
  light: boolean;
  declined: boolean;
  reduced: boolean;
}): Quality {
  if (opts.light || opts.declined) return { dpr: [1, 1], effects: false, grain: false };
  return { dpr: [1, 2], effects: true, grain: !opts.reduced };
}
```

- [ ] **Step 4: Run them to see them pass**

Run: `npx vitest run lib/cafe/choreo.test.ts lib/cafe/quality.test.ts`,
then `npm test && npx tsc --noEmit`.

- [ ] **Step 5: Commit**

```bash
git add lib/cafe/choreo.ts lib/cafe/choreo.test.ts lib/cafe/quality.ts lib/cafe/quality.test.ts
git commit -m "feat: add roastery, specials, receipt and quality math" -m "The last three stations' motion and the render-quality rules are pure and tested, so they reverse on scroll and the phone and slow-device limits from the spec are pinned." -m "Verification: choreo and quality tests pass, tsc clean."
```

---

### Task 2: Roastery and checkout stations

**Files:**
- Create: `components/cafe/stations/roastery.tsx`,
  `components/cafe/stations/checkout.tsx`
- Modify: `components/cafe/scene.tsx`

**Interfaces:**
- Consumes: `Toon`, `Ink` (`components/cafe/kit.tsx`); `dwellT`,
  `stagger`, `roastColor`, `beanX`, `receiptLength` (Task 1);
  `getProgress`; `experienceData`, `personalInfo`.
- Produces: default exports `Roastery()` and `Checkout()`. `scene.tsx`
  adds `"roastery"` and `"checkout"` to `BUILT` and renders both.

- [ ] **Step 1: Create `components/cafe/stations/roastery.tsx`**

```tsx
"use client";

// ============================================================
// STATION 5: ROASTERY
// ============================================================
// Beans ride a conveyor and roast from green to dark as the visitor
// scrolls; each job is one batch label along the belt (spec station 5).
// ============================================================

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { Color, Object3D, type InstancedMesh } from "three";
import { Ink, Toon } from "@/components/cafe/kit";
import { experienceData } from "@/data/portfolio";
import { CONVEYOR_END, CONVEYOR_START, beanX, dwellT, roastColor, stagger } from "@/lib/cafe/choreo";
import { getProgress } from "@/lib/cafe/scroll";
import { STATIONS } from "@/lib/cafe/stations";

const RZ = STATIONS.find((s) => s.id === "roastery")!.camera.target[2];
const BEANS = 48;
const BELT_Y = 0.55;

export default function Roastery() {
  const beans = useRef<InstancedMesh>(null);
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  const dummy = useMemo(() => new Object3D(), []);
  const color = useMemo(() => new Color(), []);
  const offsets = useMemo(() => Array.from({ length: BEANS }, (_, i) => i / BEANS), []);

  useLayoutEffect(() => {
    // Instance colours must exist before the first frame sets them.
    beans.current?.setColorAt(0, color.set(roastColor(0)));
  }, [color]);

  useFrame(() => {
    const t = dwellT(getProgress(), "roastery");
    const mesh = beans.current;
    if (mesh) {
      offsets.forEach((offset, i) => {
        const x = beanX(t, offset);
        dummy.position.set(x, BELT_Y + 0.06, (i % 3) * 0.12 - 0.12);
        dummy.rotation.set(0, i, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        const along = (x - CONVEYOR_START) / (CONVEYOR_END - CONVEYOR_START);
        mesh.setColorAt(i, color.set(roastColor(along)));
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
    labels.current.forEach((el, i) => {
      if (el) el.style.opacity = String(stagger(t, i, experienceData.length));
    });
  });

  // The conveyor runs across the roastery target, facing its camera.
  return (
    <group position={[0, 0, RZ]}>
      <mesh position={[0, BELT_Y / 2, 0]}>
        <boxGeometry args={[CONVEYOR_END - CONVEYOR_START + 0.4, BELT_Y, 0.5]} />
        <Toon color="#2b1a10" />
        <Ink />
      </mesh>
      <instancedMesh ref={beans} args={[undefined, undefined, BEANS]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshToonMaterial />
      </instancedMesh>
      {experienceData.map((e, i) => (
        <Html
          key={e.title}
          transform
          distanceFactor={3}
          position={[CONVEYOR_START + ((i + 0.5) / experienceData.length) * (CONVEYOR_END - CONVEYOR_START), 1.4, 0]}
          className="pointer-events-none"
        >
          <div
            ref={(el) => {
              labels.current[i] = el;
            }}
            style={{ opacity: 0 }}
            className="font-receipt w-[200px] rounded-sm bg-[#f6ead8] p-2 text-center text-[11px] leading-tight text-[#1b120c]"
          >
            <strong className="block">{e.title}</strong>
            {e.organization}
            <br />
            {e.period}
          </div>
        </Html>
      ))}
    </group>
  );
}
```

- [ ] **Step 2: Create `components/cafe/stations/checkout.tsx`**

```tsx
"use client";

// ============================================================
// STATION 7: CHECKOUT
// ============================================================
// The register prints a receipt with the contact details as the visitor
// scrolls in; the tip jar points at the socials (spec station 7). Visual
// only: the links live in the Quick Order menu.
// ============================================================

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { Ink, Toon } from "@/components/cafe/kit";
import { personalInfo } from "@/data/portfolio";
import { dwellT, receiptLength } from "@/lib/cafe/choreo";
import { getProgress } from "@/lib/cafe/scroll";
import { STATIONS, stationYaw } from "@/lib/cafe/stations";

const [CX, , CZ] = STATIONS.find((s) => s.id === "checkout")!.camera.target;
const RECEIPT_HEIGHT = 0.9;

export default function Checkout() {
  const paper = useRef<Group>(null);
  const text = useRef<HTMLDivElement>(null);

  useFrame(() => {
    const len = receiptLength(dwellT(getProgress(), "checkout"));
    if (paper.current) {
      paper.current.scale.y = Math.max(len, 0.001);
      paper.current.visible = len > 0;
    }
    if (text.current) text.current.style.clipPath = `inset(0 0 ${(1 - len) * 100}% 0)`;
  });

  // The register stands at the checkout target, facing its camera.
  return (
    <group position={[CX, 0, CZ]} rotation={[0, stationYaw("checkout"), 0]}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.4, 1, 0.8]} />
        <Toon color="#7a4a2a" />
        <Ink />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[0.6, 0.3, 0.4]} />
        <Toon color="#2b1a10" />
        <Ink />
      </mesh>
      {/* Receipt hangs from the printer slot; scale.y grows it downward. */}
      <group ref={paper} position={[0, 1.3, 0.21]}>
        <mesh position={[0, -RECEIPT_HEIGHT / 2, 0]}>
          <planeGeometry args={[0.4, RECEIPT_HEIGHT]} />
          <Toon color="#fbf6ee" />
        </mesh>
      </group>
      <Html transform position={[0, 1.3 - RECEIPT_HEIGHT / 2, 0.23]} distanceFactor={1.4} className="pointer-events-none">
        <div ref={text} style={{ clipPath: "inset(0 0 100% 0)" }} className="font-receipt w-[150px] text-[9px] leading-snug text-[#1b120c]">
          <p className="text-center font-bold">THANK YOU</p>
          <p>{personalInfo.email}</p>
          <p>{personalInfo.github.replace("https://", "")}</p>
          <p>linkedin.com/in/…</p>
          <p className="mt-1 text-center">Come again ☕</p>
        </div>
      </Html>
      <mesh position={[0.5, 1.12, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.25, 16, 1, true]} />
        <Toon color="#f6ead8" transparent opacity={0.35} />
      </mesh>
      <Html transform position={[0.5, 1.4, 0]} distanceFactor={1.4} className="font-chalk pointer-events-none text-sm whitespace-nowrap text-[#f5e9da]">
        Tips → GitHub · LinkedIn
      </Html>
    </group>
  );
}
```

- [ ] **Step 3: Wire both into `components/cafe/scene.tsx`**

Import `Roastery` and `Checkout`. Add `"roastery"` and `"checkout"` to
`BUILT`. Render `<Roastery />` and `<Checkout />` next to the other
stations in `PlaceholderShop`.

- [ ] **Step 4: Verify**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`.

- [ ] **Step 5: Commit**

```bash
git add components/cafe/stations/roastery.tsx components/cafe/stations/checkout.tsx components/cafe/scene.tsx
git commit -m "feat: build the roastery and checkout stations" -m "Beans roast from green to dark along the conveyor with one batch label per job, and the register prints a receipt with the contact details (spec stations 5 and 7). Both reverse when scrolling back." -m "Verification: tests, tsc, lint and build green."
```

---

### Task 3: Specials case with live repos

**Files:**
- Create: `components/cafe/stations/specials.tsx`
- Modify: `app/cafe/page.tsx`, `components/cafe/cafe-shell.tsx`,
  `components/cafe/scene.tsx`

**Interfaces:**
- Consumes: `trayOffset`, `dwellT` (Task 1); `GithubRepo`;
  `selectSpecials` output already computed in `app/cafe/page.tsx`.
- Produces:
  - `type SpecialItem = { id: number; name: string; language: string | null }`
    exported from `components/cafe/stations/specials.tsx`
  - `Specials({ items }: { items: SpecialItem[] })`
  - `CafeShell({ children, specials }: { children: ReactNode; specials: SpecialItem[] })`
  - `CafeScene({ cut, specials, light, onReady }: { cut: boolean; specials: SpecialItem[]; light: boolean; onReady?: () => void })`
    (`onReady` already exists from step 3a; keep passing it to `<Canvas onCreated>`)
    (`light` is used in Task 4; add it now and pass it through)

- [ ] **Step 1: Create `components/cafe/stations/specials.tsx`**

```tsx
"use client";

// ============================================================
// STATION 6: TODAY'S SPECIALS
// ============================================================
// A lit pastry case. Recent GitHub repos slide in on trays as the visitor
// scrolls in; with none, a "Sold out" sign (spec station 6, section 5).
// ============================================================

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, PointLight } from "three";
import { Ink, Toon } from "@/components/cafe/kit";
import { dwellT, trayOffset } from "@/lib/cafe/choreo";
import { getProgress } from "@/lib/cafe/scroll";
import { STATIONS, stationYaw } from "@/lib/cafe/stations";

const [SX, , SZ] = STATIONS.find((s) => s.id === "specials")!.camera.target;
const CASE_X = SX + 0.4;
const CASE_Z = SZ;

export type SpecialItem = { id: number; name: string; language: string | null };

/** Tray slot i: two shelves of three, in case space (front faces +z). */
function slot(i: number): [number, number, number] {
  return [((i % 3) - 1) * 0.7, i < 3 ? 0.95 : 0.45, 0];
}

export default function Specials({ items }: { items: SpecialItem[] }) {
  const trays = useRef<(Group | null)[]>([]);
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  const light = useRef<PointLight>(null);

  useFrame(() => {
    const t = dwellT(getProgress(), "specials");
    if (light.current) light.current.intensity = 3 * t;
    trays.current.forEach((g, i) => {
      if (!g) return;
      const out = trayOffset(t, i, items.length);
      const [x, y, z] = slot(i);
      g.position.set(x + out * 2.5, y, z);
      g.visible = out < 1;
      // drei Html ignores the parent's visible flag, so hide the label too.
      const label = labels.current[i];
      if (label) label.style.visibility = out < 1 ? "visible" : "hidden";
    });
  });

  // The case stands just behind the specials target, facing its camera.
  return (
    <group position={[CASE_X, 0, CASE_Z]} rotation={[0, stationYaw("specials"), 0]}>
      <mesh position={[0, 0.7, -0.3]}>
        <boxGeometry args={[2.3, 1.4, 0.1]} />
        <Toon color="#5a3620" />
        <Ink />
      </mesh>
      {[0.3, 0.8].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[2.3, 0.05, 0.6]} />
          <Toon color="#8a5a3b" />
          <Ink />
        </mesh>
      ))}
      <pointLight ref={light} position={[0, 1.3, 0.4]} intensity={0} color="#ffd9a0" distance={3} />
      {items.length === 0 ? (
        <Html transform position={[0, 0.7, 0.2]} distanceFactor={2} className="font-chalk pointer-events-none text-3xl whitespace-nowrap text-[#ffb36b]">
          Sold out — check back soon
        </Html>
      ) : (
        items.map((item, i) => (
          <group
            key={item.id}
            ref={(g) => {
              trays.current[i] = g;
            }}
          >
            <mesh>
              <boxGeometry args={[0.6, 0.06, 0.4]} />
              <Toon color="#f6ead8" />
              <Ink />
            </mesh>
            <Html transform position={[0, 0.16, 0.1]} distanceFactor={1.4} className="pointer-events-none">
              <div
                ref={(el) => {
                  labels.current[i] = el;
                }}
                style={{ visibility: "hidden" }}
                className="font-receipt w-[120px] text-center text-[10px] leading-tight text-[#f5e9da]"
              >
                <strong className="block">{item.name}</strong>
                {item.language ?? ""}
              </div>
            </Html>
          </group>
        ))
      )}
    </group>
  );
}
```

- [ ] **Step 2: Pass specials from the page**

In `app/cafe/page.tsx`, pass the list to the shell:

```tsx
  return (
    <CafeShell specials={specials.map((r) => ({ id: r.id, name: r.displayName, language: r.language }))}>
      <QuickOrderMenu specials={specials} />
    </CafeShell>
  );
```

- [ ] **Step 3: Thread it through the shell and scene**

In `components/cafe/cafe-shell.tsx`:
- Import `type SpecialItem` from `@/components/cafe/stations/specials`.
- Change the props to `{ children, specials }: { children: ReactNode; specials: SpecialItem[] }`.
- Add `specials={specials}` and `light={Boolean(caps?.phone)}` to the existing `<CafeScene … />` element, keeping its current props (`cut`, `onReady`).

In `components/cafe/scene.tsx`:
- Import `Specials` and `type SpecialItem`.
- Add `specials: SpecialItem[]` and `light: boolean` to `CafeScene`'s props, keeping `cut` and `onReady`.
- Pass `specials` down to `PlaceholderShop`, render `<Specials items={specials} />`, and add `"specials"` to `BUILT`.
- Accept `light` but leave it unused until Task 4. Prefix it as `_light` if lint complains about an unused variable.

- [ ] **Step 4: Verify**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`.

- [ ] **Step 5: Commit**

```bash
git add components/cafe/stations/specials.tsx app/cafe/page.tsx components/cafe/cafe-shell.tsx components/cafe/scene.tsx
git commit -m "feat: build the specials case with live repos" -m "Recent GitHub repos slide into a lit pastry case on trays, or a sold-out sign shows when GitHub returns nothing (spec station 6 and section 5). The server page passes a small serialisable list to the scene." -m "Verification: tests, tsc, lint and build green."
```

---

### Task 4: Glow, grain and quality scaling

**Files:**
- Create: `components/cafe/effects.tsx`
- Modify: `components/cafe/scene.tsx`, `package.json`, `package-lock.json`

**Interfaces:**
- Consumes: `qualityFor` (Task 1); `light` prop (Task 3); `cut` (the
  reduced-motion flag).
- Produces: default export `Effects({ grain }: { grain: boolean })`.

- [ ] **Step 1: Install**

```bash
npm install @react-three/postprocessing postprocessing
```

If a peer conflict appears, report it rather than forcing.

- [ ] **Step 2: Create `components/cafe/effects.tsx`**

```tsx
"use client";

// Warm bloom on the lights, a soft vignette, and film grain (spec section
// 3). Grain animates every frame, so reduced motion turns it off.

import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";

export default function Effects({ grain }: { grain: boolean }) {
  return (
    <EffectComposer>
      <Bloom intensity={0.6} luminanceThreshold={0.8} mipmapBlur />
      <Vignette darkness={0.5} />
      {grain ? <Noise opacity={0.06} /> : <></>}
    </EffectComposer>
  );
}
```

- [ ] **Step 3: Apply quality in `components/cafe/scene.tsx`**

- Import `PerformanceMonitor` from `@react-three/drei`, `useState` from
  react, `Effects` from `@/components/cafe/effects`, and `qualityFor` from
  `@/lib/cafe/quality`.
- Inside `CafeScene`:

```tsx
  const [declined, setDeclined] = useState(false);
  const quality = qualityFor({ light, declined, reduced: cut });
```

- On `<Canvas>`, set `dpr={quality.dpr}`.
- As the first child of `<Canvas>`, add
  `<PerformanceMonitor onDecline={() => setDeclined(true)} />`. Set
  `declined` only to `true`, never back to false: the decline is sticky.
- As the last child of `<Canvas>`, add
  `{quality.effects && <Effects grain={quality.grain} />}`.

- [ ] **Step 4: Verify**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`.
Confirm bundle isolation:

```bash
grep -rl "@react-three/postprocessing" app components lib --include=*.ts --include=*.tsx
```

Expected: only `components/cafe/effects.tsx`.

- [ ] **Step 5: Commit**

```bash
git add components/cafe/effects.tsx components/cafe/scene.tsx package.json package-lock.json
git commit -m "feat: add glow, grain and quality scaling" -m "Bloom, vignette and film grain give the café its warm look, while phones in light 3D and slow devices drop to DPR 1 without effects, and reduced motion drops the animated grain (spec section 3, Performance)." -m "Verification: tests, tsc, lint and build green; postprocessing only imported by effects.tsx."
```

---

### Task 5: Push and PR

- [ ] Trailer scan: `git log origin/main..HEAD --format="%h|%s|%(trailers:key=Co-authored-by,valueonly)"` shows an empty third column.
- [ ] `git push -u origin feat/cafe-stations-b`
- [ ] `gh pr create --base feat/cafe-stations-a --head feat/cafe-stations-b --title "feat: roastery, specials, checkout and glow at /cafe (build step 3b)"`, with a body covering why, what was verified, and what is not in it. No attribution footer.
- [ ] Hand back the PR and preview URLs. Merging needs the user's yes.
