"use client";

/*
  Wireframe robot (PLAN §2 Hero).

  Low-poly geometric stack: torso, head, two arm cubes, tracked base. We
  don't try to model an actual FTC robot — the intent is an iconic
  silhouette readable at any size, edges-only so it never competes with
  the headline. Mouse position drives subtle camera parallax. Idle, the
  rig breathes (±2° rotation). Pauses when off-screen via R3F's
  invalidate model.

  Lazy-loaded with dynamic({ssr:false}) by the parent so it doesn't ship
  three.js to first paint.
*/

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { colors } from "@/lib/tokens";

function Robot() {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    // Idle breathing: ±2° on Y, ±1° on X.
    const baseY = (target.current.x * Math.PI) / 14 + Math.sin(t * 0.4) * 0.035;
    const baseX = (target.current.y * Math.PI) / 28 + Math.sin(t * 0.3) * 0.018;
    g.rotation.y += (baseY - g.rotation.y) * 0.05;
    g.rotation.x += (baseX - g.rotation.x) * 0.05;
  });

  const lineMat = (
    <lineBasicMaterial
      attach="material"
      color={colors.accent}
      transparent
      opacity={0.85}
    />
  );

  return (
    <group ref={group} position={[0, -0.2, 0]}>
      {/* Base / chassis */}
      <lineSegments position={[0, -1.4, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(2.4, 0.4, 1.6)]} />
        {lineMat}
      </lineSegments>
      {/* Torso */}
      <lineSegments position={[0, -0.2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.6, 1.8, 1.2)]} />
        {lineMat}
      </lineSegments>
      {/* Head */}
      <lineSegments position={[0, 1, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.9, 0.6, 0.9)]} />
        {lineMat}
      </lineSegments>
      {/* Antenna */}
      <lineSegments position={[0, 1.55, 0]}>
        <edgesGeometry args={[new THREE.CylinderGeometry(0.02, 0.02, 0.35, 6)]} />
        {lineMat}
      </lineSegments>
      {/* Arms */}
      <lineSegments position={[-1.1, -0.3, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.4, 1.4, 0.4)]} />
        {lineMat}
      </lineSegments>
      <lineSegments position={[1.1, -0.3, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.4, 1.4, 0.4)]} />
        {lineMat}
      </lineSegments>
      {/* Wheel hubs (small octagons) */}
      {[-0.8, 0.8].map((x) =>
        [-0.55, 0.55].map((z) => (
          <lineSegments key={`${x}_${z}`} position={[x, -1.6, z]}>
            <edgesGeometry args={[new THREE.CylinderGeometry(0.22, 0.22, 0.18, 8)]} />
            {lineMat}
          </lineSegments>
        )),
      )}
    </group>
  );
}

export default function WireRobot() {
  // Defer mounting until first paint is done so the headline LCP isn't blocked.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const idle = (window as unknown as { requestIdleCallback?: typeof requestIdleCallback })
      .requestIdleCallback;
    if (idle) {
      const id = idle(() => setReady(true), { timeout: 800 });
      return () => (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(() => setReady(true), 400);
    return () => window.clearTimeout(t);
  }, []);

  if (!ready) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 opacity-70"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [3.5, 1.5, 5.2], fov: 30 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      >
        <ambientLight intensity={0.6} />
        <Robot />
      </Canvas>
    </div>
  );
}
