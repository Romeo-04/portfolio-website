# Café Foundation (Build Step 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship build step 1 of the coffee shop portfolio: data changes,
dead-code removal, and a hidden `/cafe` route with a placeholder 3D shop, a
scroll-driven camera rail, hash links, and the server-rendered Quick Order
menu.

**Architecture:** Pure logic (stations, camera pose, drinks, specials, mode)
lives in small `lib/cafe/*` modules with unit tests. A module-level scroll
store (same pattern as `lib/theme.ts`) is the only source of scroll truth.
`app/cafe/page.tsx` is a Server Component that renders the Quick Order menu
as real HTML, and a client `CafeShell` decides whether the visitor gets the
3D café, the menu as a page, or the "closed" fallback.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4,
`three`, `@react-three/fiber`, `@react-three/drei`, `lenis`, `vitest`.

**Spec:** `docs/superpowers/specs/2026-10-11-coffee-shop-portfolio-design.md`

**Scope:** This plan is build step 1 only (spec section 7). Steps 2–6 (toon
material and pour shader, station animations, HUD and secret drink, Blender
models, launch) each get their own plan. Deliberately not in this plan:
`components/cafe/model.tsx` (step 5), GSAP and post-processing (steps 2–3),
HUD (step 4), removal of `Project.image` and Flow State (step 6).

**Two deliberate deviations from the spec's unit list:**
- The spec's `lib/cafe/motion.ts` is folded into `cameraPose(p, { cut })`
  and `startScroll({ smooth })`. Reduced motion is two flags, not a module.
- The spec's `specialsExclude` list is the existing GitHub exclusion list
  moved into `data/portfolio.ts` as `githubExclude`, so the Flow State grid
  and the specials case share one list instead of two.

## Global Constraints

- Flow State at `/` must keep working until launch. Every task ends with
  `npm run build` green, and `/` still renders.
- `/cafe` is `noindex, nofollow` and is not in `sitemap.xml`.
- Exactly 4 signature drinks (`featured: true`): `kislap`, `kitako`,
  `archeon`, `citysense-live-geo`.
- Skills use `tier: "house" | "seasonal" | "experimental"`. No numeric levels.
- Roles: Kislap "Lead Developer · team of 4"; Archeon "Lead Developer ·
  Cognee hackathon team of 4". Archeon demo
  `https://kishiagaytano.github.io/archeon/`.
- Phones get the menu as the page, with a "Step inside the café" button.
  Reduced motion gets the café with cuts instead of glides.
- No WebGL → menu as the page with the note "The café is closed today ☕".
- Commits follow `.claude/skills/git-operations/SKILL.md`: tagged titles, a
  WHY body, a verification line, and **no `Co-Authored-By` trailer or
  attribution footer**.
- Do not stage `lib/particle-shapes.ts`. It is the user's work in progress.
- Work on branch `feat/cafe-foundation`. Merging to `main` needs the user's
  explicit yes.

## Review Focus

1. **Unknown or stale hash** (`/cafe#foo`, `/cafe#trackhab`): no crash. An
   unknown hash is ignored; any project slug goes to the brew bar. Pinned in
   Task 3 (`resolveHash`).
2. **GitHub API down or rate-limited:** `/cafe` still builds and renders,
   and the specials section shows "Sold out". Pinned in Task 6 (menu test
   with `specials={[]}`).
3. **No WebGL:** the menu is the page with the closed note, and no 3D chunk
   loads. Pinned in Task 5 (`resolveMode`).
4. **Page not taller than the viewport** (zoomed-out or very tall
   screens): scroll progress must be `0`, not `NaN`. Pinned in Task 3
   (`progressFromScroll`).
5. **Project with an empty `techStack`, unknown technologies, or an empty
   `demoUrl`:** the drink still has at least one layer, and the ticket shows
   no empty link. Pinned in Task 4 (`drinkFor`) and Task 6 (menu test).

---

## File Structure

| File | Responsibility |
|---|---|
| `vitest.config.ts` | Test runner config (`@` alias, node env) |
| `data/portfolio.ts` (modify) | Skill tiers, signature drinks, Kislap, KitaKo and Archeon updates, `githubExclude`, `Project.drink` override |
| `data/portfolio.test.ts` | Data invariants from the spec |
| `components/sections/skills.tsx` (modify) | Flow State: stop showing `skill.level` |
| `lib/github.ts` (modify) | Read the exclusion list from `data/portfolio.ts` |
| `lib/cafe/stations.ts` | Station registry, progress math, camera pose, hash resolution |
| `lib/cafe/stations.test.ts` | Tests for the above |
| `lib/cafe/drinks.ts` | Project → drink (cup, layers, mark) |
| `lib/cafe/drinks.test.ts` | Tests |
| `lib/cafe/specials.ts` | Choose the 6 specials repos |
| `lib/cafe/specials.test.ts` | Tests |
| `lib/cafe/mode.ts` | Choose cafe / menu / closed; WebGL and phone detection |
| `lib/cafe/mode.test.ts` | Tests |
| `lib/cafe/scroll.ts` | Client scroll store: Lenis, progress, `goTo` |
| `components/menu/drink-illustration.tsx` | 2D SVG drink |
| `components/menu/drink-illustration.test.tsx` | Tests |
| `components/menu/quick-order.tsx` | Server-rendered menu with all content |
| `components/menu/quick-order.test.tsx` | Content-completeness tests |
| `components/cafe/cafe-shell.tsx` | Client: mode, drawer, phone button, link handling, scroll start |
| `components/cafe/scene.tsx` | Canvas, lights, camera rig, placeholder shop |
| `app/cafe/layout.tsx` | Café fonts and colours |
| `app/cafe/page.tsx` | `/cafe` route, `noindex`, fetches specials |
| `app/globals.css` (modify) | `font-chalk`, `font-receipt`, `font-cafe` utilities |

---

### Task 0: Branch

- [ ] **Step 1: Make sure the spec and plan are on `main`**

The spec and this plan are on branch `docs/coffee-shop-portfolio-spec`.
If that branch is not merged yet, ask the user to merge it (or approve the
merge) first.

```bash
git checkout main && git pull --ff-only
git checkout -b feat/cafe-foundation
```

Expected: `git log -1` shows the docs merge, and `git status` lists only
`?? lib/particle-shapes.ts`.

---

### Task 1: Test runner and data changes

**Files:**
- Create: `vitest.config.ts`, `data/portfolio.test.ts`
- Modify: `package.json` (scripts, devDependencies), `data/portfolio.ts`,
  `components/sections/skills.tsx:34`

**Interfaces:**
- Produces (in `data/portfolio.ts`):
  - `export type SkillTier = "house" | "seasonal" | "experimental";`
  - `export interface Skill { name: string; tier: SkillTier }`
  - `export const tierLabels: Record<SkillTier, string>`
  - `Project.drink?: DrinkOverride` (type from `lib/cafe/drinks.ts`, Task 4;
    in this task declare it as shown below to avoid a forward dependency)
  - `export const githubExclude: string[]`

- [ ] **Step 1: Install vitest and add the script**

```bash
npm install -D vitest
```

In `package.json` `scripts`, add `"test": "vitest run"`.

Create `vitest.config.ts`:

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**"],
  },
});
```

- [ ] **Step 2: Write the failing data tests**

Create `data/portfolio.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { githubExclude, projectsData, skillsData } from "@/data/portfolio";

