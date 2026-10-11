import {
  BoxGeometry,
  Color,
  DoubleSide,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MeshToonMaterial,
  Texture,
  Vector3,
} from "three";
import { describe, expect, it } from "vitest";
import { toonGradient } from "@/components/cafe/materials/toon";
import { collectMeshes, toonify } from "@/components/cafe/materials/toonify";

describe("toonify", () => {
  it("keeps colour, texture map and name, and adds the toon gradient", () => {
    const map = new Texture();
    const src = new MeshStandardMaterial({ color: new Color("#c0632f"), map, name: "cup" });
    const toon = toonify(src);
    expect(toon).toBeInstanceOf(MeshToonMaterial);
    expect(toon.color.getHexString()).toBe("c0632f");
    expect(toon.map).toBe(map);
    expect(toon.name).toBe("cup");
    expect(toon.gradientMap).toBe(toonGradient());
  });

  it("uses the first material of a multi-material mesh", () => {
    const toon = toonify([new MeshBasicMaterial({ color: "#123456" }), new MeshBasicMaterial()]);
    expect(toon.color.getHexString()).toBe("123456");
  });

  it("copies transparency", () => {
    const toon = toonify(new MeshStandardMaterial({ transparent: true, opacity: 0.3 }));
    expect(toon.transparent).toBe(true);
    expect(toon.opacity).toBeCloseTo(0.3);
  });
});

describe("toonify render state", () => {
  it("keeps side, alphaTest and vertexColors", () => {
    expect(toonify(new MeshStandardMaterial({ side: DoubleSide })).side).toBe(DoubleSide);
    expect(toonify(new MeshStandardMaterial({ alphaTest: 0.5 })).alphaTest).toBe(0.5);
    expect(toonify(new MeshStandardMaterial({ vertexColors: true })).vertexColors).toBe(true);
  });
});

describe("collectMeshes", () => {
  it("expands an InstancedMesh into one baked mesh per instance", () => {
    const root = new Group();
    root.position.set(10, 0, 0);
    const inst = new InstancedMesh(new BoxGeometry(), new MeshStandardMaterial(), 3);
    for (let i = 0; i < 3; i++) inst.setMatrixAt(i, new Matrix4().makeTranslation(i, i * 2, 0));
    root.add(inst);

    const baked = collectMeshes(root);
    expect(baked).toHaveLength(3);
    baked.forEach((b, i) => {
      expect(new Vector3().setFromMatrixPosition(b.matrix).toArray()).toEqual([10 + i, i * 2, 0]);
      expect(b.geometry).toBe(inst.geometry);
    });
  });

  it("bakes parent transforms into each mesh's matrix", () => {
    const root = new Group();
    const parent = new Group();
    parent.position.set(1, 2, 3);
    const mesh = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    mesh.position.set(0, 1, 0);
    parent.add(mesh);
    root.add(parent);

    const baked = collectMeshes(root);
    expect(baked).toHaveLength(1);
    const p = new Vector3().setFromMatrixPosition(baked[0].matrix);
    expect(p.toArray()).toEqual([1, 3, 3]);
    expect(baked[0].material).toBeInstanceOf(MeshToonMaterial);
    expect(baked[0].geometry).toBe(mesh.geometry);
  });

  it("returns nothing for an empty model", () => {
    expect(collectMeshes(new Group())).toEqual([]);
  });
});
