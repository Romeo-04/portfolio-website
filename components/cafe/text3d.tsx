"use client";

// ============================================================
// 3D TEXT
// ============================================================
// Every word in the café scene is real 3D text (troika SDF via drei Text):
// sharp at any distance, hidden correctly behind walls, and far cheaper than
// HTML overlays, which re-layout every frame. Fonts are subsetted TTFs in
// public/fonts. The canvas draws on demand, so each label asks for a frame
// once its glyphs are ready.
// ============================================================

import { Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { forwardRef, type ComponentProps } from "react";

export const FONTS = {
  /** Bold, playful display face for signs and titles. */
  display: "/fonts/LilitaOne-Regular.ttf",
  /** Clean rounded face for labels. */
  body: "/fonts/VarelaRound-Regular.ttf",
  /** Hand-lettered chalk for the menu board. */
  chalk: "/fonts/Kalam-Bold.ttf",
  /** Typewriter face for the receipt. */
  receipt: "/fonts/CourierPrime-Bold.ttf",
} as const;

export type FontName = keyof typeof FONTS;

type LabelProps = Omit<ComponentProps<typeof Text>, "font"> & { font?: FontName };

// troika's mesh type isn't exported by drei; refs are typed loosely here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Label = forwardRef<any, LabelProps>(function Label({ font = "body", onSync, ...props }, ref) {
  const invalidate = useThree((s) => s.invalidate);
  return (
    <Text
      ref={ref}
      font={FONTS[font]}
      anchorX="center"
      anchorY="middle"
      onSync={(mesh) => {
        invalidate();
        onSync?.(mesh);
      }}
      {...props}
    />
  );
});