describe("portfolio data", () => {
  it("has exactly the four signature drinks", () => {
    const signature = projectsData
      .filter((p) => p.featured)
      .map((p) => p.slug)
      .sort();
    expect(signature).toEqual([
      "archeon",
      "citysense-live-geo",
      "kislap",
      "kitako",
    ]);
  });

  it("has unique slugs", () => {
    const slugs = projectsData.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("puts every skill in a tier and has no numeric levels", () => {
    for (const category of skillsData) {
      for (const skill of category.skills) {
        expect(["house", "seasonal", "experimental"]).toContain(skill.tier);
        expect(skill).not.toHaveProperty("level");
      }
    }
  });

  it("gives Archeon its live demo and lead role", () => {
    const archeon = projectsData.find((p) => p.slug === "archeon");
    expect(archeon?.demoUrl).toBe("https://kishiagaytano.github.io/archeon/");
    expect(archeon?.role).toBe("Lead Developer · Cognee hackathon team of 4");
  });

  it("adds Kislap as a team-led project with both links", () => {
    const kislap = projectsData.find((p) => p.slug === "kislap");
    expect(kislap?.role).toBe("Lead Developer · team of 4");
    expect(kislap?.demoUrl).toBe("https://romeo-04.github.io/kislap/");
    expect(kislap?.repoUrl).toBe("https://github.com/Romeo-04/kislap");
  });

  it("keeps the exclusion list lower-case", () => {
    for (const name of githubExclude) expect(name).toBe(name.toLowerCase());
  });
});
```

- [ ] **Step 3: Run the tests to see them fail**

Run: `npm test`
Expected: FAIL. `githubExclude` is not exported, the signature list is
wrong, skills have `level`, Kislap is missing.

- [ ] **Step 4: Change the skill model**

In `data/portfolio.ts`, replace the `Skill` interface with:

```ts
export type SkillTier = "house" | "seasonal" | "experimental";

export interface Skill {
  name: string;
  tier: SkillTier;
}

export const tierLabels: Record<SkillTier, string> = {
  house: "House Blend",
  seasonal: "Seasonal",
  experimental: "Experimental",
};
```

Then, in `skillsData`, replace every `level: <number>` with the tier from
this table (spec 2.1):

| tier | skills |
|---|---|
| `"house"` | Python, TypeScript, JavaScript, React.js, Next.js, Tailwind CSS, HTML / CSS, SQL, PostgreSQL, Git / GitHub, Vercel |
| `"seasonal"` | Node.js, Prisma ORM, Supabase, MySQL, SQLite, Java, C++, NumPy, Pandas, Jupyter Notebook |
| `"experimental"` | PyTorch, Scikit-learn, Matplotlib, MATLAB |

Example: `{ name: "Python", level: 90 },` becomes
`{ name: "Python", tier: "house" },`.

In `components/sections/skills.tsx` line 34, replace

```tsx
                  {skill.name} <span className="text-beam">{skill.level}</span>
```

with

```tsx
                  {skill.name}
```

- [ ] **Step 5: Add the drink override field and the exclusion list**

In the `Project` interface, add after `image`:

```ts
  /** Optional hand-picked drink. Otherwise derived from techStack. */
  drink?: {
    cup?: "glass" | "mug" | "cup";
    layers?: { name: string; color: string }[];
  };
```

Near the top of `data/portfolio.ts`, after `personalInfo`, add:

```ts
// --- GitHub exclusions ---
// Repos hidden from the GitHub grid and the café's specials case: the
// profile config repo, this site, practice and coursework repos. Lower-case.
export const githubExclude: string[] = [
  "romeo-04",
  "portfolio-website",
  "learn-git",
  "my-first-repo",
  "webdev_practice",
  "github-copilot-practice",
  "neetcode-submissions",
  "leetcodesolutions",
  "star-sight", // duplicate push of STARSight; "datara" is the featured copy
];
```

- [ ] **Step 6: Update signature drinks and project entries**

In `projectsData`:
- Set `featured: false` on every project except `citysense-live-geo`,
  `archeon` and `kitako`, which get `featured: true`.
- Archeon: `role: "Lead Developer · Cognee hackathon team of 4"`,
  `demoUrl: "https://kishiagaytano.github.io/archeon/"`.
- KitaKo: replace `pitch` and `description` with:

```ts
    pitch:
      "Undergraduate thesis research on the linguistic and cultural gaps in artificial intelligence, presented through a public showcase site.",
    description: [
      "Thesis research on linguistic and cultural gaps in AI systems, carried out with an undergraduate research team",
      "Contributed to the research behind the study, which the team presents to a public audience",
      "The showcase website was built by a teammate with React 19, Vite, Express, and a shadcn-style component system",
    ],
```

- Append Kislap as the last entry (next free `id` is 11):

```ts
  {
    id: 11,
    title: "Kislap",
    slug: "kislap",
    pitch:
      "Free reading game for Filipino children in Grades 1–3. A speech model runs on the child's own device and checks each word they read aloud.",
    description: [
      "Built a read-aloud game where children read a short story sentence by sentence while Ningning the firefly reacts and awards stars and stickers",
      "Runs speech recognition in the browser with Transformers.js, so no audio leaves the device and it works on a family phone",
      "Saves missed words for practice and shows them in syllables, aimed at the 91% of Filipino ten-year-olds who cannot read a simple text (World Bank, 2026)",
      "Ships as an installable PWA for Chrome on laptops and Android phones",
    ],
    techStack: ["React", "TypeScript", "Vite", "Transformers.js", "PWA"],
    category: "EdTech",
    role: "Lead Developer · team of 4",
    featured: true,
    demoUrl: "https://romeo-04.github.io/kislap/",
    repoUrl: "https://github.com/Romeo-04/kislap",
    image: "",
  },
```

- [ ] **Step 7: Point `lib/github.ts` at the shared list**

In `lib/github.ts`, delete the `EXCLUDED_REPOS` constant and its comment.
Add `import { githubExclude } from "@/data/portfolio";` at the top. Replace
`!EXCLUDED_REPOS.has(r.name.toLowerCase())` with
`!githubExclude.includes(r.name.toLowerCase())`.

- [ ] **Step 8: Run tests, types, lint, build**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: 6 tests pass; tsc clean; lint shows only the existing
`Login.jsx` warning; build green.

- [ ] **Step 9: Commit**

```bash
git add vitest.config.ts package.json package-lock.json data/portfolio.ts data/portfolio.test.ts components/sections/skills.tsx lib/github.ts
git commit -m "feat: move portfolio data to café signature drinks and skill tiers" -m "The café shows four signature drinks and skill tiers instead of self-rated percentages (spec 2.1, 2.2). Kislap is added, Archeon gets its live demo and its real role from commit share, and KitaKo leads with the research. The GitHub exclusion list moves to data so the grid and the specials case share one list. vitest is added for the café's pure logic." -m "Verification: 6/6 tests, tsc clean, lint clean, build green."
```

---

### Task 2: Remove dead auth code

**Files:**
- Delete: `components/auth/`, `components/context/AuthProvider.jsx`,
  `hooks/useAuth.js`, `api/client.js`, and any `components/ui/*` file that
  only these used
- Modify: `package.json` (remove now-unused dependencies)

- [ ] **Step 1: Confirm nothing outside the auth code uses it**

```bash
grep -rlE "supabase|useAuth|AuthProvider|components/auth|api/client" app components hooks lib data --include=*.ts --include=*.tsx --include=*.js --include=*.jsx
```

Expected: only `api/client.js`, `components/auth/*`,
`components/context/AuthProvider.jsx`, `hooks/useAuth.js`. If anything else
appears, stop and report it.

- [ ] **Step 2: Delete the auth files**

```bash
git rm -r components/auth components/context/AuthProvider.jsx hooks/useAuth.js api/client.js
```

- [ ] **Step 3: Find UI components that are now unused**

```bash
for f in components/ui/*.tsx; do n=$(basename "$f" .tsx); echo "$n: $(grep -rlE "components/ui/$n['\"]" app components hooks lib | wc -l)"; done
```

Delete (`git rm`) every `components/ui/<name>.tsx` that reports `0`.

- [ ] **Step 4: Remove dependencies that are now unused**

For each of `@supabase/supabase-js`, `sonner`, `@radix-ui/react-label`,
`@radix-ui/react-tabs`, `@radix-ui/react-slot`, `class-variance-authority`:

```bash
grep -rl "<package-name>" app components hooks lib
```

If it returns nothing, run `npm uninstall <package-name>`. Keep any package
that still has a user.

- [ ] **Step 5: Verify**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: all green. The `Login.jsx` lint warning is gone.

- [ ] **Step 6: Commit**

```bash
git add -A components hooks api package.json package-lock.json
git status --short   # must not list lib/particle-shapes.ts as staged
git commit -m "chore: remove unused Supabase auth code" -m "No page imports the auth components, the AuthProvider, or the Supabase client, so they only added weight and lint noise. Git history keeps them (spec decision: dead code)." -m "Verification: tests, tsc, lint and build green."
```

---

### Task 3: Station registry, progress math, camera pose, hash links

**Files:**
- Create: `lib/cafe/stations.ts`, `lib/cafe/stations.test.ts`

**Interfaces:**
- Produces:
  - `type StationId = "storefront" | "menu-board" | "brew-bar" | "wall" | "roastery" | "specials" | "checkout"`
  - `type Vec3 = readonly [number, number, number]`
  - `interface Station { id: StationId; label: string; menuSection: string; camera: { position: Vec3; target: Vec3 } }`
  - `STATIONS: readonly Station[]`, `DWELL = 0.4`
  - `stationRange(index: number): [number, number]`
  - `stationIndexAt(progress: number): number`
  - `stationProgress(progress: number, id: StationId): number`
  - `stationAnchor(id: StationId): number`
  - `progressFromScroll(scrollY: number, scrollHeight: number, viewportHeight: number): number`
  - `cameraPose(progress: number, opts?: { cut?: boolean }): { position: Vec3; target: Vec3 }`
  - `resolveHash(hash: string): StationId | null`

- [ ] **Step 1: Write the failing tests**

Create `lib/cafe/stations.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  DWELL,
  STATIONS,
  cameraPose,
  progressFromScroll,
  resolveHash,
  stationAnchor,
  stationIndexAt,
  stationProgress,
  stationRange,
} from "@/lib/cafe/stations";

const n = STATIONS.length;

describe("stations", () => {
  it("lists the seven stations in journey order", () => {
    expect(STATIONS.map((s) => s.id)).toEqual([
      "storefront",
      "menu-board",
      "brew-bar",
      "wall",
      "roastery",
      "specials",
      "checkout",
    ]);
  });

  it("splits progress evenly", () => {
    expect(stationRange(0)).toEqual([0, 1 / n]);
    expect(stationRange(n - 1)[1]).toBeCloseTo(1);
  });

  it("finds the station for a progress value, clamped", () => {
    expect(stationIndexAt(0)).toBe(0);
    expect(stationIndexAt(1)).toBe(n - 1);
    expect(stationIndexAt(-5)).toBe(0);
    expect(stationIndexAt(2.5 / n)).toBe(2);
  });

  it("gives local progress 0..1 inside a station only", () => {
    expect(stationProgress(0, "menu-board")).toBe(0);
    expect(stationProgress(1.5 / n, "menu-board")).toBeCloseTo(0.5);
    expect(stationProgress(1, "menu-board")).toBe(1);
  });

  it("anchors a station inside its dwell zone", () => {
    const [start, end] = stationRange(2);
    const anchor = stationAnchor("brew-bar");
    expect(anchor).toBeGreaterThan(start);
    expect(anchor).toBeLessThan(start + DWELL * (end - start));
  });
});

describe("progressFromScroll", () => {
  it("maps scroll to 0..1", () => {
    expect(progressFromScroll(500, 2000, 1000)).toBe(0.5);
  });
  it("returns 0, not NaN, when the page is not taller than the viewport", () => {
    expect(progressFromScroll(0, 800, 800)).toBe(0);
    expect(progressFromScroll(0, 600, 800)).toBe(0);
  });
  it("clamps overscroll", () => {
    expect(progressFromScroll(5000, 2000, 1000)).toBe(1);
    expect(progressFromScroll(-50, 2000, 1000)).toBe(0);
  });
});

describe("cameraPose", () => {
  it("rests on the station during its dwell zone", () => {
    expect(cameraPose(stationAnchor("wall"))).toEqual(STATIONS[3].camera);
  });

  it("glides between stations after the dwell zone", () => {
    const [start, end] = stationRange(0);
    const mid = start + (DWELL + (1 - DWELL) / 2) * (end - start);
    const pose = cameraPose(mid);
    const a = STATIONS[0].camera.position;
    const b = STATIONS[1].camera.position;
    expect(pose.position[2]).toBeCloseTo((a[2] + b[2]) / 2);
  });

  it("cuts instead of gliding in reduced-motion mode", () => {
    const [start, end] = stationRange(0);
    const early = start + (DWELL + 0.1) * (end - start);
    const late = start + 0.9 * (end - start);
    expect(cameraPose(early, { cut: true })).toEqual(STATIONS[0].camera);
    expect(cameraPose(late, { cut: true })).toEqual(STATIONS[1].camera);
  });

  it("stays on the last station at the end", () => {
    expect(cameraPose(1)).toEqual(STATIONS[n - 1].camera);
  });
});

describe("resolveHash", () => {
  it("resolves station hashes", () => {
    expect(resolveHash("#checkout")).toBe("checkout");
    expect(resolveHash("brew-bar")).toBe("brew-bar");
  });
  it("sends any project slug to the brew bar", () => {
    expect(resolveHash("#kislap")).toBe("brew-bar");
    expect(resolveHash("#trackhab")).toBe("brew-bar");
  });
  it("ignores unknown or empty hashes", () => {
    expect(resolveHash("#foo")).toBeNull();
    expect(resolveHash("")).toBeNull();
    expect(resolveHash("#")).toBeNull();
  });
});
```

- [ ] **Step 2: Run to see it fail**

Run: `npx vitest run lib/cafe/stations.test.ts`
Expected: FAIL, "Failed to resolve import @/lib/cafe/stations".

- [ ] **Step 3: Implement**

Create `lib/cafe/stations.ts`:

```ts
// ============================================================
// CAFÉ STATIONS
// ============================================================
// Single source of truth for the café's journey: station order, the hash
// each one answers to, where the camera stands, and which Quick Order
// section mirrors it. The camera rig, the scroll store, the menu links and
// (later) the HUD all read from here, so they cannot drift apart.
//
// Progress is one number, 0..1, over the whole page. Each station owns an
// equal slice. The first DWELL of a slice holds the camera still on the
// station; the rest glides to the next one.
// ============================================================

import { projectsData } from "@/data/portfolio";

export type StationId =
  | "storefront"
  | "menu-board"
  | "brew-bar"
  | "wall"
  | "roastery"
  | "specials"
  | "checkout";

export type Vec3 = readonly [number, number, number];

export interface Station {
  id: StationId;
  label: string;
  /** id of the matching section in the Quick Order menu */
  menuSection: string;
  camera: { position: Vec3; target: Vec3 };
}

export const STATIONS: readonly Station[] = [
  {
    id: "storefront",
    label: "Storefront",
    menuSection: "menu-top",
    camera: { position: [0, 1.6, 12], target: [0, 1.5, 0] },
  },
  {
    id: "menu-board",
    label: "Menu Board",
    menuSection: "menu-about",
    camera: { position: [0, 2, 4], target: [0, 2.6, -4] },
  },
  {
    id: "brew-bar",
    label: "Brew Bar",
    menuSection: "menu-drinks",
    camera: { position: [4, 1.5, 0], target: [6, 1, -2] },
  },
  {
    id: "wall",
    label: "Wall of Fame",
    menuSection: "menu-wall",
    camera: { position: [-3, 1.8, 0], target: [-6, 1.8, 0] },
  },
  {
    id: "roastery",
    label: "Roastery",
    menuSection: "menu-roast-log",
    camera: { position: [0, 1.6, -8], target: [0, 1.2, -12] },
  },
  {
    id: "specials",
    label: "Today's Specials",
    menuSection: "menu-specials",
    camera: { position: [3, 1.2, 4], target: [5, 0.8, 4] },
  },
  {
    id: "checkout",
    label: "Checkout",
    menuSection: "menu-find-us",
    camera: { position: [-2, 1.5, 4], target: [-4, 1.1, 6] },
  },
];

/** Share of each station's slice where the camera holds still. */
export const DWELL = 0.4;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function stationRange(index: number): [number, number] {
  const span = 1 / STATIONS.length;
  return [index * span, (index + 1) * span];
}

export function stationIndexAt(progress: number): number {
  const i = Math.floor(clamp01(progress) * STATIONS.length);
  return Math.min(i, STATIONS.length - 1);
}

function indexOf(id: StationId): number {
  return STATIONS.findIndex((s) => s.id === id);
}

/** 0..1 progress inside one station's slice; 0 before it, 1 after it. */
export function stationProgress(progress: number, id: StationId): number {
  const [start, end] = stationRange(indexOf(id));
  return clamp01((progress - start) / (end - start));
}

/** The progress value where the camera rests on a station. */
export function stationAnchor(id: StationId): number {
  const [start, end] = stationRange(indexOf(id));
  return start + (DWELL / 2) * (end - start);
}

export function progressFromScroll(
  scrollY: number,
  scrollHeight: number,
  viewportHeight: number,
): number {
  const max = scrollHeight - viewportHeight;
  if (max <= 0) return 0;
  return clamp01(scrollY / max);
}

const smoothstep = (t: number) => t * t * (3 - 2 * t);

function lerp3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

export function cameraPose(
  progress: number,
  opts: { cut?: boolean } = {},
): { position: Vec3; target: Vec3 } {
  const i = stationIndexAt(progress);
  const here = STATIONS[i].camera;
  const next = STATIONS[i + 1]?.camera;
  if (!next) return here;

  const local = stationProgress(progress, STATIONS[i].id);
  if (local <= DWELL) return here;

  const t = (local - DWELL) / (1 - DWELL);
  if (opts.cut) return t < 0.5 ? here : next;

  const s = smoothstep(t);
  return {
    position: lerp3(here.position, next.position, s),
    target: lerp3(here.target, next.target, s),
  };
}

const projectSlugs = new Set(projectsData.map((p) => p.slug));

/** Map a URL hash to the station the camera should go to. */
export function resolveHash(hash: string): StationId | null {
  const key = hash.replace(/^#/, "");
  if (!key) return null;
  const station = STATIONS.find((s) => s.id === key);
  if (station) return station.id;
  if (projectSlugs.has(key)) return "brew-bar";
  return null;
}
```

- [ ] **Step 4: Run to see it pass**

Run: `npx vitest run lib/cafe/stations.test.ts`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/cafe/stations.ts lib/cafe/stations.test.ts
git commit -m "feat: add café station registry and camera pose math" -m "One registry drives the camera, the scroll store, the menu links and hash links, so they cannot disagree (spec 3, units). The pose math is pure so the dwell, glide, reduced-motion cut and hash rules are tested without a browser." -m "Verification: stations tests pass, tsc clean."
```

---

### Task 4: Drinks and the 2D drink illustration

**Files:**
- Create: `lib/cafe/drinks.ts`, `lib/cafe/drinks.test.ts`,
  `components/menu/drink-illustration.tsx`,
  `components/menu/drink-illustration.test.tsx`

**Interfaces:**
- Consumes: `Project` (with optional `drink`) from `data/portfolio.ts`.
- Produces:
  - `type CupType = "glass" | "mug" | "cup"`
  - `interface DrinkLayer { name: string; color: string }`
  - `interface Drink { cup: CupType; layers: DrinkLayer[]; mark: string }`
  - `MAX_LAYERS = 4`
  - `drinkFor(project: Pick<Project, "title" | "techStack" | "drink">): Drink`
  - `<DrinkIllustration project={Project} size?: number />` (default export)

- [ ] **Step 1: Write the failing tests**

Create `lib/cafe/drinks.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { MAX_LAYERS, drinkFor } from "@/lib/cafe/drinks";

describe("drinkFor", () => {
  it("maps known technologies to named layers in stack order", () => {
    const drink = drinkFor({ title: "Kislap", techStack: ["Python", "React"] });
    expect(drink.layers.map((l) => l.name)).toEqual(["Espresso", "Steamed milk"]);
  });

  it("matches technologies case-insensitively", () => {
    const drink = drinkFor({ title: "X", techStack: ["python"] });
    expect(drink.layers[0].name).toBe("Espresso");
  });

  it("caps layers at MAX_LAYERS and drops duplicates", () => {
    const drink = drinkFor({
      title: "Big",
      techStack: ["Python", "Python", "React", "Vite", "Node.js", "Leaflet", "Express"],
    });
    expect(drink.layers).toHaveLength(MAX_LAYERS);
    expect(new Set(drink.layers.map((l) => l.name)).size).toBe(MAX_LAYERS);
  });

  it("gives unknown technologies a stable fallback colour", () => {
    const a = drinkFor({ title: "A", techStack: ["Streamlit"] });
    const b = drinkFor({ title: "B", techStack: ["Streamlit"] });
    expect(a.layers[0].name).toBe("Streamlit");
    expect(a.layers[0].color).toBe(b.layers[0].color);
  });

  it("still pours one layer for an empty stack", () => {
    const drink = drinkFor({ title: "Empty", techStack: [] });
    expect(drink.layers).toHaveLength(1);
  });

  it("lets a hand-picked override win", () => {
    const drink = drinkFor({
      title: "Custom",
      techStack: ["Python"],
      drink: { cup: "cup", layers: [{ name: "Ube", color: "#7b4fa0" }] },
    });
    expect(drink.cup).toBe("cup");
    expect(drink.layers).toEqual([{ name: "Ube", color: "#7b4fa0" }]);
  });

  it("uses the title's first letter as the foam mark", () => {
    expect(drinkFor({ title: "archeon", techStack: [] }).mark).toBe("A");
  });
});
```

Create `components/menu/drink-illustration.test.tsx`:

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import DrinkIllustration from "@/components/menu/drink-illustration";
import { projectsData } from "@/data/portfolio";
import { drinkFor } from "@/lib/cafe/drinks";

describe("DrinkIllustration", () => {
  it("draws one band per layer and names the layers for screen readers", () => {
    const project = projectsData.find((p) => p.slug === "kislap")!;
    const html = renderToStaticMarkup(<DrinkIllustration project={project} />);
    const layers = drinkFor(project).layers;
    expect(html.match(/data-layer=/g)).toHaveLength(layers.length);
    expect(html).toContain(`aria-label="Kislap drink: ${layers.map((l) => l.name).join(", ")}"`);
  });
});
```

- [ ] **Step 2: Run to see them fail**

Run: `npx vitest run lib/cafe/drinks.test.ts components/menu/drink-illustration.test.tsx`
Expected: FAIL, imports not found.

- [ ] **Step 3: Implement `lib/cafe/drinks.ts`**

```ts
// ============================================================
// DRINKS
// ============================================================
// Every project is a drink. Its layers come from the tech stack, bottom to
// top, so the stack is visible in the cup (spec 2.2, decision Q6: automatic
// with optional per-project overrides). The 3D pour shader (step 2) and the
// 2D menu illustration both read this, never the stack directly.
// ============================================================

import type { Project } from "@/data/portfolio";

export type CupType = "glass" | "mug" | "cup";

export interface DrinkLayer {
  name: string;
  color: string;
}

export interface Drink {
  cup: CupType;
  layers: DrinkLayer[];
  mark: string;
}

export const MAX_LAYERS = 4;

const TECH_LAYERS: Record<string, DrinkLayer> = {
  python: { name: "Espresso", color: "#3b2314" },
  typescript: { name: "Dark roast", color: "#5a3620" },
  javascript: { name: "Caramel", color: "#c8873a" },
  react: { name: "Steamed milk", color: "#efe1cc" },
  "react.js": { name: "Steamed milk", color: "#efe1cc" },
  "next.js": { name: "Oat milk", color: "#e2cfae" },
  vite: { name: "Honey", color: "#e0a93b" },
  "tailwind css": { name: "Cinnamon", color: "#a0522d" },
  "node.js": { name: "Mocha", color: "#6b3e26" },
  express: { name: "Cortado", color: "#8a5a3b" },
  fastapi: { name: "Cold brew", color: "#2a1a10" },
  leaflet: { name: "Matcha", color: "#8bab5a" },
  "vue 3": { name: "Pistachio", color: "#a8c08a" },
  "transformers.js": { name: "Vanilla", color: "#f3e3b5" },
};

const FALLBACK_COLORS = ["#7a4a2a", "#b07a4f", "#d9b48a", "#9c6644"];

const HOUSE_BLEND: DrinkLayer = { name: "House blend", color: "#5a3620" };

function fallbackLayer(tech: string): DrinkLayer {
  let hash = 0;
  for (const ch of tech.toLowerCase()) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return { name: tech, color: FALLBACK_COLORS[hash % FALLBACK_COLORS.length] };
}

export function drinkFor(
  project: Pick<Project, "title" | "techStack" | "drink">,
): Drink {
  const layers: DrinkLayer[] = [];
  for (const tech of project.techStack) {
    const layer = TECH_LAYERS[tech.toLowerCase()] ?? fallbackLayer(tech);
    if (!layers.some((l) => l.name === layer.name)) layers.push(layer);
    if (layers.length === MAX_LAYERS) break;
  }
  if (layers.length === 0) layers.push(HOUSE_BLEND);

  const finalLayers = project.drink?.layers ?? layers;
  return {
    cup: project.drink?.cup ?? (finalLayers.length >= 3 ? "glass" : "mug"),
    layers: finalLayers,
    mark: project.title.charAt(0).toUpperCase(),
  };
}
```

- [ ] **Step 4: Implement `components/menu/drink-illustration.tsx`**

```tsx
import type { Project } from "@/data/portfolio";
import { drinkFor } from "@/lib/cafe/drinks";

// Flat 2D version of a project's drink for the Quick Order menu. Same data
// as the 3D cup, so the two can never show different stacks.
export default function DrinkIllustration({
  project,
  size = 64,
}: {
  project: Pick<Project, "title" | "techStack" | "drink">;
  size?: number;
}) {
  const drink = drinkFor(project);
  const top = 22;
  const bottom = 74;
  const band = (bottom - top) / drink.layers.length;
  // SVG ids can't contain spaces; titles can ("CitySense Live Geo").
  const clipId = `cup-${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <svg
      viewBox="0 0 60 80"
      width={size}
      height={(size * 80) / 60}
      role="img"
      aria-label={`${project.title} drink: ${drink.layers.map((l) => l.name).join(", ")}`}
    >
      <defs>
        <clipPath id={clipId}>
          <path d="M10 18 L50 18 L45 76 L15 76 Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {drink.layers.map((layer, i) => (
          <rect
            key={layer.name}
            data-layer={layer.name}
            x="0"
            y={bottom - band * (i + 1)}
            width="60"
            height={band + 0.5}
            fill={layer.color}
          />
        ))}
      </g>
      <path
        d="M10 18 L50 18 L45 76 L15 76 Z"
        fill="none"
        stroke="#2b1a10"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {drink.cup === "mug" && (
        <path d="M48 32 q10 0 9 12 q-1 10 -11 10" fill="none" stroke="#2b1a10" strokeWidth="2.5" />
      )}
      <ellipse cx="30" cy="18" rx="20" ry="4" fill="#f6ead8" stroke="#2b1a10" strokeWidth="2" />
      <text x="30" y="21" textAnchor="middle" fontSize="7" fontWeight="700" fill="#8a5a3b">
        {drink.mark}
      </text>
    </svg>
  );
}
```

- [ ] **Step 5: Run to see them pass**

Run: `npx vitest run lib/cafe/drinks.test.ts components/menu/drink-illustration.test.tsx`
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add lib/cafe/drinks.ts lib/cafe/drinks.test.ts components/menu/drink-illustration.tsx components/menu/drink-illustration.test.tsx
git commit -m "feat: derive each project's drink from its tech stack" -m "Screenshots are replaced by drinks everywhere (spec decision). Layers come from the stack automatically, with an optional per-project override, and the 2D menu illustration reads the same data the 3D cup will." -m "Verification: drinks and illustration tests pass, tsc clean."
```

---

### Task 5: Specials selection and display mode

**Files:**
- Create: `lib/cafe/specials.ts`, `lib/cafe/specials.test.ts`,
  `lib/cafe/mode.ts`, `lib/cafe/mode.test.ts`

**Interfaces:**
- Consumes: `GithubRepo` from `lib/github.ts`; `Project` from data.
- Produces:
  - `SPECIALS_LIMIT = 6`
  - `drinkRepoNames(projects: Pick<Project, "repoUrl">[]): string[]`
  - `selectSpecials(repos: GithubRepo[], exclude: string[], limit?: number): GithubRepo[]`
  - `type CafeMode = "cafe" | "menu" | "closed"`
  - `resolveMode(env: { webgl: boolean; phone: boolean; entered: boolean }): CafeMode`
  - `detectWebGL(): boolean`, `isPhoneViewport(): boolean` (browser only)

- [ ] **Step 1: Write the failing tests**

Create `lib/cafe/specials.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { drinkRepoNames, selectSpecials } from "@/lib/cafe/specials";
import type { GithubRepo } from "@/lib/github";

const repo = (name: string, pushedAt: string): GithubRepo => ({
  id: name.length,
  name,
  displayName: name,
  description: null,
  url: `https://github.com/Romeo-04/${name}`,
  homepage: null,
  language: null,
  topics: [],
  stars: 0,
  forks: 0,
  pushedAt,
});

describe("drinkRepoNames", () => {
  it("takes the user's own repo names from project links, lower-case", () => {
    expect(
      drinkRepoNames([
        { repoUrl: "https://github.com/Romeo-04/Kislap" },
        { repoUrl: "https://github.com/kishiagaytano/archeon" },
        { repoUrl: "" },
      ]),
    ).toEqual(["kislap"]);
  });
});

describe("selectSpecials", () => {
  const repos = [
    repo("old", "2025-01-01T00:00:00Z"),
    repo("kislap", "2026-10-10T00:00:00Z"),
    repo("tessera", "2026-10-04T00:00:00Z"),
    repo("sakto", "2026-09-05T00:00:00Z"),
  ];

  it("shows the most recently pushed first and hides drink repos", () => {
    expect(selectSpecials(repos, ["kislap"]).map((r) => r.name)).toEqual([
      "tessera",
      "sakto",
      "old",
    ]);
  });

  it("respects the limit", () => {
    expect(selectSpecials(repos, [], 2)).toHaveLength(2);
  });

  it("returns an empty list when GitHub returned nothing", () => {
    expect(selectSpecials([], ["kislap"])).toEqual([]);
  });
});
```

Create `lib/cafe/mode.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { resolveMode } from "@/lib/cafe/mode";

describe("resolveMode", () => {
  it("closes the café without WebGL, even if the visitor asked to enter", () => {
    expect(resolveMode({ webgl: false, phone: false, entered: false })).toBe("closed");
    expect(resolveMode({ webgl: false, phone: true, entered: true })).toBe("closed");
  });
  it("shows the menu on phones until the visitor steps inside", () => {
    expect(resolveMode({ webgl: true, phone: true, entered: false })).toBe("menu");
    expect(resolveMode({ webgl: true, phone: true, entered: true })).toBe("cafe");
  });
  it("opens the café on desktop", () => {
    expect(resolveMode({ webgl: true, phone: false, entered: false })).toBe("cafe");
  });
});
```

- [ ] **Step 2: Run to see them fail**

Run: `npx vitest run lib/cafe/specials.test.ts lib/cafe/mode.test.ts`
Expected: FAIL, imports not found.

- [ ] **Step 3: Implement `lib/cafe/specials.ts`**

```ts
import type { Project } from "@/data/portfolio";
import { GITHUB_USERNAME, type GithubRepo } from "@/lib/github";

// "Fresh from the oven": the most recently pushed repos that are not
// already on the menu as drinks (spec 2.4). The general exclusion list is
// applied earlier, in getGithubRepos.

export const SPECIALS_LIMIT = 6;

export function drinkRepoNames(projects: Pick<Project, "repoUrl">[]): string[] {
  const prefix = `https://github.com/${GITHUB_USERNAME}/`.toLowerCase();
  return projects
    .map((p) => p.repoUrl.toLowerCase())
    .filter((url) => url.startsWith(prefix))
    .map((url) => url.slice(prefix.length).replace(/\/+$/, ""));
}

export function selectSpecials(
  repos: GithubRepo[],
  exclude: string[],
  limit = SPECIALS_LIMIT,
): GithubRepo[] {
  const hidden = new Set(exclude.map((n) => n.toLowerCase()));
  return repos
    .filter((r) => !hidden.has(r.name.toLowerCase()))
    .sort((a, b) => Date.parse(b.pushedAt) - Date.parse(a.pushedAt))
    .slice(0, limit);
}
```

- [ ] **Step 4: Implement `lib/cafe/mode.ts`**

```ts
// Which version of the café a visitor gets (spec decisions Q2, section 5).
// resolveMode is pure; the two detectors only run in the browser.

export type CafeMode = "cafe" | "menu" | "closed";

export function resolveMode(env: {
  webgl: boolean;
  phone: boolean;
  entered: boolean;
}): CafeMode {
  if (!env.webgl) return "closed";
  if (env.phone && !env.entered) return "menu";
  return "cafe";
}

export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function isPhoneViewport(): boolean {
  return window.matchMedia("(max-width: 767px)").matches;
}
```

- [ ] **Step 5: Run to see them pass**

Run: `npx vitest run lib/cafe/specials.test.ts lib/cafe/mode.test.ts`
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add lib/cafe/specials.ts lib/cafe/specials.test.ts lib/cafe/mode.ts lib/cafe/mode.test.ts
git commit -m "feat: choose café specials and display mode" -m "The specials case shows recent repos that are not already drinks (spec 2.4). resolveMode encodes who gets the 3D café, the menu, or the closed fallback (spec Q2 and section 5) so the rule is tested, not scattered through components." -m "Verification: specials and mode tests pass, tsc clean."
```

---

### Task 6: Quick Order menu

**Files:**
- Create: `components/menu/quick-order.tsx`,
  `components/menu/quick-order.test.tsx`

**Interfaces:**
- Consumes: data exports, `tierLabels`, `STATIONS`, `DrinkIllustration`,
  `GithubRepo`.
- Produces: `<QuickOrderMenu specials={GithubRepo[]} />` (default export,
  synchronous Server Component). Section ids: `menu-top`, `menu-drinks`,
  `menu-shelf`, `menu-about`, `menu-ingredients`, `menu-roast-log`,
  `menu-wall`, `menu-specials`, `menu-find-us`. Station links are
  `<a href="#<station-id>">`.

- [ ] **Step 1: Write the failing test**

Create `components/menu/quick-order.test.tsx`:

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import QuickOrderMenu from "@/components/menu/quick-order";
import {
  achievementsData,
  experienceData,
  personalInfo,
  projectsData,
  skillsData,
} from "@/data/portfolio";
import type { GithubRepo } from "@/lib/github";

const decode = (html: string) =>
  html.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');

describe("QuickOrderMenu", () => {
  const html = decode(renderToStaticMarkup(<QuickOrderMenu specials={[]} />));

  it("contains every project, role, skill and achievement as text", () => {
    for (const p of projectsData) expect(html).toContain(p.title);
    for (const e of experienceData) expect(html).toContain(e.title);
    for (const a of achievementsData) expect(html).toContain(a.title);
    for (const c of skillsData) for (const s of c.skills) expect(html).toContain(s.name);
  });

  it("contains the contact details", () => {
    expect(html).toContain(personalInfo.email);
    expect(html).toContain(personalInfo.github);
    expect(html).toContain(personalInfo.linkedin);
  });

  it("lists signature drinks before the shelf", () => {
    expect(html.indexOf('id="menu-drinks"')).toBeLessThan(html.indexOf('id="menu-shelf"'));
    const kislapAt = html.indexOf("Kislap");
    expect(kislapAt).toBeLessThan(html.indexOf('id="menu-shelf"'));
  });

  it("never renders an empty link", () => {
    expect(html).not.toContain('href=""');
  });

  it("shows sold out when there are no specials", () => {
    expect(html).toContain("Sold out");
  });

  it("lists specials when GitHub answers", () => {
    const repo: GithubRepo = {
      id: 1, name: "tessera", displayName: "Tessera", description: "A thing",
      url: "https://github.com/Romeo-04/tessera", homepage: null, language: "Python",
      topics: [], stars: 0, forks: 0, pushedAt: "2026-10-04T00:00:00Z",
    };
    const withRepo = renderToStaticMarkup(<QuickOrderMenu specials={[repo]} />);
    expect(withRepo).toContain("Tessera");
    expect(withRepo).not.toContain("Sold out");
  });
});
```

- [ ] **Step 2: Run to see it fail**

Run: `npx vitest run components/menu/quick-order.test.tsx`
Expected: FAIL, import not found.

- [ ] **Step 3: Implement**

Create `components/menu/quick-order.tsx`:

```tsx
import DrinkIllustration from "@/components/menu/drink-illustration";
import {
  aboutData,
  achievementsData,
  certificationsData,
  experienceData,
  personalInfo,
  projectsData,
  skillsData,
  tierLabels,
  type Project,
  type SkillTier,
} from "@/data/portfolio";
import type { GithubRepo } from "@/lib/github";

// ============================================================
// QUICK ORDER MENU
// ============================================================
// The whole portfolio as plain, server-rendered HTML. It is always in the
// DOM: a drawer over the 3D café on desktop, the page itself on phones and
// when WebGL is missing. Search engines and screen readers read this, so
// every piece of content in data/portfolio.ts must appear here.
// Links to "#<station-id>" are handled by CafeShell.
// ============================================================

const TIERS: SkillTier[] = ["house", "seasonal", "experimental"];

function Section({
  id,
  title,
  station,
  children,
}: {
  id: string;
  title: string;
  station?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-dashed border-[#2b1a10]/30 py-6">
      <h2 className="font-chalk flex items-baseline justify-between text-2xl">
        {title}
        {station && (
          <a href={`#${station}`} className="font-receipt text-xs underline">
            see it in the café →
          </a>
        )}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Ticket({ project }: { project: Project }) {
  return (
    <article id={`menu-${project.slug}`} className="flex gap-4 py-3">
      <DrinkIllustration project={project} />
      <div className="min-w-0">
        <h3 className="text-lg font-bold">{project.title}</h3>
        <p className="font-receipt text-xs uppercase">{project.role} · {project.category}</p>
        <p className="mt-1 text-sm">{project.pitch}</p>
        <ul className="mt-1 list-disc pl-5 text-sm">
          {project.description.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="font-receipt mt-1 text-xs">{project.techStack.join(" · ")}</p>
        <p className="mt-2 flex gap-3 text-sm underline">
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">Live demo ↗</a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">Code ↗</a>
          )}
        </p>
      </div>
    </article>
  );
}

export default function QuickOrderMenu({ specials }: { specials: GithubRepo[] }) {
  const signature = projectsData.filter((p) => p.featured);
  const shelf = projectsData.filter((p) => !p.featured);

  return (
    <nav aria-label="Quick Order menu" className="font-cafe text-[#2b1a10]">
      <header id="menu-top" className="pb-4 text-center">
        <p className="font-receipt text-xs tracking-[0.3em]">QUICK ORDER</p>
        <h1 className="font-chalk text-4xl">{personalInfo.name}</h1>
        <p>{personalInfo.role}</p>
        <p className="mt-2 text-sm">{personalInfo.tagline}</p>
      </header>

      <Section id="menu-drinks" title="Signature Drinks" station="brew-bar">
        {signature.map((p) => <Ticket key={p.slug} project={p} />)}
      </Section>

      <Section id="menu-shelf" title="The Shelf" station="brew-bar">
        {shelf.map((p) => <Ticket key={p.slug} project={p} />)}
      </Section>

      <Section id="menu-about" title="About the Barista" station="menu-board">
        <div className="flex gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- small portrait, rendered in tests outside Next */}
          <img
            src={personalInfo.heroImage}
            alt={`${personalInfo.name}, Barista of the Month`}
            width={96}
            height={96}
            className="h-24 w-24 rounded-md object-cover"
          />
          <div className="space-y-2 text-sm">
            {aboutData.bio.map((para) => <p key={para}>{para}</p>)}
          </div>
        </div>
      </Section>

      <Section id="menu-ingredients" title="Ingredients" station="menu-board">
        {TIERS.map((tier) => (
          <div key={tier} className="py-1">
            <h3 className="font-receipt text-xs uppercase">{tierLabels[tier]}</h3>
            <p className="text-sm">
              {skillsData
                .flatMap((c) => c.skills)
                .filter((s) => s.tier === tier)
                .map((s) => s.name)
                .join(" · ")}
            </p>
          </div>
        ))}
      </Section>

      <Section id="menu-roast-log" title="Roast Log" station="roastery">
        {experienceData.map((e) => (
          <article key={e.title} className="py-2">
            <h3 className="font-bold">{e.title}</h3>
            <p className="font-receipt text-xs">{e.organization} · {e.period}</p>
            <ul className="list-disc pl-5 text-sm">
              {e.description.map((line) => <li key={line}>{line}</li>)}
            </ul>
          </article>
        ))}
      </Section>

      <Section id="menu-wall" title="On the Wall" station="wall">
        <ul className="space-y-1 text-sm">
          {achievementsData.map((a) => (
            <li key={a.title}><strong>{a.title}</strong> · {a.year} · {a.description}</li>
          ))}
          {certificationsData.map((c) => (
            <li key={c.title}><strong>{c.title}</strong> · {c.issuer} · {c.issued}</li>
          ))}
        </ul>
      </Section>

      <Section id="menu-specials" title="Today's Specials" station="specials">
        {specials.length === 0 ? (
          <p className="font-chalk text-xl">Sold out — check back soon.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {specials.map((r) => (
              <li key={r.id}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-bold underline">
                  {r.displayName}
                </a>
                {r.description && <> · {r.description}</>}
                {r.language && <span className="font-receipt text-xs"> · {r.language}</span>}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section id="menu-find-us" title="Find Us" station="checkout">
        <ul className="space-y-1 text-sm underline">
          <li><a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a></li>
          <li><a href={personalInfo.github} target="_blank" rel="noopener noreferrer">{personalInfo.github}</a></li>
          <li><a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">{personalInfo.linkedin}</a></li>
          <li><a href={personalInfo.resumeUrl} target="_blank" rel="noopener noreferrer">Résumé (PDF)</a></li>
        </ul>
      </Section>
    </nav>
  );
}
```

- [ ] **Step 4: Run to see it pass**

Run: `npx vitest run components/menu/quick-order.test.tsx`
Expected: all pass. If a project title fails to match because it contains
a character React escapes, add that entity to `decode` in the test.

- [ ] **Step 5: Commit**

```bash
git add components/menu/quick-order.tsx components/menu/quick-order.test.tsx
git commit -m "feat: add the Quick Order menu" -m "The menu is the readable, indexable version of the café: a drawer on desktop and the page on phones or without WebGL (spec 4). The test pins that every project, role, skill, achievement and contact detail is present as text, and that no empty demo link renders." -m "Verification: menu tests pass, tsc clean."
```

---

### Task 7: `/cafe` route, fonts, shell and scroll store

**Files:**
- Create: `app/cafe/layout.tsx`, `app/cafe/page.tsx`,
  `components/cafe/cafe-shell.tsx`, `lib/cafe/scroll.ts`
- Modify: `app/globals.css` (`@theme inline` block, line 9)

**Interfaces:**
- Consumes: `STATIONS`, `stationAnchor`, `progressFromScroll`,
  `resolveHash`, `StationId` (Task 3); `resolveMode`, `detectWebGL`,
  `isPhoneViewport` (Task 5); `QuickOrderMenu` (Task 6);
  `selectSpecials`, `drinkRepoNames` (Task 5); `useReducedMotion`
  (`hooks/useReducedMotion.ts`).
- Produces (`lib/cafe/scroll.ts`):
  - `getProgress(): number`
  - `subscribeProgress(fn: () => void): () => void`
  - `startScroll(opts: { smooth: boolean }): () => void`
  - `goTo(id: StationId, opts?: { immediate?: boolean }): void`
- Produces: `<CafeShell>` renders `components/cafe/scene.tsx` (Task 8)
  through `next/dynamic` with `ssr: false`, passing `cut: boolean`.

- [ ] **Step 1: Install the 3D and scroll packages**

```bash
npm install three @react-three/fiber @react-three/drei lenis
```

(`three` is already a dependency; this keeps versions compatible.)

- [ ] **Step 2: Add the café font utilities**

In `app/globals.css`, inside the `@theme inline {` block that starts at
line 9, add:

```css
  --font-chalk: var(--font-caveat-brush);
  --font-receipt: var(--font-courier-prime);
  --font-cafe: var(--font-nunito);
```

- [ ] **Step 3: Create `app/cafe/layout.tsx`**

```tsx
import { Caveat_Brush, Courier_Prime, Nunito } from "next/font/google";

const chalk = Caveat_Brush({ variable: "--font-caveat-brush", subsets: ["latin"], weight: "400", display: "swap" });
const receipt = Courier_Prime({ variable: "--font-courier-prime", subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const cafe = Nunito({ variable: "--font-nunito", subsets: ["latin"], display: "swap" });

export default function CafeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${chalk.variable} ${receipt.variable} ${cafe.variable} font-cafe min-h-screen bg-[#1b120c] text-[#f5e9da]`}>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Create `lib/cafe/scroll.ts`**

```ts
"use client";

// ============================================================
// CAFÉ SCROLL STORE
// ============================================================
// The only source of scroll truth (spec 3). Lenis smooths the native
// window scroll; this store turns scrollY into one 0..1 progress value and
// tells subscribers. The camera rig reads getProgress() every frame instead
// of subscribing, so scrolling never re-renders React.
// Module-level on purpose, like lib/theme.ts.
// ============================================================

import Lenis from "lenis";
import { progressFromScroll, stationAnchor, type StationId } from "@/lib/cafe/stations";

let progress = 0;
let lenis: Lenis | null = null;
const listeners = new Set<() => void>();

function measure(): void {
  progress = progressFromScroll(
    window.scrollY,
    document.documentElement.scrollHeight,
    window.innerHeight,
  );
  listeners.forEach((fn) => fn());
}

export function getProgress(): number {
  return progress;
}

export function subscribeProgress(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Start tracking scroll. smooth=false (reduced motion) uses native scroll. */
export function startScroll(opts: { smooth: boolean }): () => void {
  if (opts.smooth) lenis = new Lenis({ autoRaf: true });
  window.addEventListener("scroll", measure, { passive: true });
  window.addEventListener("resize", measure);
  measure();
  return () => {
    window.removeEventListener("scroll", measure);
    window.removeEventListener("resize", measure);
    lenis?.destroy();
    lenis = null;
  };
}

export function goTo(id: StationId, opts: { immediate?: boolean } = {}): void {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const y = Math.max(0, max) * stationAnchor(id);
  if (lenis) lenis.scrollTo(y, { immediate: opts.immediate ?? false });
  else window.scrollTo({ top: y, behavior: "instant" });
}
```

- [ ] **Step 5: Create `components/cafe/cafe-shell.tsx`**

```tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { detectWebGL, isPhoneViewport, resolveMode } from "@/lib/cafe/mode";
import { goTo, startScroll } from "@/lib/cafe/scroll";
import { STATIONS, resolveHash } from "@/lib/cafe/stations";

const CafeScene = dynamic(() => import("@/components/cafe/scene"), { ssr: false });

// Browser capabilities don't change during a visit, so read them once.
// null on the server: the SSR markup is the menu-as-page, which is also the
// right answer for no-JS visitors.
type Env = { webgl: boolean; phone: boolean };
let env: Env | null = null;
const readEnv = () => (env ??= { webgl: detectWebGL(), phone: isPhoneViewport() });
const noSubscribe = () => () => {};

export default function CafeShell({ children }: { children: ReactNode }) {
  const caps = useSyncExternalStore(noSubscribe, readEnv, () => null);
  const reduced = useReducedMotion();
  const [entered, setEntered] = useState(false);
  const [open, setOpen] = useState(false);

  const mode = caps ? resolveMode({ ...caps, entered }) : "menu";
  const inCafe = mode === "cafe";

  useEffect(() => {
    if (!inCafe) return;
    const stop = startScroll({ smooth: !reduced });
    const target = resolveHash(window.location.hash);
    if (target) goTo(target, { immediate: true });
    return stop;
  }, [inCafe, reduced]);

  useEffect(() => {
    if (!inCafe) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "m" || e.key === "M") setOpen((o) => !o);
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inCafe]);

  // One handler for every "#station" link in the menu: glide the camera in
  // the café, or jump to the matching menu section when the menu is the page.
  function onLinkClick(e: React.MouseEvent) {
    const link = (e.target as HTMLElement).closest("a");
    const href = link?.getAttribute("href");
    if (!href?.startsWith("#")) return;
    const station = resolveHash(href);
    if (!station) return;
    e.preventDefault();
    history.replaceState(null, "", href);
    if (inCafe) {
      setOpen(false);
      goTo(station, { immediate: reduced });
    } else {
      const section = STATIONS.find((s) => s.id === station)?.menuSection;
      if (section) document.getElementById(section)?.scrollIntoView();
    }
  }

  if (!inCafe) {
    return (
      <main onClick={onLinkClick} className="mx-auto max-w-2xl px-5 py-10">
        {mode === "closed" && (
          <p role="status" className="font-chalk mb-6 text-center text-2xl">
            The café is closed today ☕
          </p>
        )}
        {caps?.phone && caps.webgl && (
          <button
            type="button"
            onClick={() => setEntered(true)}
            className="font-receipt mb-6 w-full rounded-md border border-[#f5e9da]/40 px-4 py-3"
          >
            Step inside the café →
          </button>
        )}
        <div className="rounded-lg bg-[#f6ead8] p-6">{children}</div>
      </main>
    );
  }

  return (
    <div onClick={onLinkClick}>
      <CafeScene cut={reduced} />
      {/* Scroll track: one viewport of scroll per station. */}
      <div aria-hidden style={{ height: `${STATIONS.length * 100}vh` }} />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="quick-order"
        className="font-receipt fixed top-4 right-4 z-20 rounded-sm bg-[#f6ead8] px-4 py-2 text-sm text-[#2b1a10] shadow-lg"
      >
        {open ? "Close menu" : "Quick Order (M)"}
      </button>
      <aside
        id="quick-order"
        inert={!open}
        className={`fixed top-0 right-0 z-10 h-full w-full max-w-md overflow-y-auto bg-[#f6ead8] p-6 pt-16 shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {children}
      </aside>
    </div>
  );
}
```

- [ ] **Step 6: Create `app/cafe/page.tsx`**

```tsx
import type { Metadata } from "next";
import CafeShell from "@/components/cafe/cafe-shell";
import QuickOrderMenu from "@/components/menu/quick-order";
import { projectsData } from "@/data/portfolio";
import { drinkRepoNames, selectSpecials } from "@/lib/cafe/specials";
import { getGithubRepos } from "@/lib/github";

// Hidden preview of the café until launch (spec: built at /cafe, noindex).
export const metadata: Metadata = {
  title: "The Café (preview)",
  robots: { index: false, follow: false },
};

export default async function CafePage() {
  const repos = await getGithubRepos();
  // getGithubRepos already drops githubExclude; here we only hide drinks.
  const specials = selectSpecials(repos, drinkRepoNames(projectsData));
  return (
    <CafeShell>
      <QuickOrderMenu specials={specials} />
    </CafeShell>
  );
}
```

- [ ] **Step 7: Add a temporary scene so the route builds**

Task 8 replaces this file. Create `components/cafe/scene.tsx`:

```tsx
"use client";

export default function CafeScene({ cut }: { cut: boolean }) {
  return <div aria-hidden data-cut={cut} className="fixed inset-0 -z-10" />;
}
```

- [ ] **Step 8: Verify**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: all green; the build route list includes `/cafe`.

Then run `npm run dev` and check, in a browser or with Playwright:
- `http://localhost:3000/cafe` at 1280×800: the "Quick Order (M)" button
  opens and closes the drawer; `M` and `Escape` work; the page scrolls
  about 7 viewports.
- `/cafe` at 390×844: the menu is the page, with "Step inside the café →".
- View source of `/cafe`: `<meta name="robots" content="noindex, nofollow"/>`
  is present and every project title is in the HTML.
- `http://localhost:3000/` still shows Flow State.

- [ ] **Step 9: Commit**

```bash
git add app/cafe app/globals.css components/cafe lib/cafe/scroll.ts package.json package-lock.json
git commit -m "feat: add the hidden /cafe route with the Quick Order shell" -m "The café is built at a noindex /cafe route while Flow State stays live (spec decision). CafeShell picks café, menu or closed mode, owns the drawer and M key, and routes #station links to the camera or the menu. The scroll store is the single source of scroll truth; reduced motion uses native scroll and instant jumps." -m "Verification: tests, tsc, lint and build green; /cafe checked at desktop and phone widths; / unchanged."
```

---

### Task 8: Placeholder shop and camera rig

**Files:**
- Modify (replace): `components/cafe/scene.tsx`

**Interfaces:**
- Consumes: `STATIONS`, `cameraPose`, `stationAnchor` (Task 3);
  `getProgress` (Task 7); `drinkFor` (Task 4); `projectsData`.
- Produces: default export `CafeScene({ cut }: { cut: boolean })`.

- [ ] **Step 1: Replace `components/cafe/scene.tsx`**

```tsx
"use client";

// ============================================================
// CAFÉ SCENE (placeholder blockout)
// ============================================================
// Build step 1: every station is a coloured box with a label, so the
// camera rail and scroll timing can be tuned before any Blender model
// exists. Step 2 adds the toon material; step 5 swaps in real models.
// ============================================================

import { Html } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { projectsData } from "@/data/portfolio";
import { drinkFor } from "@/lib/cafe/drinks";
import { getProgress } from "@/lib/cafe/scroll";
import { STATIONS, cameraPose } from "@/lib/cafe/stations";

const STATION_COLORS = ["#c0632f", "#3d5a40", "#8a5a3b", "#a8873c", "#5a3620", "#c8873a", "#7a4a2a"];

function CameraRig({ cut }: { cut: boolean }) {
  useFrame(({ camera }) => {
    const pose = cameraPose(getProgress(), { cut });
    camera.position.set(...pose.position);
    camera.lookAt(...pose.target);
  });
  return null;
}

function SignatureCups() {
  const [x, y, z] = STATIONS[2].camera.target;
  const signature = projectsData.filter((p) => p.featured);
  return (
    <group position={[x, y, z]}>
      {signature.map((p, i) => (
        <mesh key={p.slug} position={[(i - (signature.length - 1) / 2) * 0.6, 0.35, 0.6]}>
          <cylinderGeometry args={[0.18, 0.14, 0.4, 24]} />
          <meshStandardMaterial color={drinkFor(p).layers[0].color} />
        </mesh>
      ))}
    </group>
  );
}

function PlaceholderShop() {
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#3a2618" />
      </mesh>
      {STATIONS.map((s, i) => (
        <group key={s.id} position={[...s.camera.target]}>
          <mesh>
            <boxGeometry args={[1.6, 1, 0.6]} />
            <meshStandardMaterial color={STATION_COLORS[i]} />
          </mesh>
          <Html center position={[0, 0.9, 0]} className="font-chalk pointer-events-none text-2xl whitespace-nowrap text-[#f5e9da]">
            {s.label}
          </Html>
        </group>
      ))}
      <SignatureCups />
    </>
  );
}

export default function CafeScene({ cut }: { cut: boolean }) {
  return (
    <div aria-hidden className="fixed inset-0">
      <Canvas camera={{ fov: 50, position: [...STATIONS[0].camera.position] }} dpr={[1, 2]}>
        <color attach="background" args={["#1b120c"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <pointLight position={[0, 3, 0]} intensity={8} color="#ffb36b" />
        <CameraRig cut={cut} />
        <PlaceholderShop />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Verify types, lint, build**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: all green.

- [ ] **Step 3: Check the scene in the browser**

Run `npm run dev`, open `http://localhost:3000/cafe` at 1280×800, and take
screenshots (Playwright or by hand) at scroll positions 0%, 30%, 60%, 100%.
Expected:
- At 0% the camera faces the "Storefront" box; at 100% it faces "Checkout".
- Scrolling glides between stations and holds still on each one for a
  moment.
- The brew bar shows 4 cups in front of its box.
- `/cafe#checkout` opens straight on "Checkout"; `/cafe#kislap` opens on
  "Brew Bar"; `/cafe#foo` opens on "Storefront" without errors.
- Clicking "see it in the café →" next to "Roast Log" in the drawer closes
  the drawer and glides to "Roastery".
- With reduced motion on (DevTools → Rendering → Emulate
  `prefers-reduced-motion: reduce`): the camera cuts between stations
  instead of gliding.
- The console has no errors.

- [ ] **Step 4: Commit**

```bash
git add components/cafe/scene.tsx
git commit -m "feat: add the placeholder café scene and camera rig" -m "A blockout of the seven stations lets the camera rail and scroll timing be tuned before the Blender models exist (spec build step 1). The rig reads the scroll store every frame, so scrolling never re-renders React." -m "Verification: tests, tsc, lint and build green; /cafe checked at four scroll positions, hash links and reduced motion."
```

---

### Task 9: Push, preview, and PR

- [ ] **Step 1: Trailer scan and push**

```bash
git log origin/main..HEAD --format="%h|%s|%(trailers:key=Co-authored-by,valueonly)"
```

Expected: the third column is empty on every line. Then:

```bash
git push -u origin feat/cafe-foundation
```

- [ ] **Step 2: Check the Vercel preview**

Run `vercel ls portfolio` and wait for the newest preview to show `Ready`.
On the preview URL repeat the Task 8 Step 3 checks at `/cafe`, and check
that `/robots.txt` and `/sitemap.xml` do not mention `/cafe`.

- [ ] **Step 3: Open the PR (no merge)**

```bash
gh pr create --base main --head feat/cafe-foundation --title "feat: café foundation at /cafe (build step 1)" --body-file <file>
```

The body says why (spec build step 1), what was verified (test count,
build, the browser checks), and what is not in it (toon, animations, HUD,
models, launch). No attribution footer.

- [ ] **Step 4: Hand back**

Report the PR URL and preview URL to the user. Ask them to review the
Kislap and KitaKo wording in the menu, and ask for a yes before merging.
