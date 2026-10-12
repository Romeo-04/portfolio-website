"use client";

// A light bloom on lamps and bulbs, a soft vignette, and gentle film grain,
// tuned for the daytime café (spec section 3). Grain animates every frame, so reduced motion turns it off.

import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";

export default function Effects({ grain }: { grain: boolean }) {
  return (
    <EffectComposer multisampling={2}>
      <Bloom intensity={0.35} luminanceThreshold={0.95} mipmapBlur />
      <Vignette darkness={0.25} />
      {grain ? <Noise opacity={0.035} /> : <></>}
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
