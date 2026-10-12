"use client";

// Post-processing for the daytime café (spec section 3): ambient occlusion
// for soft contact shadows in corners and under furniture, a light bloom on
// lamps and bulbs, a soft vignette, ACES tone mapping and SMAA for clean
// edges. Film grain was dropped: on flat daylight colours it read as dirt.

import { Bloom, EffectComposer, N8AO, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";

export default function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <N8AO aoRadius={1.2} distanceFalloff={1} intensity={2.2} halfRes quality="high" />
      <Bloom intensity={0.35} luminanceThreshold={0.95} mipmapBlur />
      <Vignette darkness={0.25} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <SMAA />
    </EffectComposer>
  );
}
