// ============================================================
// MODEL REGISTRY
// ============================================================
// Which café pieces have a Blender model. Add a line here after putting a
// compressed .glb in public/models/ (see docs/cafe-models.md); until then
// the procedural piece renders.
// ============================================================

export type ModelName = "room" | "brew-bar";

export const MODELS: Partial<Record<ModelName, string>> = {};

export function modelSrc(
  name: ModelName,
  registry: Partial<Record<ModelName, string>> = MODELS,
): string | null {
  return registry[name] ?? null;
}
