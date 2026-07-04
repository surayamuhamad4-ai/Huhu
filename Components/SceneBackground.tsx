"use client";

/**
 * components/SceneBackground.tsx
 * A fixed, full-viewport background layer that crossfades between named
 * "scenes" as the user scrolls past different sections. Each scene is a
 * CSS gradient + a matching ParticlesLayer variant — deliberately NOT
 * full illustrated backgrounds (that would mean shipping multiple heavy
 * image assets sight-unseen, which fails "no placeholders"; a generated
 * gradient + particle combination is something we can actually deliver
 * at full quality today). Swap any `gradient` value for a real
 * background-image url() once you have artwork, no other code changes
 * needed.
 */
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParticlesLayer from "./ParticlesLayer";
import type { ParticleVariant } from "./ParticlesLayer";

interface Scene {
  id: string;
  /** Section element IDs that should activate this scene */
  sectionIds: string[];
  gradient: string;
  particle: ParticleVariant;
  particleCount: number;
}

const SCENES: Scene[] = [
  {
    id: "night-sky",
    sectionIds: ["hero"],
    gradient: "linear-gradient(180deg, #150C19 0%, #241726 55%, #3A2640 100%)",
    particle: "star",
    particleCount: 70,
  },
  {
    id: "sakura-park",
    sectionIds: ["letter", "timeline"],
    gradient: "linear-gradient(180deg, #FFF6F0 0%, #FFE1E9 60%, #FFF6F0 100%)",
    particle: "sakura",
    particleCount: 24,
  },
  {
    id: "fairy-forest",
    sectionIds: ["reasons", "countdown"],
    gradient: "linear-gradient(180deg, #FFF6F0 0%, #C9B6E4 35%, #AEDFF7 100%)",
    particle: "firefly",
    particleCount: 30,
  },
  {
    id: "flower-garden",
    sectionIds: ["love-meter", "wish-jar", "lucky-wheel"],
    gradient: "linear-gradient(180deg, #FFE1E9 0%, #FFF6F0 50%, #C9B6E4 100%)",
    particle: "heart",
    particleCount: 18,
  },
  {
    id: "starlit-promise",
    sectionIds: ["catch-hearts", "promises"],
    gradient: "linear-gradient(180deg, #C9B6E4 0%, #FFF6F0 100%)",
    particle: "sakura",
    particleCount: 20,
  },
  {
    id: "moonlit-letters",
    sectionIds: ["wedding-dream", "open-when", "fortune-cookie"],
    gradient: "linear-gradient(180deg, #FFF6F0 0%, #C9B6E4 60%, #FFE1E9 100%)",
    particle: "sakura",
    particleCount: 22,
  },
  {
    id: "galaxy",
    sectionIds: ["music", "easter-egg"],
    gradient: "linear-gradient(180deg, #241726 0%, #150C19 100%)",
    particle: "star",
    particleCount: 90,
  },
];

const SECTION_TO_SCENE: Record<string, string> = SCENES.reduce(
  (acc, scene) => {
    scene.sectionIds.forEach((id) => {
      acc[id] = scene.id;
    });
    return acc;
  },
  {} as Record<string, string>
);

export default function SceneBackground() {
  const [activeSceneId, setActiveSceneId] = useState<string>("night-sky");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sectionIds = Object.keys(SECTION_TO_SCENE);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to vertical center of the viewport among
        // those currently intersecting, so fast scrolling doesn't cause
        // flicker between two adjacent scenes.
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const closest = visible.reduce((best, e) => {
          const bestDist = Math.abs(best.boundingClientRect.top + best.boundingClientRect.height / 2 - window.innerHeight / 2);
          const eDist = Math.abs(e.boundingClientRect.top + e.boundingClientRect.height / 2 - window.innerHeight / 2);
          return eDist < bestDist ? e : best;
        });
        const sceneId = SECTION_TO_SCENE[closest.target.id];
        if (sceneId) setActiveSceneId(sceneId);
      },
      { rootMargin: "-30% 0px -30% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current!.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const activeScene = SCENES.find((s) => s.id === activeSceneId) ?? SCENES[0]!;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
      <AnimatePresence>
        <motion.div
          key={activeScene.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{ background: activeScene.gradient }}
        >
          <ParticlesLayer
            variant={activeScene.particle}
            count={activeScene.particleCount}
            seed={activeScene.id.length * 13}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
