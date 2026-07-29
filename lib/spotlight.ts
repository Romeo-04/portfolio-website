import type { MouseEvent } from "react";

// Drives the .spotlight overlay (see globals.css) via CSS custom properties
// set directly on the DOM node, so pointer tracking never triggers a React
// re-render on every mousemove.
export function handleSpotlightMove(e: MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  e.currentTarget.style.setProperty("--spot-opacity", "1");
}

export function handleSpotlightLeave(e: MouseEvent<HTMLElement>) {
  e.currentTarget.style.setProperty("--spot-opacity", "0");
}
