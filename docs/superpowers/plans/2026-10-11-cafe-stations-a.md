# Café Stations A: Intro, Storefront, Menu Board, Wall (Build Step 3a) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace four placeholder stations with their real scroll
choreography: the intro (station 0), the storefront door, the chalk menu
board with the "Barista of the Month" portrait, and the wall of fame.

**Architecture:** Every animation is a pure function of scroll progress in
`lib/cafe/choreo.ts` (unit-tested), read each frame inside `useFrame`, so
scrolling back reverses it with no stored state. Each station is its own
component in `components/cafe/stations/`. Shared toon helpers move to
`components/cafe/kit.tsx`. The intro is an HTML overlay mounted by
`CafeShell` only in café mode.

**Tech Stack:** R3F 9.8, drei 10.7 (`Html`, `useTexture`, `useProgress`,
`Outlines`), three 0.185, Tailwind v4, vitest 3.

**Spec:** `docs/superpowers/specs/2026-10-11-coffee-shop-portfolio-design.md`
(section 2 stations 0–2 and 4, decision "Reduced motion", build step 3).

**Scope:** Build step 3, first half. Step 3b (roastery, specials case,
checkout, bloom and grain, performance scaling) is a separate plan.

**Base branch:** `feat/cafe-toon` (step 2, PR not yet merged). Branch
`feat/cafe-stations-a` from it.

**Deviation from the spec:** the spec's intro has "steam particles form the
name". This plan shows CSS steam plus the name in chalk. The particle swarm
code in `lib/particle-shapes.ts` is the user's untracked work in progress,
so this plan does not depend on it. Cost if wrong: the intro can swap in the
swarm later without touching the gauge or the session logic.

## Global Constraints

- Animations depend only on scroll progress, except the intro timer, the
  rain, and the CSS steam. Reduced motion: rain is static, steam does not
  animate, the intro is shorter (1200 ms instead of 2400 ms), and it still
  plays (spec decision Q3 and commit `8b5b0dc`).
- Station animations run inside each station's dwell zone (the first
  `DWELL` of its slice), using `dwellT(progress, id)`.
- The intro plays once per browser session (`sessionStorage` key
  `cafe-intro-seen`), is skippable, and never plays when the URL has a
  station or project hash.
- The intro gauge shows real loading progress from drei `useProgress`, and
  takes at least the minimum duration.
- 3D text uses drei `<Html transform>` inside the canvas wrapper, which is
  already `aria-hidden`. The server-rendered Quick Order menu stays the
  accessible content.
- Toon look everywhere: `meshToonMaterial` with `toonGradient()` and
  `<Outlines>` from `components/cafe/kit.tsx`.
- `/` and the `/cafe` menu modes keep working; `npm run build` green after
  every task.
- Commits follow `.claude/skills/git-operations/SKILL.md`. **No
  `Co-Authored-By` trailer or attribution footer.** Do not stage
  `lib/particle-shapes.ts` or `.superpowers/`.

## Review Focus

1. **Scrolling back up** through each station reverses the animation
   (door closes, chalk un-writes, frames swing out). Pinned in Task 1:
   every choreo function is pure in progress.
2. **Deep link** `/cafe#wall` must skip the intro. Pinned in Task 1
   (`shouldPlayIntro`).
3. **sessionStorage unavailable** (Safari private mode, blocked storage):
   the intro plays and nothing throws. Pinned in Task 1 with a throwing
   storage stub.
4. **Nothing to load** (`useProgress` total 0): the gauge still reaches
   100% after the minimum time instead of hanging. Pinned in Task 1
   (`gaugeValue` with `loaded = null`).
5. **A missing portrait image:** the menu board must still render. Pinned
   in Task 3: the portrait sits in its own `Suspense` + error boundary.

---

## File Structure

