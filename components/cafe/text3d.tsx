"use client";

// ============================================================
// 3D TEXT
// ============================================================
// Every word in the café scene is real 3D text (troika SDF via drei Text):
// sharp at any distance, hidden correctly behind walls, and far cheaper than
// HTML overlays, which re-layout every frame. Fonts are subsetted WOFFs in
// public/fonts with the hinting stripped (SDF text never uses it). The
// canvas draws on demand, so each label asks for a frame once its glyphs
// are ready.
// ============================================================

import { Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { forwardRef, type ComponentProps } from "react";

export const FONTS = {
  /** Bold, playful display face for signs and titles. */
  display: "/fonts/LilitaOne-Regular.woff",
  /** Clean rounded face for labels. */
  body: "/fonts/VarelaRound-Regular.woff",
  /** Hand-lettered chalk for the menu board. */
  chalk: "/fonts/Kalam-Bold.woff",
  /** Typewriter face for the receipt. */
  receipt: "/fonts/CourierPrime-Bold.woff",
} as const;

export type FontName = keyof typeof FONTS;

type LabelProps = Omit<ComponentProps<typeof Text>, "font"> & {
  font?: FontName;
  /**
   * Thickens the strokes with an outline in the text's own colour. The body
   * face is a light weight, and at caption size on a pale card it thins out
   * to nothing; this keeps small print legible.
   */
  heavy?: boolean;
};

// troika's mesh type isn't exported by drei; refs are typed loosely here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Label = forwardRef<any, LabelProps>(function Label({ font = "body", heavy = false, onSync, ...props }, ref) {
  const invalidate = useThree((s) => s.invalidate);
  return (
    <Text
      ref={ref}
      font={FONTS[font]}
      anchorX="center"
      anchorY="middle"
      {...(heavy ? { outlineWidth: "4%", outlineColor: props.color } : null)}
      onSync={(mesh) => {
        invalidate();
        onSync?.(mesh);
      }}
      {...props}
    />
  );
});
