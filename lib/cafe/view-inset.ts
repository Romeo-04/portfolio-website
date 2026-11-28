// How far (in CSS px) the 3D view shifts so the café centres in the space
// an open station panel leaves free: right, beside the side panel on wide
// screens (inset), or up, above the bottom sheet on phones (lift). The
// panel sets them; the scene eases the camera's view offset toward them.

let inset = 0;
let lift = 0;
const listeners = new Set<() => void>();

export function getViewInset(): number {
  return inset;
}

export function getViewLift(): number {
  return lift;
}

export function setViewInset(px: number): void {
  if (px === inset) return;
  inset = px;
  listeners.forEach((fn) => fn());
}

export function setViewLift(px: number): void {
  if (px === lift) return;
  lift = px;
  listeners.forEach((fn) => fn());
}

export function subscribeViewInset(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
