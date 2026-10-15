// ============================================================
// PROJECT SHEET STORE
// ============================================================
// Which project's pop-up is open, and where it was opened from (the rect
// of the card, cup or link that was clicked), so the sheet can grow out of
// that spot and shrink back into it. Any part of the page can open it: the
// station panel, the Quick Order menu, or a cup in the 3D café.
// ============================================================

import { projectsData } from "@/data/portfolio";

export type Origin = { x: number; y: number; w: number; h: number };
export type SheetState = { slug: string; origin: Origin | null } | null;

/** Featured projects first, then the shelf: the order prev/next walks. */
export const SHEET_ORDER: readonly string[] = [
  ...projectsData.filter((p) => p.featured),
  ...projectsData.filter((p) => !p.featured),
].map((p) => p.slug);

let state: SheetState = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((fn) => fn());

export function getSheet(): SheetState {
  return state;
}

export function subscribeSheet(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Open a project's sheet. Unknown slugs are ignored. */
export function openProject(slug: string, origin: Origin | null = null): void {
  if (!SHEET_ORDER.includes(slug)) return;
  state = { slug, origin };
  emit();
}

export function closeProject(): void {
  if (!state) return;
  state = null;
  emit();
}

/** The slug `step` places away from `slug`, wrapping around both ends. */
export function stepSlug(slug: string, step: number): string {
  const i = SHEET_ORDER.indexOf(slug);
  if (i < 0) return slug;
  const n = SHEET_ORDER.length;
  return SHEET_ORDER[(((i + step) % n) + n) % n];
}

/** Move the open sheet to a neighbouring project, keeping its origin. */
export function stepProject(step: number): void {
  if (!state) return;
  state = { ...state, slug: stepSlug(state.slug, step) };
  emit();
}

/** The rect of an element, as a sheet origin. */
export function originOf(el: Element | null): Origin | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
}
