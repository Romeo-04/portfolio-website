// Render quality (spec section 3, "Performance"). Phone light 3D and slow
// devices drop to DPR 1 with no post-processing; a decline is sticky so
// quality never flickers back. Reduced motion turns off the animated grain.

export type Quality = { dpr: [number, number]; effects: boolean; grain: boolean };

export function qualityFor(opts: {
  light: boolean;
  declined: boolean;
  reduced: boolean;
}): Quality {
  if (opts.light || opts.declined) return { dpr: [1, 1], effects: false, grain: false };
  return { dpr: [1, 2], effects: true, grain: !opts.reduced };
}
