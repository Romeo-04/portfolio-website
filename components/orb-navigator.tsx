"use client";

import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useActiveSection } from "@/hooks/useActiveSection";

const ORB_SIZE = 84;
const NAV_OFFSET = 72; // sticky nav height, so a jump doesn't tuck the heading under it

/**
 * Floating 3D section navigator. The wireframe orb rotates to a distinct
 * orientation per section as you scroll; clicking it jumps to the next one.
 *
 * Under reduced motion the WebGL orb is dropped and only the label pill
 * remains — still a working "next section" control, minus the spin.
 */
export default function OrbNavigator() {
  const holderRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { activeIndex, sections } = useActiveSection();

  // The animation loop reads targets from refs so it never restarts on
  // re-render — scrolling updates the target, the loop eases toward it.
  const targetRef = useRef({ y: 0, x: 0 });
  const total = sections.length || 1;
  targetRef.current = {
    y: activeIndex * ((Math.PI * 2) / total),
    x: (activeIndex % 2) * 0.5 - 0.25,
  };

  const goToNext = useCallback(() => {
    if (sections.length === 0) return;
    const next = sections[(activeIndex + 1) % sections.length];
    const el = document.getElementById(next.id);
    if (!el) return;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET,
      behavior: "smooth",
    });
  }, [activeIndex, sections]);

  useEffect(() => {
    if (reduced) return;
    const holder = holderRef.current;
    if (!holder) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    void (async () => {
      const THREE = await import("three");
      if (disposed || !holder) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      } catch {
        return; // No WebGL — the label pill below still navigates.
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(ORB_SIZE, ORB_SIZE);
      holder.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 20);
      camera.position.z = 3.4;

      const shellGeo = new THREE.IcosahedronGeometry(1, 1);
      const shellMat = new THREE.MeshBasicMaterial({
        color: 0x5c7cff,
        wireframe: true,
        transparent: true,
        opacity: 0.9,
      });
      const coreGeo = new THREE.SphereGeometry(0.32, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xe8ecf7 });
      const pinGeo = new THREE.ConeGeometry(0.13, 0.45, 12);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0xff6b3d });

      const orb = new THREE.Group();
      orb.add(new THREE.Mesh(shellGeo, shellMat));
      orb.add(new THREE.Mesh(coreGeo, coreMat));

      // The ember pin makes each orientation legible — it points somewhere
      // different for every section.
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.set(0, 0, 1.25);
      pin.rotation.x = Math.PI / 2;
      orb.add(pin);
      scene.add(orb);

      let raf = 0;
      const loop = () => {
        raf = requestAnimationFrame(loop);
        const { x, y } = targetRef.current;
        orb.rotation.y += (y - orb.rotation.y) * 0.07;
        orb.rotation.x += (x - orb.rotation.x) * 0.07;
        orb.rotation.z = Math.sin(performance.now() * 0.001) * 0.08;
        renderer.render(scene, camera);
      };
      loop();

      cleanup = () => {
        cancelAnimationFrame(raf);
        [shellGeo, coreGeo, pinGeo].forEach((g) => g.dispose());
        [shellMat, coreMat, pinMat].forEach((m) => m.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [reduced]);

  const label = sections[activeIndex]?.label ?? "HOME";

  return (
    // The content column runs close to this corner on anything narrower than
    // ~1440px, so the orb would otherwise sit directly on body copy. A glass
    // panel separates the two and reads as a deliberate floating control in
    // both themes — a bare radial scrim smudged the white cards in light mode.
    <div className="border-border bg-void/70 fixed right-3 bottom-3 z-30 hidden flex-col items-center gap-1 rounded-3xl border p-2.5 shadow-lg backdrop-blur-md md:flex">
      {!reduced && (
        <div
          ref={holderRef}
          onClick={goToNext}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              goToNext();
            }
          }}
          aria-label="Jump to next section"
          title="Jump to next section"
          className="focus-visible:ring-beam cursor-pointer rounded-full focus-visible:ring-2 focus-visible:outline-none"
          style={{ width: ORB_SIZE, height: ORB_SIZE }}
        />
      )}
      <button
        type="button"
        onClick={goToNext}
        aria-label={`Currently viewing ${label}. Jump to next section.`}
        className="border-beam/35 bg-void/85 text-beam hover:border-beam cursor-pointer rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.2em] backdrop-blur-sm transition-colors"
      >
        ● {label}
      </button>
    </div>
  );
}
