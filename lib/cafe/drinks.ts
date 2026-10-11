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
