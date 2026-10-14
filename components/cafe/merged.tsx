"use client";

// ============================================================
// STATIC MERGE
// ============================================================
// The room is built from hundreds of small toon pieces, and every piece
// (plus its ink outline) costs a draw call. Once the children have mounted,
// this wrapper bakes every opaque mesh into one geometry per look (same
// material, same texture, inked or not) and hides the originals, so the
// whole room draws in a few dozen calls. Only wrap content that never
// moves: merged pieces no longer follow their original objects.
// ============================================================

import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { BufferGeometry, Group, Matrix4, Mesh, type Material } from "three";
import { Ink } from "@/components/cafe/kit";

type Batch = { key: string; geometry: BufferGeometry; material: Material; inked: boolean };

/** drei's Outlines renders a group holding one mesh; that's how ink is spotted. */
function hasInk(mesh: Mesh): boolean {
  return mesh.children.some((c) => c.type === "Group" && c.children.some((m) => (m as Mesh).isMesh));
}

/** Materials that look the same share a key; anything we can't key is left alone. */
function lookKey(material: Material): string | null {
  const m = material as Material & {
    color?: { getHexString(): string };
    emissive?: { getHexString(): string };
    map?: { uuid: string } | null;
  };
  if (m.transparent || !m.color) return null;
  return [m.type, m.color.getHexString(), m.emissive?.getHexString() ?? "", m.map?.uuid ?? "", m.side, m.toneMapped].join("|");
}

/** Every geometry in a batch must carry the same attributes; keep the shared ones. */
function normalise(geometry: BufferGeometry): BufferGeometry {
  const g = geometry.index ? geometry.toNonIndexed() : geometry.clone();
  for (const name of Object.keys(g.attributes)) {
    if (name !== "position" && name !== "normal" && name !== "uv") g.deleteAttribute(name);
  }
  g.morphAttributes = {};
  g.clearGroups();
  return g;
}

export default function Merged({ children }: { children: ReactNode }) {
  const source = useRef<Group>(null);
  const [batches, setBatches] = useState<Batch[]>([]);

  useLayoutEffect(() => {
    const root = source.current;
    if (!root) return;
    root.updateWorldMatrix(true, true);
    const toLocal = new Matrix4().copy(root.matrixWorld).invert();
    const groups = new Map<string, { material: Material; inked: boolean; parts: BufferGeometry[] }>();
    const hidden: Mesh[] = [];

    root.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh || (mesh as { isInstancedMesh?: boolean }).isInstancedMesh) return;
      // 3D text draws glyphs from an instanced geometry of its own.
      if ((mesh.geometry as { isInstancedBufferGeometry?: boolean }).isInstancedBufferGeometry) return;
      if (Array.isArray(mesh.material) || !mesh.visible) return;
      // Skip the outline hulls themselves; their owner brings its ink along.
      if (mesh.parent?.type === "Group" && (mesh.parent.parent as Mesh | null)?.isMesh) return;
      const look = lookKey(mesh.material);
      const { position, normal, uv } = mesh.geometry.attributes;
      if (!look || !position || !normal || !uv) return;
      const inked = hasInk(mesh);
      const key = `${look}|${inked}`;
      const part = normalise(mesh.geometry).applyMatrix4(new Matrix4().multiplyMatrices(toLocal, mesh.matrixWorld));
      const group = groups.get(key) ?? { material: mesh.material, inked, parts: [] };
      group.parts.push(part);
      groups.set(key, group);
      hidden.push(mesh);
    });

    const next: Batch[] = [];
    groups.forEach(({ material, inked, parts }, key) => {
      const geometry = mergeGeometries(parts, false);
      parts.forEach((p) => p.dispose());
      if (geometry) next.push({ key, geometry, material, inked });
    });
    hidden.forEach((m) => (m.visible = false));
    // The batches come from the mounted three.js scene, which only exists
    // after commit, so they're read here and rendered on the next pass.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBatches(next);

    return () => {
      hidden.forEach((m) => (m.visible = true));
      next.forEach((b) => b.geometry.dispose());
      setBatches([]);
    };
  }, []);

  return (
    <group>
      <group ref={source}>{children}</group>
      {batches.map((b) => (
        <mesh key={b.key} geometry={b.geometry} material={b.material}>
          {b.inked && <Ink />}
        </mesh>
      ))}
    </group>
  );
}
