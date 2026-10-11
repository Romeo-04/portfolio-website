"use client";

// ============================================================
// MODEL
// ============================================================
// Renders a registered Blender model with the toon look and ink outlines,
// or the procedural fallback while there is no file, while it loads, or if
// it fails to load. Meshopt compression only: no external Draco decoder.
// ============================================================

import { useGLTF } from "@react-three/drei";
import { Component, Suspense, useEffect, useMemo, type ReactNode } from "react";
import { Ink } from "@/components/cafe/kit";
import { collectMeshes } from "@/components/cafe/materials/toonify";
import { modelSrc, type ModelName } from "@/lib/cafe/models";

class ModelBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[cafe] model failed to load, using the built-in piece", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function Loaded({ src }: { src: string }) {
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

export default function Model({ name, fallback }: { name: ModelName; fallback: ReactNode }) {
  const src = modelSrc(name);
  if (!src) return <>{fallback}</>;
  return (
    <ModelBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <Loaded src={src} />
      </Suspense>
    </ModelBoundary>
  );
}
