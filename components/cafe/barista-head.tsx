"use client";

// ============================================================
// THE BARISTA'S HEAD
// ============================================================
// The barista's head is a Blender model (public/models/barista-head.glb),
// modelled on the owner's photo and the illustrated barista made from it:
// a full, wavy mop of black hair whose fringe parts just left of centre and
// hangs to the brows at the temples, a round face with a soft chin, ears
// showing, dark almond eyes with a lash line, thin arched brows, a nose
// stroke and a wide open smile with teeth and tongue. Its parts stay
// separate so the barista can blink: EyeL and EyeR scale on their own
// vertical axis, and the glints hide mid-blink. Skin and hair take the
// café's toon shading and ink outline; the painted features (eyes, lashes,
// brows, nose stroke, mouth, blush) stay unlit, flat colour, as drawn.
//
// PrimitiveHead is the head built from primitives, shown while the model
// loads or if it fails.
// ============================================================

import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, type RefObject } from "react";
import { Euler, Mesh, MeshBasicMaterial, Quaternion, Vector3, type BufferGeometry, type Material, type Object3D } from "three";
import { Ink, Toon } from "@/components/cafe/kit";
import { toonify } from "@/components/cafe/materials/toonify";
import { modelSrc } from "@/lib/cafe/models";

export const SKIN = "#f6d5bc";
export const HAIR = "#17141a";

/** Parts drawn as flat paint rather than lit surfaces. */
const PAINTED = /^(Eye|Glint|Brow|Mouth|Teeth|Tongue|NoseLine|Blush)/;
/** Parts that get the café's ink outline. */
const OUTLINED = /^(Face|Hair|Ear)/;

export type FaceRefs = {
  /** Scaled on y to blink. */
  eyes: RefObject<(Object3D | null)[]>;
  /** Hidden mid-blink. */
  glints: RefObject<(Object3D | null)[]>;
};

type Part = {
  name: string;
  geometry: BufferGeometry;
  material: Material;
  position: Vector3;
  rotation: Euler;
  scale: Vector3;
};

function painted(source: Material): Material {
  const src = source as Material & { color?: MeshBasicMaterial["color"] };
  return new MeshBasicMaterial({
    color: src.color?.clone(),
    transparent: src.transparent,
    opacity: src.opacity,
    depthWrite: !src.transparent,
  });
}

function partsOf(root: Object3D): Part[] {
  root.updateMatrixWorld(true);
  const parts: Part[] = [];
  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;
    const source = Array.isArray(obj.material) ? obj.material[0] : obj.material;
    const position = new Vector3();
    const scale = new Vector3();
    const quaternion = new Quaternion();
    obj.matrixWorld.decompose(position, quaternion, scale);
    parts.push({
      name: obj.name,
      geometry: obj.geometry,
      material: PAINTED.test(obj.name) ? painted(source) : toonify(source),
      position,
      rotation: new Euler().setFromQuaternion(quaternion),
      scale,
    });
  });
  return parts;
}

// Start fetching as soon as this module loads, so the first render finds the
// model cached instead of kicking off the load mid-render.
const HEAD_SRC = modelSrc("barista-head");
if (HEAD_SRC && typeof window !== "undefined") useGLTF.preload(HEAD_SRC, false, true);

