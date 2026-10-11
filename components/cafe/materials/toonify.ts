// ============================================================
// TOONIFY
// ============================================================
// Loaded Blender models arrive with standard PBR materials. toonify swaps
// each for the café's toon material, keeping colour, texture and
// transparency, so a model needs no special export settings to match the
// shop. collectMeshes flattens a model into meshes with baked world
// matrices, so each can get its own ink outline.
// ============================================================

import {
  Color,
  FrontSide,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshToonMaterial,
  type BufferGeometry,
  type Material,
  type Object3D,
  type Texture,
} from "three";
import { toonGradient } from "@/components/cafe/materials/toon";

type Colored = Material & { color?: Color; map?: Texture | null };

export function toonify(source: Material | Material[]): MeshToonMaterial {
  const src = (Array.isArray(source) ? source[0] : source) as Colored | undefined;
  const toon = new MeshToonMaterial({
    color: src?.color ? src.color.clone() : new Color("#ffffff"),
    map: src?.map ?? null,
    gradientMap: toonGradient(),
    transparent: src?.transparent ?? false,
    opacity: src?.opacity ?? 1,
    side: src?.side ?? FrontSide,
    alphaTest: src?.alphaTest ?? 0,
    vertexColors: src?.vertexColors ?? false,
  });
  toon.name = src?.name ?? "";
  return toon;
}

export type BakedMesh = { geometry: BufferGeometry; material: MeshToonMaterial; matrix: Matrix4 };

export function collectMeshes(root: Object3D): BakedMesh[] {
  root.updateMatrixWorld(true);
  const out: BakedMesh[] = [];
  root.traverse((obj) => {
    if (obj instanceof InstancedMesh) {
      // One baked copy per instance: world matrix x instance matrix.
      const material = toonify(obj.material);
      const inst = new Matrix4();
      for (let i = 0; i < obj.count; i++) {
        obj.getMatrixAt(i, inst);
        out.push({ geometry: obj.geometry, material, matrix: new Matrix4().multiplyMatrices(obj.matrixWorld, inst) });
      }
    } else if (obj instanceof Mesh) {
      out.push({
        geometry: obj.geometry,
        material: toonify(obj.material),
        matrix: new Matrix4().copy(obj.matrixWorld),
      });
    }
  });
  return out;
}
