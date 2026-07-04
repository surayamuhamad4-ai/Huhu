"use client";

/**
 * components/EasterEgg.tsx
 * Two hidden interactions:
 *  1. Long-press (600ms+) anywhere on this section reveals a secret message.
 *  2. Device shake (via DeviceMotion, with iOS 13+ permission handling)
 *     triggers the same secret reveal on mobile.
 * Both are entirely optional/progressive — the site works perfectly fine
 * for anyone who never discovers them.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoveStore } from "@/lib/store";

const LONG_PRESS_MS = 600;
const SHAKE_THRESHOLD = 18; // m/s^2 delta required to count as a "shake"

const SECRET_MESSAGE =
  "Psst — you found it. Here's something I don't say enough: thank you for being exactly who you are. Don't ever shrink yourself for anyone. 💛";

interface MotionEventWithPermission {
  requestPermission?: () => Promise<"granted" | "denied">;
}

export default function EasterEgg() {
  const [revealed, setRevealed] = useState(false);
  const [motionPermissionAsked, setMotionPermissionAsked] = useState(false);
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const unlockAchievement = useLoveStore((s) => s.unlockAchievement);
  const incrementLoveMeter = useLoveStore((s) => s.incrementLoveMeter);

  const reveal = useCallback(() => {
    setRevealed(true);
    unlockAchievement("found-secret-message");
    incrementLoveMeter(5);
  }, [unlockAchievement, incrementLoveMeter]);

  const handlePressStart = useCallback(() => {
    pressTimerRef.current = setTimeout(reveal, LONG_PRESS_MS);
  }, [reveal]);

  const handlePressEnd = useCallback(() => {
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
  }, []);

  useEffect(() => {
    // Shake detection — only attach listener if DeviceMotion exists.
    if (typeof window === "undefined" || !("DeviceMotionEvent" in window)) return;

    let lastX = 0;
    let lastY = 0;
    let lastZ = 0;
    let lastTime = Date.now();

    function handleMotion(event: DeviceMotionEvent) {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;
      const now = Date.now();
      if (now - lastTime < 100) return; // throttle to ~10Hz
      const deltaTime = now - lastTime;
      lastTime = now;

      const x = acc.x ?? 0;
      const y = acc.y ?? 0;
      const z = acc.z ?? 0;
      const speed =
        (Math.abs(x + y + z - lastX - lastY - lastZ) / deltaTime) * 10000;

      if (speed > SHAKE_THRESHOLD) {
        reveal();
      }
      lastX = x;
      lastY = y;
      lastZ = z;
    }

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [reveal]);

  async function requestMotionPermission() {
    setMotionPermissionAsked(true);
    const DeviceMotionEventTyped = window.DeviceMotionEvent as unknown as MotionEventWithPermission;
    if (typeof DeviceMotionEventTyped?.requestPermission === "function") {
      try {
        await DeviceMotionEventTyped.requestPermission();
      } catch {
        // Permission denied or unsupported — shake detection simply won't fire.
      }
    }
  }

  return (
    <section
      id="easter-egg"
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      className="relative w-full bg-plum px-6 py-24 flex flex-col items-center text-center select-none"
      aria-label="A hidden surprise"
    >
      <h2 className="font-display text-3xl md:text-4xl text-cream mb-3">A Hidden Surprise</h2>
      <p className="text-cream/60 font-body max-w-sm">
        long-press anywhere on this section{typeof window !== "undefined" && "DeviceMotionEvent" in window ? ", or shake your phone" : ""}...
      </p>

      {!motionPermissionAsked && typeof window !== "undefined" && "DeviceMotionEvent" in window && (
        <button
          type="button"
          onClick={requestMotionPermission}
          className="mt-4 text-xs text-cream/40 underline"
        >
          enable shake detection
        </button>
      )}

      <AnimatePresence>
        {revealed && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="font-hand text-2xl text-gold mt-8 max-w-md"
          >
            {SECRET_MESSAGE}
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
