"use client";

// A light bloom on lamps and bulbs and a soft vignette, tuned for the
// daytime café (spec section 3). Film grain was dropped: on flat daylight
// colours it read as dirt rather than texture.

import { Bloom, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";

export default function Effects() {
  return (
    <EffectComposer multisampling={2}>
      <Bloom intensity={0.35} luminanceThreshold={0.95} mipmapBlur />
      <Vignette darkness={0.25} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