| File | Responsibility |
|---|---|
| `lib/cafe/choreo.ts` | Pure easing, stagger, dwell, door and frame angles, gauge value |
| `lib/cafe/choreo.test.ts` | Tests |
| `lib/cafe/intro.ts` | `shouldPlayIntro`, `markIntroSeen` (storage-safe) |
| `lib/cafe/intro.test.ts` | Tests |
| `components/cafe/kit.tsx` | `Toon` material and `Ink` outline helpers |
| `components/cafe/stations/storefront.tsx` | Facade, door, sign, rain |
| `components/cafe/stations/menu-board.tsx` | Chalk board, line reveal, portrait |
| `components/cafe/stations/wall.tsx` | Achievement frames that swing in |
| `components/cafe/scene.tsx` (modify) | Use kit; render real stations, placeholders for the rest |
| `components/cafe/intro.tsx` | Intro overlay |
| `components/cafe/cafe-shell.tsx` (modify) | Mount the intro in café mode |
| `app/globals.css` (modify) | `cafe-steam` keyframes |

---

### Task 1: Choreography and intro logic

**Files:**
- Create: `lib/cafe/choreo.ts`, `lib/cafe/choreo.test.ts`,
  `lib/cafe/intro.ts`, `lib/cafe/intro.test.ts`

**Interfaces:**
- Produces (`lib/cafe/choreo.ts`):
  - `clamp01(v: number): number`
  - `easeInOut(t: number): number`, `easeOutBack(t: number): number`
  - `stagger(t: number, index: number, count: number): number`
  - `dwellT(progress: number, id: StationId): number`
  - `DOOR_OPEN = 1.9`, `doorAngle(t: number): number`
  - `FRAME_SWING = 1.2`, `frameAngle(t: number, index: number, count: number): number`
  - `gaugeValue(elapsedMs: number, minMs: number, loadedPct: number | null): number`
- Produces (`lib/cafe/intro.ts`):
  - `INTRO_KEY = "cafe-intro-seen"`
  - `type StorageLike = Pick<Storage, "getItem" | "setItem">`
  - `shouldPlayIntro(hash: string, storage: StorageLike | null): boolean`
  - `markIntroSeen(storage: StorageLike | null): void`

- [ ] **Step 1: Write the failing tests**

`lib/cafe/choreo.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  DOOR_OPEN,
  FRAME_SWING,
  clamp01,
  doorAngle,
  dwellT,
  easeInOut,
  easeOutBack,
  frameAngle,
  gaugeValue,
  stagger,
} from "@/lib/cafe/choreo";
import { DWELL, STATIONS, stationRange } from "@/lib/cafe/stations";

describe("easing", () => {
  it("starts at 0 and ends at 1", () => {
    for (const f of [easeInOut, easeOutBack]) {
      expect(f(0)).toBeCloseTo(0);
      expect(f(1)).toBeCloseTo(1);
    }
  });
  it("easeOutBack overshoots before settling", () => {
    expect(Math.max(...[0.6, 0.7, 0.8, 0.9].map(easeOutBack))).toBeGreaterThan(1);
  });
  it("clamps", () => {
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(2)).toBe(1);
  });
});

describe("stagger", () => {
  it("runs items one after another", () => {
    expect(stagger(0.25, 0, 2)).toBeCloseTo(0.5);
    expect(stagger(0.25, 1, 2)).toBe(0);
    expect(stagger(0.75, 1, 2)).toBeCloseTo(0.5);
    expect(stagger(1, 1, 2)).toBe(1);
  });
  it("is 0 for no items", () => {
    expect(stagger(0.5, 0, 0)).toBe(0);
  });
});

describe("dwellT", () => {
  const i = STATIONS.findIndex((s) => s.id === "wall");
  const [start, end] = stationRange(i);
  it("goes 0 to 1 across the station's dwell zone only", () => {
    expect(dwellT(start, "wall")).toBe(0);
    expect(dwellT(start + (DWELL / 2) * (end - start), "wall")).toBeCloseTo(0.5);
    expect(dwellT(end, "wall")).toBe(1);
    expect(dwellT(start - 0.01, "wall")).toBe(0);
  });
});

describe("doorAngle", () => {
  it("is shut at 0, fully open at 1, and reverses", () => {
    expect(doorAngle(0)).toBe(0);
    expect(doorAngle(1)).toBeCloseTo(DOOR_OPEN);
    expect(doorAngle(0.3)).toBeLessThan(doorAngle(0.6));
  });
});

describe("frameAngle", () => {
  it("starts tilted out and settles flat, in order", () => {
    expect(frameAngle(0, 0, 3)).toBeCloseTo(FRAME_SWING);
    expect(frameAngle(1, 2, 3)).toBeCloseTo(0);
    expect(frameAngle(0.2, 2, 3)).toBeCloseTo(FRAME_SWING);
  });
});

describe("gaugeValue", () => {
  it("waits for both the minimum time and the loading", () => {
    expect(gaugeValue(1200, 2400, 100)).toBeCloseTo(0.5);
    expect(gaugeValue(3000, 2400, 40)).toBeCloseTo(0.4);
    expect(gaugeValue(3000, 2400, 100)).toBe(1);
  });
  it("finishes on time when nothing loads", () => {
    expect(gaugeValue(2400, 2400, null)).toBe(1);
    expect(gaugeValue(600, 2400, null)).toBeCloseTo(0.25);
  });
});
```

