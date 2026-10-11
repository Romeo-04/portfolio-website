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

/** Menu-mode counterpart of resolveHash: the id of the element to scroll to. */
export function menuTargetForHash(hash: string): string | null {
  const key = hash.replace(/^#/, "");
  if (projectSlugs.has(key)) return `menu-${key}`;
  const station = resolveHash(key);
  return station ? (STATIONS.find((s) => s.id === station)?.menuSection ?? null) : null;
}
