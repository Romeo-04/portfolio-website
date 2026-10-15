// How far (in CSS px) the 3D view shifts right so the café centres in the
// space beside an open station panel. The panel sets it; the scene eases
// the camera's view offset toward it.

let inset = 0;
const listeners = new Set<() => void>();

export function getViewInset(): number {
  return inset;
}

export function setViewInset(px: number): void {
  if (px === inset) return;
  inset = px;
  listeners.forEach((fn) => fn());
}

export function subscribeViewInset(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