`lib/cafe/intro.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { INTRO_KEY, markIntroSeen, shouldPlayIntro, type StorageLike } from "@/lib/cafe/intro";

function memory(): StorageLike & { data: Record<string, string> } {
  const data: Record<string, string> = {};
  return {
    data,
    getItem: (k) => data[k] ?? null,
    setItem: (k, v) => {
      data[k] = v;
    },
  };
}

const broken: StorageLike = {
  getItem: () => {
    throw new Error("blocked");
  },
  setItem: () => {
    throw new Error("blocked");
  },
};

describe("shouldPlayIntro", () => {
  it("plays on a first visit with no hash", () => {
    expect(shouldPlayIntro("", memory())).toBe(true);
  });
  it("skips after it was seen this session", () => {
    const s = memory();
    markIntroSeen(s);
    expect(s.data[INTRO_KEY]).toBe("1");
    expect(shouldPlayIntro("", s)).toBe(false);
  });
  it("skips for station and project deep links, not unknown hashes", () => {
    expect(shouldPlayIntro("#wall", memory())).toBe(false);
    expect(shouldPlayIntro("#kislap", memory())).toBe(false);
    expect(shouldPlayIntro("#foo", memory())).toBe(true);
  });
  it("still plays, and never throws, when storage is blocked or missing", () => {
    expect(shouldPlayIntro("", broken)).toBe(true);
    expect(shouldPlayIntro("", null)).toBe(true);
    expect(() => markIntroSeen(broken)).not.toThrow();
    expect(() => markIntroSeen(null)).not.toThrow();
  });
});
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run lib/cafe/choreo.test.ts lib/cafe/intro.test.ts`
Expected: FAIL, imports not found.

- [ ] **Step 3: Implement `lib/cafe/choreo.ts`**

```ts
// ============================================================
// CHOREOGRAPHY
// ============================================================
// Every station animation is a pure function of scroll progress, so
// scrolling back plays it in reverse with no stored state. Stations play
// inside their dwell zone, while the camera holds still on them.
// ============================================================

import { DWELL, stationProgress, type StationId } from "@/lib/cafe/stations";

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function easeInOut(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2;
}

export function easeOutBack(t: number): number {
  const x = clamp01(t);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2;
}

/** Item `index` of `count` plays its own slice of t, one after another. */
export function stagger(t: number, index: number, count: number): number {
  if (count <= 0) return 0;
  return clamp01(clamp01(t) * count - index);
}

/** 0..1 across a station's dwell zone. */
export function dwellT(progress: number, id: StationId): number {
  return clamp01(stationProgress(progress, id) / DWELL);
}

export const DOOR_OPEN = 1.9;

export function doorAngle(t: number): number {
  return easeInOut(t) * DOOR_OPEN;
}

export const FRAME_SWING = 1.2;

export function frameAngle(t: number, index: number, count: number): number {
  return (1 - easeOutBack(stagger(t, index, count))) * FRAME_SWING;
}

/** Intro gauge: done only when the minimum time passed AND loading finished. */
export function gaugeValue(elapsedMs: number, minMs: number, loadedPct: number | null): number {
  const time = clamp01(elapsedMs / minMs);
  const loaded = loadedPct === null ? 1 : clamp01(loadedPct / 100);
  return Math.min(time, loaded);
}
```

