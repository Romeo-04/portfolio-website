// The sun's shadow map is drawn only when the shop changes, not on frames
// where just the camera glides. Scroll-driven motion is detected in the
// scene; anything animated on the clock asks for a redraw here.

let pending = true;

/** Ask for the shadow map to be redrawn on the next rendered frame. */
export function requestShadowUpdate(): void {
  pending = true;
}

/** Returns whether a redraw was requested, and clears the request. */
export function takeShadowUpdate(): boolean {
  const was = pending;
  pending = false;
  return was;
}
