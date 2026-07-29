import type { CSSProperties } from "react";

// Presentational only — reads --spot-x/--spot-y/--spot-opacity, which are
// set imperatively by lib/spotlight.ts's handlers on the positioned parent
// this is rendered inside. Must be placed inside a `relative overflow-hidden`
// container that carries those handlers.
export default function Spotlight({ size = 550 }: { size?: number }) {
  return (
    <div
      aria-hidden
      className="spotlight pointer-events-none absolute inset-0"
      style={{ "--spot-size": `${size}px` } as CSSProperties}
    />
  );
}