- [ ] **Step 4: Implement `lib/cafe/intro.ts`**

```ts
// Once-per-session intro rules (spec station 0). Storage can be blocked
// (private mode), so every access is guarded and the intro defaults to
// playing.

import { resolveHash } from "@/lib/cafe/stations";

export const INTRO_KEY = "cafe-intro-seen";

export type StorageLike = Pick<Storage, "getItem" | "setItem">;

export function shouldPlayIntro(hash: string, storage: StorageLike | null): boolean {
  if (resolveHash(hash)) return false;
  try {
    return storage?.getItem(INTRO_KEY) !== "1";
  } catch {
    return true;
  }
}

export function markIntroSeen(storage: StorageLike | null): void {
  try {
    storage?.setItem(INTRO_KEY, "1");
  } catch {
    // Blocked storage: the intro will simply play again next time.
  }
}
```

- [ ] **Step 5: Run them to see them pass**

Run: `npx vitest run lib/cafe/choreo.test.ts lib/cafe/intro.test.ts`
Expected: all pass. Then `npm test && npx tsc --noEmit`.

- [ ] **Step 6: Commit**

```bash
git add lib/cafe/choreo.ts lib/cafe/choreo.test.ts lib/cafe/intro.ts lib/cafe/intro.test.ts
git commit -m "feat: add station choreography and intro rules" -m "Station animations are pure functions of scroll progress so they reverse when scrolling back, and the intro's once-per-session, deep-link and blocked-storage rules are tested (spec station 0)." -m "Verification: choreo and intro tests pass, tsc clean."
```

---

### Task 2: Kit and storefront

**Files:**
- Create: `components/cafe/kit.tsx`, `components/cafe/stations/storefront.tsx`
- Modify: `components/cafe/scene.tsx`

**Interfaces:**
- Consumes: `toonGradient`, `INK`, `OUTLINE_THICKNESS`; `doorAngle`,
  `dwellT` (Task 1); `getProgress`; `personalInfo`.
- Produces:
  - `kit.tsx`: `Toon({ color, transparent?, opacity? })` (a
    `meshToonMaterial` element), `Ink()` (an `Outlines` element)
  - `storefront.tsx`: default export `Storefront({ reduced }: { reduced: boolean })`
  - `scene.tsx`: renders `<Storefront>` instead of the storefront
    placeholder box; `CafeScene` signature unchanged.

- [ ] **Step 1: Create `components/cafe/kit.tsx`**

```tsx
"use client";

// Shared toon helpers: every café mesh uses the same banded material and
// ink outline, so the style is set in one place.

import { Outlines } from "@react-three/drei";
import { INK, OUTLINE_THICKNESS, toonGradient } from "@/components/cafe/materials/toon";

export function Toon({
  color,
  transparent = false,
  opacity = 1,
}: {
  color: string;
  transparent?: boolean;
  opacity?: number;
}) {
  return (
    <meshToonMaterial
      color={color}
      gradientMap={toonGradient()}
      transparent={transparent}
      opacity={opacity}
    />
  );
}

export function Ink() {
  return <Outlines thickness={OUTLINE_THICKNESS} color={INK} />;
}
```

- [ ] **Step 2: Create `components/cafe/stations/storefront.tsx`**

