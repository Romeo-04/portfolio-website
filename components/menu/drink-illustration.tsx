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
