// ============================================================
// PARTICLE SHAPE TARGETS
// ============================================================
// Produces normalized point clouds for the intro's particle swarm. Every
// shape is returned in the same coordinate space — roughly [-0.5, 0.5] on
// both axes, origin at centre — so the render loop can scale them to the
// viewport without knowing which shape it's drawing.
//
// The counts are fixed per call, which matters: the intro morphs by handing
// the SAME particles a new target array, so every shape must have exactly
// one target per particle.
// ============================================================

export interface Pt {
  x: number;
  y: number;
}

/**
 * Rasterizes a glyph to an offscreen canvas and keeps the pixels that landed
 * inside it. This is why the swarm spells anything at all — the shape comes
 * from the font, not from hand-plotted coordinates.
 */
export function sampleGlyphPoints(
  glyph: string,
  count: number,
  size = 400,
): Pt[] {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // Falls back to a system face if the webfont hasn't loaded — digits exist
  // everywhere, so the shape is always right even in the worst case.
  ctx.font = `700 ${Math.round(size * 0.8)}px "Space Grotesk", system-ui, sans-serif`;
  ctx.fillText(glyph, size / 2, size / 2);

  const { data } = ctx.getImageData(0, 0, size, size);
  const hits: Pt[] = [];

  // Step 2px: dense enough that the letterform reads, cheap enough to run
  // three times during the first frame.
  for (let y = 0; y < size; y += 2) {
    for (let x = 0; x < size; x += 2) {
      if (data[(y * size + x) * 4 + 3] > 128) {
        hits.push({ x: x / size - 0.5, y: y / size - 0.5 });
      }
    }
  }

  return resample(hits, count);
}

/**
 * Lemniscate of Bernoulli — the ∞ figure, plotted parametrically rather than
 * sampled from a glyph. Two reasons: not every font ships U+221E, and points
 * generated in parameter order let the render loop walk particles ALONG the
 * curve, so the finished symbol flows instead of sitting still.
 */
export function lemniscatePoints(count: number, thickness = 0.03): Pt[] {
  const pts: Pt[] = new Array(count);

  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const d = 1 + Math.sin(t) ** 2;

    // Scaled to match the [-0.5, 0.5] box the glyph sampler returns.
    const x = (Math.cos(t) / d) * 0.5;
    const y = ((Math.sin(t) * Math.cos(t)) / d) * 0.5;

    // Scatter around the ideal curve so the stroke has body.
    const r = Math.random() * thickness;
    const a = Math.random() * Math.PI * 2;
    pts[i] = { x: x + Math.cos(a) * r, y: y + Math.sin(a) * r };
  }

  return pts;
}

/** Particles scattered across the frame — the swarm's resting "void" state. */
export function scatterPoints(count: number, spread = 0.9): Pt[] {
  const pts: Pt[] = new Array(count);
  for (let i = 0; i < count; i++) {
    pts[i] = {
      x: (Math.random() - 0.5) * spread,
      y: (Math.random() - 0.5) * spread,
    };
  }
  return pts;
}

/**
 * Draws `count` points from `src` with a little jitter. Random draw rather
 * than striding keeps coverage even when a glyph yields far fewer hits than
 * the particle budget.
 */
function resample(src: Pt[], count: number): Pt[] {
  if (src.length === 0) return [];

  const out: Pt[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const s = src[(Math.random() * src.length) | 0];
    out[i] = {
      x: s.x + (Math.random() - 0.5) * 0.005,
      y: s.y + (Math.random() - 0.5) * 0.005,
    };
  }
  return out;
}

/**
 * Waits for webfonts so the glyph sampler measures the real typeface, with a
 * ceiling so a slow font never delays the intro.
 */
export function fontsReady(timeoutMs = 800): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) return Promise.resolve();
  return Promise.race([
    document.fonts.ready.then(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}