```tsx
"use client";

// ============================================================
// STATION 1: STOREFRONT
// ============================================================
// A rainy night street. The door swings inward while the camera holds at
// the storefront, and warm light shows through. Rain falls in real time;
// with reduced motion it stays still.
// ============================================================

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { BufferAttribute, Group } from "three";
import { Ink, Toon } from "@/components/cafe/kit";
import { personalInfo } from "@/data/portfolio";
import { doorAngle, dwellT } from "@/lib/cafe/choreo";
import { getProgress } from "@/lib/cafe/scroll";

const RAIN_COUNT = 400;
const RAIN_TOP = 8;

function Rain({ reduced }: { reduced: boolean }) {
  const positions = useMemo(() => {
    const p = new Float32Array(RAIN_COUNT * 3);
    for (let i = 0; i < RAIN_COUNT; i++) {
      p[i * 3] = (Math.random() - 0.5) * 12;
      p[i * 3 + 1] = Math.random() * RAIN_TOP;
      p[i * 3 + 2] = 1 + Math.random() * 9;
    }
    return p;
  }, []);
  const attr = useRef<BufferAttribute>(null);

  useFrame((_, delta) => {
    if (reduced || !attr.current) return;
    const arr = attr.current.array as Float32Array;
    for (let i = 0; i < RAIN_COUNT; i++) {
      const y = arr[i * 3 + 1] - delta * 6;
      arr[i * 3 + 1] = y < 0 ? RAIN_TOP : y;
    }
    attr.current.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute ref={attr} attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#9fb4c7" size={0.04} transparent opacity={0.6} />
    </points>
  );
}

export default function Storefront({ reduced }: { reduced: boolean }) {
  const door = useRef<Group>(null);

  useFrame(() => {
    if (door.current) door.current.rotation.y = doorAngle(dwellT(getProgress(), "storefront"));
  });

  return (
    <group>
      {/* Facade: two walls and a lintel around a 1 × 2.2 doorway. */}
      <mesh position={[-1.6, 1.4, 0]}>
        <boxGeometry args={[2.2, 2.8, 0.3]} />
        <Toon color="#5a3620" />
        <Ink />
      </mesh>
      <mesh position={[1.6, 1.4, 0]}>
        <boxGeometry args={[2.2, 2.8, 0.3]} />
        <Toon color="#5a3620" />
        <Ink />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[1, 0.6, 0.3]} />
        <Toon color="#5a3620" />
        <Ink />
      </mesh>
      {/* Warm light behind the door. */}
      <mesh position={[0, 1.1, -0.3]}>
        <planeGeometry args={[1, 2.2]} />
        <meshBasicMaterial color="#ffb36b" />
      </mesh>
      {/* Door, hinged on its left edge; positive rotation swings it inward. */}
      <group ref={door} position={[-0.5, 0, 0.05]}>
        <mesh position={[0.5, 1.1, 0]}>
          <boxGeometry args={[1, 2.2, 0.08]} />
          <Toon color="#3d5a40" />
          <Ink />
        </mesh>
      </group>
      <Html transform position={[0, 3.3, 0.2]} distanceFactor={4} className="font-chalk pointer-events-none text-5xl whitespace-nowrap text-[#ffb36b]">
        {personalInfo.firstName}&apos;s Café
      </Html>
      <Rain reduced={reduced} />
    </group>
  );
}
```

- [ ] **Step 3: Wire the storefront into `components/cafe/scene.tsx`**

Make these edits:
1. Delete the local `Ink` function and the `Outlines` import. Add
   `import { Ink, Toon } from "@/components/cafe/kit";` and
   `import Storefront from "@/components/cafe/stations/storefront";`.
2. Replace every plain `<meshToonMaterial color={X} gradientMap={toonGradient()} />`
   (floor, placeholder boxes) with `<Toon color={X} />`, and the glass's
   material with `<Toon color="#f6ead8" transparent opacity={0.25} />`.
   **Keep** the liquid surface disc's `meshToonMaterial` as it is: it holds
   a `ref` whose colour is updated every frame, and `<Toon>` does not
   forward refs. Keep `toonGradient` imported for it.
3. Add `const BUILT = new Set<string>(["storefront"]);` at module level. In
   `PlaceholderShop`, render the placeholder box and label only for
   stations not in `BUILT`.
4. Pass `reduced` down: change `PlaceholderShop` to take
   `{ reduced }: { reduced: boolean }`, render `<Storefront reduced={reduced} />`
   inside it, and in `CafeScene` render `<PlaceholderShop reduced={cut} />`
   (`cut` is the reduced-motion flag the shell already passes).

- [ ] **Step 4: Verify**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: all green.

- [ ] **Step 5: Commit**

```bash
git add components/cafe/kit.tsx components/cafe/stations/storefront.tsx components/cafe/scene.tsx
git commit -m "feat: build the storefront station" -m "The first station the visitor sees: a rainy street, a door that swings open as they scroll in, and warm light inside (spec station 1). Toon helpers move to a shared kit so every station uses one material and outline." -m "Verification: tests, tsc, lint and build green."
```

