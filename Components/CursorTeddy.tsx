"use client";

/**
 * components/CursorTeddy.tsx
 * A small teddy bear that drifts toward the cursor with spring physics
 * (not 1:1 tracking — that reads as robotic). Waves when clicked, sleeps
 * after prolonged inactivity, and is completely inert on touch devices
 * (no cursor concept) where it instead sits in a fixed corner.
 */
import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useLoveStore } from "@/lib/store";

const IDLE_SLEEP_MS = 15000;

export default function CursorTeddy() {
  const [isTouch, setIsTouch] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [isAsleep, setIsAsleep] = useState(false);
  const unlockAchievement = useLoveStore((s) => s.unlockAchievement);
  const incrementLoveMeter = useLoveStore((s) => s.incrementLoveMeter);

  const x = useMotionValue(typeof window !== "undefined" ? window.innerWidth - 120 : 0);
  const y = useMotionValue(typeof window !== "undefined" ? window.innerHeight - 160 : 0);
  const springX = useSpring(x, { damping: 18, stiffness: 90, mass: 0.6 });
  const springY = useSpring(y, { damping: 18, stiffness: 90, mass: 0.6 });

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (isTouch) return;
    let idleTimer: ReturnType<typeof setTimeout>;

    function resetIdle() {
      setIsAsleep(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIsAsleep(true), IDLE_SLEEP_MS);
    }

    function handleMove(e: MouseEvent) {
      // Offset so the teddy trails slightly below-right of the actual cursor.
      x.set(e.clientX + 28);
      y.set(e.clientY + 28);
      resetIdle();
    }

    window.addEventListener("mousemove", handleMove);
    resetIdle();
    return () => {
      window.removeEventListener("mousemove", handleMove);
      clearTimeout(idleTimer);
    };
  }, [isTouch, x, y]);

  const handleClick = useCallback(() => {
    setIsWaving(true);
    incrementLoveMeter(1);
    unlockAchievement("found-teddy");
    setTimeout(() => setIsWaving(false), 900);
  }, [incrementLoveMeter, unlockAchievement]);

  if (isTouch) {
    // Static, tappable teddy fixed in the corner for touch devices.
    return (
      <motion.button
        type="button"
        onClick={handleClick}
        aria-label="Tap the teddy bear to say hi"
        className="fixed bottom-6 right-4 z-40 text-5xl select-none"
        animate={isWaving ? { rotate: [0, -15, 15, -10, 10, 0] } : { y: [0, -6, 0] }}
        transition={isWaving ? { duration: 0.7 } : { duration: 3, repeat: Infinity }}
      >
        🧸
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label="A teddy bear following your cursor — click to make it wave"
      className="fixed top-0 left-0 z-40 text-5xl select-none cursor-pointer"
      style={{ x: springX, y: springY }}
    >
      <motion.span
        className="block"
        animate={
          isWaving
            ? { rotate: [0, -20, 18, -14, 10, 0] }
            : isAsleep
            ? { rotate: [0, 4, 0] }
            : { y: [0, -5, 0] }
        }
        transition={{
          duration: isWaving ? 0.8 : isAsleep ? 4 : 2.2,
          repeat: isWaving ? 0 : Infinity,
          ease: "easeInOut",
        }}
      >
        {isAsleep ? "💤🧸" : "🧸"}
      </motion.span>
    </motion.button>
  );
}
