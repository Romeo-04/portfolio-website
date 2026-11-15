// ============================================================
// TOON MATERIAL
// ============================================================
// The café's one lighting style, shared by every MeshToonMaterial. Light
// falls off along a soft ramp: a lit side, a shaded side and a gentle blend
// between them, the way a cosy life-sim shades its world, instead of hard
// comic-book bands. softToon then adds a warm rim light on edges that turn
// away from the camera and calms the painted surface grain, so colour reads
// cleanly at any distance.
// ============================================================

import { DataTexture, LinearFilter, RedFormat, type Material } from "three";

/** Texels in the ramp; enough for the blend to stay smooth. */
export const RAMP_SIZE = 64;

/** How much sun the shaded side still receives. */
export const SHADE = 0.42;

/** Where the shaded side starts and the lit side is reached (0 faces away, 1 faces the sun). */
const BLEND_START = 0.36;
const BLEND_END = 0.64;

/** Light at a point on the ramp: flat shade, a smooth blend, then full light. */
export function toonRamp(x: number): number {
  const t = Math.min(1, Math.max(0, (x - BLEND_START) / (BLEND_END - BLEND_START)));
  return SHADE + (1 - SHADE) * (t * t * (3 - 2 * t));
}

/** Ink colour for outlines: a warm umber, softer than black. */
export const INK = "#3a2418";

/** Outline width in world units. */
export const OUTLINE_THICKNESS = 0.02;

let gradient: DataTexture | null = null;

export function toonGradient(): DataTexture {
  if (gradient) return gradient;
  const data = new Uint8Array(RAMP_SIZE);
  for (let i = 0; i < RAMP_SIZE; i++) data[i] = Math.round(toonRamp(i / (RAMP_SIZE - 1)) * 255);
  gradient = new DataTexture(data, RAMP_SIZE, 1, RedFormat);
  gradient.minFilter = LinearFilter;
  gradient.magFilter = LinearFilter;
  gradient.needsUpdate = true;
  return gradient;
}

/** Shader switches. Objects are shared so materials batch and programs cache. */
export const SOFT_DEFINES = { TOON: "" } as const;
/** As above, plus SOFT_DETAIL: the map is surface grain, drawn at part strength. */
export const SOFT_DETAIL_DEFINES = { TOON: "", SOFT_DETAIL: "" } as const;

const DETAIL_MAP = /* glsl */ `
#ifdef USE_MAP
  vec4 sampledDiffuseColor = texture2D( map, vMapUv );
  #ifdef SOFT_DETAIL
    // Blend the grain toward its own average (the smallest mip), so weaves
    // and speckle stay a hint instead of shimmering as noise.
    vec4 softAverage = texture2D( map, vMapUv, 9.0 );
    sampledDiffuseColor.rgb = mix( softAverage.rgb, sampledDiffuseColor.rgb, 0.3 );
  #endif
  diffuseColor *= sampledDiffuseColor;
#endif
`;

const RIM_LIGHT = /* glsl */ `
  {
    float softRim = 1.0 - clamp( dot( normalize( normal ), normalize( vViewPosition ) ), 0.0, 1.0 );
    softRim = smoothstep( 0.6, 1.0, softRim );
    outgoingLight += diffuseColor.rgb * vec3( 1.0, 0.94, 0.84 ) * softRim * 0.16;
  }
  #include <opaque_fragment>
`;

/** One function for every toon material, so they all share cached programs. */
export function softToon(shader: { fragmentShader: string }): void {
  shader.fragmentShader = shader.fragmentShader
    .replace("#include <map_fragment>", DETAIL_MAP)
    .replace("#include <opaque_fragment>", RIM_LIGHT);
}

/** Applies the soft look to a material made outside JSX (loaded models). */
export function applySoftToon<T extends Material>(material: T): T {
  material.defines = { ...SOFT_DEFINES };
  material.onBeforeCompile = softToon;
  return material;
}