---

### Task 3: Menu board and wall of fame

**Files:**
- Create: `components/cafe/stations/menu-board.tsx`,
  `components/cafe/stations/wall.tsx`
- Modify: `components/cafe/scene.tsx`

**Interfaces:**
- Consumes: `Toon`, `Ink` (Task 2); `dwellT`, `stagger`, `frameAngle`
  (Task 1); `getProgress`; `personalInfo`, `skillsData`, `tierLabels`,
  `achievementsData`, `type SkillTier`.
- Produces: default exports `MenuBoard()` and `Wall()`. `scene.tsx`
  renders both and adds `"menu-board"` and `"wall"` to `BUILT`.

- [ ] **Step 1: Create `components/cafe/stations/menu-board.tsx`**

```tsx
"use client";

// ============================================================
// STATION 2: MENU BOARD
// ============================================================
// A chalkboard: the tagline and the three skill tiers write themselves on,
// line by line, while the camera holds here. Beside it hangs the
// "Barista of the Month" portrait. Text is visual only; the Quick Order
// menu carries the readable copy.
// ============================================================

import { Html, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Component, Suspense, useRef, type ReactNode } from "react";
import { Ink, Toon } from "@/components/cafe/kit";
import { personalInfo, skillsData, tierLabels, type SkillTier } from "@/data/portfolio";
import { dwellT, stagger } from "@/lib/cafe/choreo";
import { getProgress } from "@/lib/cafe/scroll";

const TIERS: SkillTier[] = ["house", "seasonal", "experimental"];

const LINES = [
  personalInfo.tagline,
  ...TIERS.map(
    (tier) =>
      `${tierLabels[tier]}: ${skillsData
        .flatMap((c) => c.skills)
        .filter((s) => s.tier === tier)
        .map((s) => s.name)
        .join(" · ")}`,
  ),
];

// Board centre; the camera looks at [0, 2.6, -4].
const BOARD: [number, number, number] = [0, 2.6, -4.3];

function Portrait() {
  const texture = useTexture(personalInfo.heroImage);
  return (
    <mesh position={[0, 0, 0.03]}>
      <planeGeometry args={[0.8, 0.8]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

/** A missing photo must not take the board down with it. */
class PortraitBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function MenuBoard() {
  const lines = useRef<(HTMLSpanElement | null)[]>([]);

  useFrame(() => {
    const t = dwellT(getProgress(), "menu-board");
    lines.current.forEach((el, i) => {
      if (!el) return;
      const shown = stagger(t, i, LINES.length);
      el.style.clipPath = `inset(0 ${(1 - shown) * 100}% 0 0)`;
    });
  });

  return (
    <group position={BOARD}>
      <mesh>
        <boxGeometry args={[3.4, 2.2, 0.08]} />
        <Toon color="#5a3620" />
        <Ink />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[3.2, 2]} />
        <Toon color="#23352a" />
      </mesh>
      <Html transform position={[0, 0, 0.06]} distanceFactor={2.2} className="pointer-events-none">
        <div className="font-chalk w-[560px] text-[#f5e9da]">
          <p className="mb-3 text-center text-4xl">Menu</p>
          {LINES.map((line, i) => (
            <span
              key={line}
              ref={(el) => {
                lines.current[i] = el;
              }}
              className="mb-2 block text-xl leading-snug"
              style={{ clipPath: "inset(0 100% 0 0)" }}
            >
              {line}
            </span>
          ))}
        </div>
      </Html>
      <group position={[2.4, 0, 0.05]}>
        <mesh>
          <boxGeometry args={[0.95, 0.95, 0.06]} />
          <Toon color="#c9a227" />
          <Ink />
        </mesh>
        <PortraitBoundary>
          <Suspense fallback={null}>
            <Portrait />
          </Suspense>
        </PortraitBoundary>
        <Html transform position={[0, -0.62, 0.05]} distanceFactor={2.2} className="font-receipt pointer-events-none text-xs whitespace-nowrap text-[#f5e9da]">
          Barista of the Month
        </Html>
      </group>
    </group>
  );
}
```

