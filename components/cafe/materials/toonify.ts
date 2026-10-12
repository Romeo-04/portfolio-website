// ============================================================
// TOONIFY
// ============================================================
// Loaded Blender models arrive with standard PBR materials. toonify swaps
// each for the café's toon material, keeping colour, texture and
// transparency, so a model needs no special export settings to match the
// shop. Baked lighting is respected: unlit materials (Blender bakes exported
// as KHR_materials_unlit) pass through as they are, so their painted light
// is not lit a second time, and ambient occlusion and emissive glow carry
// over to toon materials. collectMeshes flattens a model into meshes with
// baked world matrices, so each can get its own ink outline.
// ============================================================

import {
  Color,
  FrontSide,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshToonMaterial,
  type BufferGeometry,
  type Material,
  type Object3D,
  type Texture,
} from "three";
import { toonGradient } from "@/components/cafe/materials/toon";

type Colored = Material & {
  color?: Color;
  map?: Texture | null;
  aoMap?: Texture | null;
  aoMapIntensity?: number;
  emissive?: Color;
  emissiveMap?: Texture | null;
  emissiveIntensity?: number;
};

export function toonify(source: Material | Material[]): Material {
  const first = Array.isArray(source) ? source[0] : source;
  // Baked lighting arrives unlit: keep it unlit, or it is lit twice.
  if (first instanceof MeshBasicMaterial) return first.clone();
  const src = first as Colored | undefined;
  const toon = new MeshToonMaterial({
    color: src?.color ? src.color.clone() : new Color("#ffffff"),
    map: src?.map ?? null,
    gradientMap: toonGradient(),
    transparent: src?.transparent ?? false,
    opacity: src?.opacity ?? 1,
    side: src?.side ?? FrontSide,
    alphaTest: src?.alphaTest ?? 0,
    vertexColors: src?.vertexColors ?? false,
    aoMap: src?.aoMap ?? null,
    aoMapIntensity: src?.aoMapIntensity ?? 1,
    emissive: src?.emissive ? src.emissive.clone() : new Color("#000000"),
    emissiveMap: src?.emissiveMap ?? null,
    emissiveIntensity: src?.emissiveIntensity ?? 1,
  });
  toon.name = src?.name ?? "";
  return toon;
}

export type BakedMesh = { geometry: BufferGeometry; material: Material; matrix: Matrix4 };

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
