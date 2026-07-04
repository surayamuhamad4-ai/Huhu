"use client";

/**
 * components/StarfieldCanvas.tsx
 * A minimal, performant Three.js / React Three Fiber starfield used behind
 * the hero. Deliberately restrained (this is the ONE Three.js scene on the
 * site) — a slowly-rotating field of points plus a handful of larger
 * "wish stars" that gently pulse. Heavy WebGL scenes per-section would hurt
 * mobile performance far more than they'd add, so the rest of the site
 * uses the canvas-2d ParticlesLayer instead; this component is reserved
 * for the single moment that deserves the extra depth.
 */
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "@/lib/utils";

function Stars({ count = 1800 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const rand = mulberry32(7);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 18 + rand() * 14;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.5;
      arr[i * 3 + 2] = radius * Math.cos(phi) - 10;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#FFF6F0" size={0.06} sizeAttenuation transparent opacity={0.85} />
    </points>
  );
}

function WishStars({ count = 12 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const rand = useMemo(() => mulberry32(99), []);
  const stars = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        position: [
          (rand() - 0.5) * 16,
          (rand() - 0.5) * 8,
          -4 - rand() * 6,
        ] as [number, number, number],
        phase: rand() * Math.PI * 2,
      })),
    [count, rand]
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const s = 1 + 0.3 * Math.sin(clock.elapsedTime * 1.2 + stars[i]!.phase);
      child.scale.setScalar(s);
    });
  });

  return (
    <group ref={groupRef}>
      {stars.map((s, i) => (
        <mesh key={i} position={s.position}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#D4AF6A" />
        </mesh>
      ))}
    </group>
  );
}

export default function StarfieldCanvas() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      className="!absolute inset-0"
      aria-hidden="true"
    >
      <Stars />
      <WishStars />
    </Canvas>
  );
}
