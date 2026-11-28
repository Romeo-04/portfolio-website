"use client";

// ============================================================
// MODEL
// ============================================================
// Renders a registered Blender model with the toon look and ink outlines,
// or the procedural fallback while there is no file, while it loads, or if
// it fails to load. Meshopt compression only: no external Draco decoder.
// The loader is its own chunk, fetched only once a model is registered.
// A piece that needs its parts kept apart (to animate them) passes its own
// renderer as children instead of the flattening default.
// ============================================================

import { Component, Suspense, lazy, type ReactNode } from "react";
import { modelSrc, type ModelName } from "@/lib/cafe/models";

const Loaded = lazy(() => import("@/components/cafe/model-loaded"));

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

export default function Model({
  name,
  fallback,
  children,
}: {
  name: ModelName;
  fallback: ReactNode;
  children?: (src: string) => ReactNode;
}) {
  const src = modelSrc(name);
  if (!src) return <>{fallback}</>;
  return (
    <ModelBoundary fallback={fallback}>
      <Suspense fallback={fallback}>{children ? children(src) : <Loaded src={src} />}</Suspense>
    </ModelBoundary>
  );
}
