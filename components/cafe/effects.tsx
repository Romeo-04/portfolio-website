"use client";

// Post-processing for the daytime café (spec section 3): ambient occlusion
// for soft contact shadows in corners and under furniture, tinted warm so
// creases read as shade rather than soot; a gentle bloom that lets sunlit
// cream and lamp bulbs glow; a faint vignette; neutral tone mapping, which
// keeps the palette's colours as painted; and SMAA for clean edges. Film
// grain was dropped: on flat daylight colours it read as dirt.

import { Bloom, EffectComposer, N8AO, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";

export default function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <N8AO aoRadius={1.1} distanceFalloff={1} intensity={1.8} color="#5a3524" halfRes quality="medium" />
      <Bloom intensity={0.3} luminanceThreshold={1} luminanceSmoothing={0.25} mipmapBlur />
      <Vignette darkness={0.2} offset={0.35} />
      <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      <SMAA />
    </EffectComposer>
  );
}
