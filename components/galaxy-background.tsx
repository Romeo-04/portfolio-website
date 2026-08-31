"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTheme } from "@/hooks/useTheme";

// Spiral parameters, carried over from the Flow State canvas.
const BRANCHES = 4;
const RADIUS = 5.5;
const SPIN = 1.3;
const COLOR_INNER = 0x7c96ff;
const COLOR_OUTER = 0x2a3558;

/**
 * Fixed particle galaxy behind the page. Rotation is coupled to scroll
 * position, so moving down the page turns the field.
 *
 * three.js is imported inside the effect rather than at module scope: it
 * keeps ~150KB out of the initial bundle and guarantees the library is only
 * ever touched in the browser. Every exit path leaves the page intact — if
 * WebGL is unavailable, the site simply renders on the flat void background.
 */
export default function GalaxyBackground() {
  const holderRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { theme } = useTheme();

  // The render loop reads this ref rather than closing over `theme`, so a
  // theme flip doesn't require tearing down and rebuilding the scene.
  const activeRef = useRef(true);
  activeRef.current = theme === "dark";

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
        return; // No WebGL — the flat background is a fine fallback.
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      holder.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        100,
      );
      camera.position.set(0, 2.6, 4.6);
      camera.lookAt(0, 0, 0);

      // Halve the particle budget on phones — same shape, far less fill cost.
      const count = window.innerWidth < 640 ? 3500 : 7000;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const inner = new THREE.Color(COLOR_INNER);
      const outer = new THREE.Color(COLOR_OUTER);

      for (let i = 0; i < count; i++) {
        const r = Math.pow(Math.random(), 1.6) * RADIUS;
        const branchAngle =
          ((i % BRANCHES) / BRANCHES) * Math.PI * 2 + r * SPIN;
        const jitter = () => (Math.random() - 0.5) * (r * 0.22 + 0.15);

        positions[i * 3] = Math.cos(branchAngle) * r + jitter();
        positions[i * 3 + 1] = jitter() * 0.5;
        positions[i * 3 + 2] = Math.sin(branchAngle) * r + jitter();

        const c = inner.clone().lerp(outer, r / RADIUS);
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.032,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      });

      const galaxy = new THREE.Points(geometry, material);
      scene.add(galaxy);

      let targetRotation = 0;
      let currentRotation = 0;
      let raf = 0;

      const onScroll = () => {
        targetRotation = window.scrollY * 0.0008;
        // The galaxy is the hero's moment. Past it the field would sit
        // directly behind body copy and shred its legibility, so fade it to
        // a faint wash — the scroll-coupled rotation still reads, the text
        // stops competing with 7000 bright points.
        const fadeOver = window.innerHeight * 0.8;
        const t = Math.min(window.scrollY / fadeOver, 1);
        holder.style.setProperty("--galaxy-scroll", String(1 - t * 0.85));
      };
      onScroll();
      const onResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);

      const loop = () => {
        raf = requestAnimationFrame(loop);
        // Light theme hides the canvas entirely; skip the draw call.
        if (!activeRef.current) return;
        currentRotation += (targetRotation - currentRotation) * 0.06;
        galaxy.rotation.y = currentRotation + performance.now() * 0.00003;
        galaxy.rotation.z = currentRotation * 0.35;
        renderer.render(scene, camera);
      };
      loop();

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [reduced]);

  return (
    <div
      ref={holderRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        // Two independent factors: the theme (light mode hides it outright)
        // and scroll depth, set by the render loop's scroll handler.
        opacity: "calc(var(--galaxy-opacity) * var(--galaxy-scroll, 1))",
      }}
    />
  );
}
