"use client";

// Warm bloom on the lights, a soft vignette, and film grain (spec section
// 3). Grain animates every frame, so reduced motion turns it off.

import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";

export default function Effects({ grain }: { grain: boolean }) {
  return (
    <EffectComposer multisampling={2}>
      <Bloom intensity={0.6} luminanceThreshold={0.8} mipmapBlur />
      <Vignette darkness={0.5} />
      {grain ? <Noise opacity={0.06} /> : <></>}
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