- [ ] **Step 2: Create `components/cafe/stations/wall.tsx`**

```tsx
"use client";

// ============================================================
// STATION 4: WALL OF FAME
// ============================================================
// Every achievement hangs in a frame on the wall. While the camera holds
// here, the frames swing in one after another and settle on their nails.
// ============================================================

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { Ink, Toon } from "@/components/cafe/kit";
import { achievementsData, type Achievement } from "@/data/portfolio";
import { dwellT, frameAngle } from "@/lib/cafe/choreo";
import { getProgress } from "@/lib/cafe/scroll";

const TIER_COLORS: Record<Achievement["tier"], string> = {
  gold: "#c9a227",
  silver: "#b8b8b8",
  bronze: "#a0643c",
  special: "#7b4fa0",
};

const COLS = 4;

/** Nail position for frame i, in wall space (wall faces +z). */
function nail(i: number): [number, number, number] {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  return [(col - (COLS - 1) / 2) * 1.25, 1.0 - row * 0.85, 0.05];
}

export default function Wall() {
  const frames = useRef<(Group | null)[]>([]);
  const count = achievementsData.length;

  useFrame(() => {
    const t = dwellT(getProgress(), "wall");
    frames.current.forEach((g, i) => {
      if (!g) return;
      g.rotation.x = -frameAngle(t, i, count);
      g.visible = t * count > i;
    });
  });

  // The camera looks along -x at [-6, 1.8, 0], so the wall stands at
  // x = -6.4 and faces +x.
  return (
    <group position={[-6.4, 1.8, 0]} rotation={[0, Math.PI / 2, 0]}>
      <mesh>
        <planeGeometry args={[6, 3.2]} />
        <Toon color="#7a4a2a" />
      </mesh>
      {achievementsData.map((a, i) => (
        <group
          key={a.title}
          position={nail(i)}
          ref={(g) => {
            frames.current[i] = g;
          }}
        >
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[1.05, 0.6, 0.05]} />
            <Toon color={TIER_COLORS[a.tier]} />
            <Ink />
          </mesh>
          <Html transform position={[0, -0.3, 0.04]} distanceFactor={1.6} className="pointer-events-none">
            <div className="font-receipt w-[220px] text-center text-[11px] leading-tight text-[#1b120c]">
              <strong className="block">{a.title}</strong>
              {a.year}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}
```

- [ ] **Step 3: Wire both into `components/cafe/scene.tsx`**

Import `MenuBoard` and `Wall`. Add `"menu-board"` and `"wall"` to `BUILT`.
Render `<MenuBoard />` and `<Wall />` next to `<Storefront>` in
`PlaceholderShop`.

- [ ] **Step 4: Verify**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: all green.

- [ ] **Step 5: Commit**

```bash
git add components/cafe/stations/menu-board.tsx components/cafe/stations/wall.tsx components/cafe/scene.tsx
git commit -m "feat: build the menu board and wall of fame" -m "The menu board writes the tagline and skill tiers on in chalk beside the Barista of the Month portrait, and the wall's achievement frames swing in one by one (spec stations 2 and 4). Both reverse when scrolling back." -m "Verification: tests, tsc, lint and build green."
```

---

### Task 4: Intro overlay

**Files:**
- Create: `components/cafe/intro.tsx`
- Modify: `components/cafe/cafe-shell.tsx`, `app/globals.css`

**Interfaces:**
- Consumes: `gaugeValue` (Task 1); `shouldPlayIntro`, `markIntroSeen`
  (Task 1); drei `useProgress` (zustand store: `useProgress.getState()`
  returns `{ active, total, progress }`); `personalInfo`.
- Produces: default export `Intro({ reduced }: { reduced: boolean })`,
  rendered by `CafeShell` in café mode.

- [ ] **Step 1: Add the steam keyframes to `app/globals.css`**

Append at the end of the file:

```css
/* Café intro: steam rising from the cup. Used with motion-safe: only. */
@keyframes cafe-steam {
  0% { transform: translateY(0) scaleX(1); opacity: 0; }
  30% { opacity: 0.7; }
  100% { transform: translateY(-60px) scaleX(1.6); opacity: 0; }
}
```

