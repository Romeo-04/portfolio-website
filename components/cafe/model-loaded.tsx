"use client";

// The glTF half of Model: loads a registered .glb (meshopt) and renders it
// with the toon look and ink outlines. Split out so the loader only ships
// when a model exists.

import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { Ink } from "@/components/cafe/kit";
import { collectMeshes } from "@/components/cafe/materials/toonify";

export default function Loaded({ src }: { src: string }) {
  const { scene } = useGLTF(src, false, true);
  const meshes = useMemo(() => collectMeshes(scene), [scene]);
  // Dispose the toon materials we created; their textures belong to the glTF cache.
  useEffect(() => () => meshes.forEach((m) => m.material.dispose()), [meshes]);
  return (
    <group>
      {meshes.map((m, i) => (
        <mesh key={i} geometry={m.geometry} material={m.material} matrix={m.matrix} matrixAutoUpdate={false}>
          <Ink />
        </mesh>
      ))}
    </group>
  );
}
