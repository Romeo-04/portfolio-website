// Render quality (spec section 3, "Performance"). Desktop gets high DPR,
// post-processing (bloom, ambient occlusion, antialiasing) and real-time
// sun shadows. Phone light 3D and slow devices drop to DPR 1 with none of
// those; a decline is sticky so quality never flickers back.

export type Quality = { dpr: [number, number]; effects: boolean; shadows: boolean };

export function qualityFor(opts: { light: boolean; declined: boolean }): Quality {
  if (opts.light || opts.declined) return { dpr: [1, 1], effects: false, shadows: false };
  return { dpr: [1, 2], effects: true, shadows: true };
}
