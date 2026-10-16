import { useId } from "react";
import type { Project } from "@/data/portfolio";
import { drinkFor, type Drink } from "@/lib/cafe/drinks";

// Flat 2D version of a project's drink for the Quick Order menu, the station
// panel and the project sheet. Same data as the 3D cup, so the two can never
// show different stacks. The layers melt into each other like a real
// layered drink, a kraft sleeve carries the café's logo, and the topping
// (whip or foam) follows the cup.

const INK = "#2b1a10";
const CREAM = "#fbf3e4";
const FOAM = "#f1e2c8";
const KRAFT = "#c99a66";

// The glass: rim at RIM, base at BASE, tapering inward.
const RIM = 30;
const BASE = 82;
const GLASS = "M12 30 L52 30 L47 82 L17 82 Z";

/** The café's mark: a roasted bean on a dark badge with a cream ring. */
export function CafeMark({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#3b2314" stroke={CREAM} strokeWidth={r * 0.18} />
      <ellipse cx={cx} cy={cy} rx={r * 0.42} ry={r * 0.58} fill={CREAM} transform={`rotate(28 ${cx} ${cy})`} />
      <path
        d={`M${cx - r * 0.12} ${cy - r * 0.52} q${r * 0.32} ${r * 0.52} 0 ${r * 1.04}`}
        fill="none"
        stroke="#3b2314"
        strokeWidth={r * 0.14}
        strokeLinecap="round"
        transform={`rotate(28 ${cx} ${cy})`}
      />
    </g>
  );
}

function Whip({ dust }: { dust: string }) {
  return (
    <g>
      {/* A swirled dome of cream above the rim. */}
      <path
        d="M13 31 C10 25 17 21 21 23 C21 16 30 13 33 18 C37 12 47 16 45 23 C50 21 55 27 51 31 Z"
        fill={CREAM}
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M22 24 C26 21 30 23 33 20 M35 23 C39 21 42 24 45 23" fill="none" stroke="#e6d6bd" strokeWidth="1.6" strokeLinecap="round" />
      {/* Drizzle over the top. */}
      <path
        d="M16 27 L22 22 L27 27 L32 19 L37 26 L42 20 L48 27"
        fill="none"
        stroke={dust}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Straw. */}
      <path d="M40 18 L47 2" stroke={INK} strokeWidth="5.2" strokeLinecap="round" />
      <path d="M40 18 L47 2" stroke="#e4572e" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function Foam({ dust }: { dust: string }) {
  return (
    <g>
      <ellipse cx="32" cy={RIM} rx="20" ry="4.6" fill={FOAM} stroke={INK} strokeWidth="2" />
      {/* Latte-art heart and a little dusting. */}
      <path
        d="M32 33 C27 30 27.5 26.6 30.4 27.2 C31.4 27.4 32 28.4 32 28.4 C32 28.4 32.6 27.4 33.6 27.2 C36.5 26.6 37 30 32 33 Z"
        fill="#c08a5c"
      />
      {[
        [22, 29],
        [26, 31.6],
        [40, 28.4],
        [43, 31],
        [37.5, 32.4],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="0.9" fill={dust} />
      ))}
      {/* Steam. */}
      <path
        d="M26 22 c-2 -3 2 -4 0 -8 M33 21 c-2 -3 2 -4 0 -8 M40 22 c-2 -3 2 -4 0 -8"
        fill="none"
        stroke="#b9a58f"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />
    </g>
  );
}

/** Gradient stops that hold each layer's colour in its band and blend at the seams. */
function stops(drink: Drink) {
  const n = drink.layers.length;
  const band = 1 / n;
  return drink.layers.flatMap((l, i) => {
    // Bottom layer first; offsets run top (0) to bottom (1).
    const bottom = 1 - i * band;
    const top = 1 - (i + 1) * band;
    const soft = band * 0.28;
    return [
      { offset: Math.min(1, bottom - (i === 0 ? 0 : soft)), color: l.color },
      { offset: Math.max(0, top + (i === n - 1 ? 0 : soft)), color: l.color },
    ];
  });
}

export default function DrinkIllustration({
  project,
  size = 64,
}: {
  project: Pick<Project, "title" | "techStack" | "drink">;
  size?: number;
}) {
  const drink = drinkFor(project);
  const band = (BASE - RIM) / drink.layers.length;
  // useId is unique per render, so the same project drawn twice stays valid.
  // React ids can contain characters that break url(#...), so strip them.
  const base = useId().replace(/[^A-Za-z0-9_-]/g, "");
  const clipId = `cup-${base}`;
  const gradId = `pour-${base}`;
  const sorted = stops(drink).sort((a, b) => a.offset - b.offset);

  return (
    <svg
      viewBox="0 0 64 92"
      width={size}
      height={(size * 92) / 64}
      role="img"
      aria-label={`${project.title} drink: ${drink.layers.map((l) => l.name).join(", ")}`}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={GLASS} />
        </clipPath>
        <linearGradient id={gradId} x1="0" y1={RIM} x2="0" y2={BASE} gradientUnits="userSpaceOnUse">
          {sorted.map((s, i) => (
            <stop key={i} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
      </defs>
      {drink.cup === "cup" && <ellipse cx="32" cy="84" rx="26" ry="5" fill={CREAM} stroke={INK} strokeWidth="2" />}
      {drink.cup === "mug" && (
        <path d="M49 42 q11 0 10 13 q-1 11 -12 11" fill="none" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
      )}
      <g clipPath={`url(#${clipId})`}>
        <rect x="0" y={RIM} width="64" height={BASE - RIM} fill={`url(#${gradId})`} />
        {drink.layers.map((layer, i) => (
          <rect
            key={layer.name}
            data-layer={layer.name}
            x="0"
            y={BASE - band * (i + 1)}
            width="64"
            height={band + 0.5}
            fill={`url(#${gradId})`}
          />
        ))}
        {/* Glass shine down the left side. */}
        <path d="M17 36 L19.5 76" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity="0.4" />
        {/* Kraft sleeve with the café's mark. */}
        <rect x="0" y="52" width="64" height="13" fill={KRAFT} />
        <path d="M0 52 H64 M0 65 H64" stroke={INK} strokeWidth="1.4" opacity="0.5" />
      </g>
      <CafeMark cx={32} cy={58.5} r={6} />
      <path d={GLASS} fill="none" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      {drink.topping.kind === "whip" ? <Whip dust={drink.topping.dust} /> : <Foam dust={drink.topping.dust} />}
    </svg>
  );
}