- [ ] **Step 2: Create `components/cafe/intro.tsx`**

```tsx
"use client";

// ============================================================
// INTRO (station 0)
// ============================================================
// The espresso machine warms up: its pressure gauge follows real asset
// loading (drei useProgress), never finishing before a minimum time so the
// moment registers. Plays once per session, never on deep links, and can
// be skipped. Mounted only in café mode, so it never renders on the server.
// ============================================================

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { personalInfo } from "@/data/portfolio";
import { gaugeValue } from "@/lib/cafe/choreo";
import { markIntroSeen, shouldPlayIntro } from "@/lib/cafe/intro";

function storage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export default function Intro({ reduced }: { reduced: boolean }) {
  const [show, setShow] = useState(() => shouldPlayIntro(window.location.hash, storage()));
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!show) return;
    const minMs = reduced ? 1200 : 2400;
    const start = performance.now();
    let frame = 0;
    const tick = () => {
      const { active, total, progress } = useProgress.getState();
      const loaded = total === 0 && !active ? null : progress;
      const v = gaugeValue(performance.now() - start, minMs, loaded);
      setValue(v);
      if (v >= 1) {
        markIntroSeen(storage());
        setShow(false);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [show, reduced]);

  if (!show) return null;

  const needle = -90 + 180 * value;
  const skip = () => {
    markIntroSeen(storage());
    setShow(false);
  };

  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-[#1b120c] text-[#f5e9da]">
      <div aria-hidden className="relative h-24 w-40">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute bottom-0 h-10 w-4 rounded-full bg-[#f5e9da]/40 blur-sm motion-safe:animate-[cafe-steam_2.4s_ease-in-out_infinite]"
            style={{ left: `${40 + i * 30}%`, animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </div>
      <svg viewBox="0 0 120 70" width="180" aria-hidden>
        <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="#f5e9da" strokeWidth="4" />
        <line
          x1="60"
          y1="60"
          x2="60"
          y2="18"
          stroke="#ffb36b"
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${needle} 60 60)`}
        />
        <circle cx="60" cy="60" r="5" fill="#ffb36b" />
      </svg>
      <p className="font-chalk mt-4 text-5xl">{personalInfo.name}</p>
      <p className="font-receipt mt-1 text-sm">{personalInfo.role}</p>
      <p role="status" className="font-receipt mt-4 text-xs">
        Brewing… {Math.round(value * 100)}%
      </p>
      <button
        type="button"
        onClick={skip}
        className="font-receipt mt-6 rounded-sm border border-[#f5e9da]/40 px-4 py-2 text-sm"
      >
        Skip intro
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Mount it in `components/cafe/cafe-shell.tsx`**

Import `Intro` from `@/components/cafe/intro`. In the café-mode return
(the `<div onClick={onLinkClick}>` branch), add `<Intro reduced={reduced} />`
as the last child.

- [ ] **Step 4: Verify**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: all green. If `react-hooks` lint flags the `useState` initializer
reading `window`, keep it: `Intro` only mounts on the client in café mode.
Add a one-line `// eslint-disable-next-line` with that reason only if the
rule is an error.

- [ ] **Step 5: Commit**

```bash
git add components/cafe/intro.tsx components/cafe/cafe-shell.tsx app/globals.css
git commit -m "feat: add the espresso machine intro" -m "A short intro whose pressure gauge follows real loading, plays once per session, skips on deep links, and can be skipped (spec station 0). Reduced motion shortens it and stills the steam, and it still plays as decided." -m "Verification: tests, tsc, lint and build green."
```

---

### Task 5: Push and PR

- [ ] Trailer scan: `git log origin/main..HEAD --format="%h|%s|%(trailers:key=Co-authored-by,valueonly)"` shows an empty third column.
- [ ] `git push -u origin feat/cafe-stations-a`
- [ ] `gh pr create --base feat/cafe-toon --head feat/cafe-stations-a --title "feat: intro, storefront, menu board and wall at /cafe (build step 3a)"`, with a body covering why, what was verified, the intro deviation, and what is not in it (step 3b). No attribution footer.
- [ ] Hand back the PR and preview URLs. Merging needs the user's yes.
