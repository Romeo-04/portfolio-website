import {
  BoxGeometry,
  Color,
  Group,
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

describe("collectMeshes", () => {
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
