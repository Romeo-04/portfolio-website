// ============================================================
// POUR SHADER
// ============================================================
// Colours a cylinder by height: each band is one layer of the drink, bottom
// to top (same order as the 2D illustration), blended softly at the seams. Everything above uFill is
// discarded, so raising uFill "pours" the drink. Shading uses the same
// three-band idea as the toon material. The layer pick loops instead of
// indexing uColors[idx], which WebGL1 does not allow. three.Color stores
// linear values, so the colorspace chunk converts back to sRGB on output.
// ============================================================

import { Color, DoubleSide, ShaderMaterial } from "three";
import { MAX_LAYERS, type Drink } from "@/lib/cafe/drinks";

const vertexShader = /* glsl */ `
  uniform float uHeight;
  varying float vH;
  varying vec3 vNormal;
  void main() {
    vH = position.y / uHeight + 0.5;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uFill;
  uniform vec3 uColors[${MAX_LAYERS}];
  uniform int uCount;
  varying float vH;
  varying vec3 vNormal;
  void main() {
    if (uFill <= 0.0 || vH >= uFill) discard;
    // Each layer holds its colour in the middle of its band and melts into
    // the next one across the seam, like a poured layered drink.
    float x = vH * float(uCount) - 0.5;
    float last = float(uCount - 1);
    float lo = clamp(floor(x), 0.0, last);
    float hi = min(lo + 1.0, last);
    float f = x < 0.0 ? 0.0 : smoothstep(0.2, 0.8, x - lo);
    vec3 cLo = uColors[0];
    vec3 cHi = uColors[0];
    for (int i = 1; i < ${MAX_LAYERS}; i++) {
      if (float(i) == lo) cLo = uColors[i];
      if (float(i) == hi) cHi = uColors[i];
    }
    vec3 color = mix(cLo, cHi, f);
    vec3 n = normalize(vNormal) * (gl_FrontFacing ? 1.0 : -1.0);
    float light = dot(n, normalize(vec3(0.4, 0.8, 0.6)));
    float band = light > 0.5 ? 1.0 : (light > 0.0 ? 0.8 : 0.6);
    gl_FragColor = vec4(color * band, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export function createPourMaterial(drink: Drink, height: number): ShaderMaterial {
  const colors = Array.from({ length: MAX_LAYERS }, (_, i) => {
    const layer = drink.layers[Math.min(i, drink.layers.length - 1)];
    return new Color(layer.color);
  });
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: DoubleSide,
    uniforms: {
      uFill: { value: 0 },
      uHeight: { value: height },
      uColors: { value: colors },
      uCount: { value: Math.min(drink.layers.length, MAX_LAYERS) },
    },
  });
}

export function setFill(material: ShaderMaterial, fill: number): void {
  material.uniforms.uFill.value = Math.min(1, Math.max(0, fill));
}