export function BaristaHeadModel({ src, eyes, glints }: { src: string } & FaceRefs) {
  const { scene } = useGLTF(src, false, true);
  const parts = useMemo(() => partsOf(scene), [scene]);
  // The materials are ours; the geometry belongs to the glTF cache.
  useEffect(() => () => parts.forEach((p) => p.material.dispose()), [parts]);
  let eye = 0;
  let glint = 0;
  return (
    <group>
      {parts.map((p) => {
        const isEye = /^Eye[LR]$/.test(p.name);
        const isGlint = /^Glint/.test(p.name);
        const slot = isEye ? eye++ : isGlint ? glint++ : -1;
        // The blink scales the wrapping group, not the mesh: an optimized
        // (quantized) file keeps each part's size in the mesh's own scale.
        return (
          <group
            key={p.name}
            position={p.position}
            rotation={p.rotation}
            ref={(g) => {
              if (isEye) eyes.current[slot] = g;
              if (isGlint) glints.current[slot] = g;
            }}
          >
            <mesh name={p.name} geometry={p.geometry} material={p.material} scale={p.scale}>
              {OUTLINED.test(p.name) && <Ink />}
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/** Almond eyes: wider than tall. */
const EYE_HEIGHT = 0.62;
/** [x, y, z, radius] bumps that give the hair its fluffy, wavy volume. */
const HAIR_TUFTS: [number, number, number, number][] = [
  [-0.09, 0.2, 0.05, 0.1],
  [0.08, 0.21, 0.03, 0.1],
  [0, 0.22, -0.07, 0.11],
  [-0.17, 0.08, 0.02, 0.09],
  [0.17, 0.08, 0.02, 0.09],
  [-0.15, 0.13, -0.1, 0.1],
  [0.15, 0.13, -0.1, 0.1],
];
/** [x, tilt, length] for each lock of the fringe, swept a little to one side. */
const FRINGE: [number, number, number][] = [
  [-0.14, -0.4, 0.85],
  [-0.085, -0.2, 1.0],
  [-0.03, 0.08, 0.9],
  [0.025, 0.3, 1.05],
  [0.08, 0.42, 0.95],
  [0.135, 0.55, 0.8],
];

/** The head built from primitives: shown while the model loads, or if it fails. */
export function PrimitiveHead({ eyes, glints }: FaceRefs) {
  return (
    <group>
      <mesh scale={[0.96, 1.08, 1]}>
        <sphereGeometry args={[0.22, 28, 22]} />
        <Toon color={SKIN} />
        <Ink />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.205, -0.02, 0]} scale={[0.6, 1, 0.8]}>
          <sphereGeometry args={[0.05, 10, 8]} />
          <Toon color={SKIN} />
        </mesh>
      ))}
      {/* Hair cap, tilted back so the face stays clear. */}
      <mesh position={[0, 0.04, -0.02]} rotation={[-0.38, 0, 0]} scale={[1.1, 1.08, 1.1]}>
        <sphereGeometry args={[0.225, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.56]} />
        <Toon color={HAIR} />
        <Ink />
      </mesh>
      {HAIR_TUFTS.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 14, 10]} />
          <Toon color={HAIR} />
        </mesh>
      ))}
      {FRINGE.map(([x, tilt, length], i) => (
        <mesh key={i} position={[x, 0.12, 0.2 - Math.abs(x) * 0.4]} rotation={[-0.4, x * 1.6, tilt]} scale={[0.4, length, 0.3]}>
          <sphereGeometry args={[0.075, 12, 10]} />
          <Toon color={HAIR} />
        </mesh>
      ))}
      {[-0.072, 0.072].map((x, i) => (
        <group key={x} position={[x, 0.005, 0.198]}>
          <group
            ref={(g) => {
              eyes.current[i] = g;
            }}
          >
            <mesh scale={[1.05, EYE_HEIGHT, 0.45]}>
              <sphereGeometry args={[0.028, 14, 12]} />
              <meshBasicMaterial color="#1b1410" />
            </mesh>
          </group>
          <mesh
            ref={(m) => {
              glints.current[i] = m;
            }}
            position={[0.009, 0.007, 0.014]}
          >
            <sphereGeometry args={[0.006, 8, 6]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0.045, 0.006]} rotation-z={x < 0 ? 0.08 : -0.08}>
            <boxGeometry args={[0.058, 0.009, 0.01]} />
            <meshBasicMaterial color={HAIR} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -0.08, 0.207]} rotation={[-0.2, 0, Math.PI]}>
        <circleGeometry args={[0.042, 20, 0, Math.PI]} />
        <meshBasicMaterial color="#7a3330" />
      </mesh>
      <mesh position={[0, -0.087, 0.209]} rotation-x={-0.2}>
        <planeGeometry args={[0.062, 0.013]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {[-0.12, 0.12].map((x) => (
        <mesh key={x} position={[x, -0.05, 0.165]} scale={[1, 0.6, 0.3]}>
          <sphereGeometry args={[0.03, 10, 8]} />
          <meshBasicMaterial color="#f2a090" transparent opacity={0.45} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
