"use client";

/**
 * components/LuckyWheel.tsx
 * A spin-the-wheel mini-feature. Uses a deterministic weighted random
 * pick (Math.random is fine here — this is a genuinely random user
 * action, not server-rendered content, so no hydration mismatch risk).
 */
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useLoveStore } from "@/lib/store";

const PRIZES = [
  "A virtual kiss 😘",
  "A free hug, redeemable anytime 🤗",
  "I'll send you 5 compliments today",
  "A surprise milk tea date 🧋",
  "I'll write you a poem",
  "A movie night, your pick 🎬",
  "A handwritten letter",
  "One wish, granted (within reason) 🌟",
];

const SEGMENT_ANGLE = 360 / PRIZES.length;

export default function LuckyWheel() {
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const unlockAchievement = useLoveStore((s) => s.unlockAchievement);
  const incrementLoveMeter = useLoveStore((s) => s.incrementLoveMeter);
  const spinCountRef = useRef(0);

  function spin() {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    // Land the pointer (fixed at top, 0deg) on the middle of the chosen segment.
    const targetAngle = 360 - (prizeIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2);
    const fullSpins = 5 + Math.floor(Math.random() * 3);
    const newRotation = rotation + fullSpins * 360 + ((targetAngle - (rotation % 360) + 360) % 360);

    setRotation(newRotation);

    window.setTimeout(() => {
      setResult(PRIZES[prizeIndex] ?? null);
      setSpinning(false);
      spinCountRef.current += 1;
      incrementLoveMeter(3);
      unlockAchievement("spun-wheel");
    }, 3200);
  }

  return (
    <section
      id="lucky-wheel"
      className="relative w-full px-6 py-24 flex flex-col items-center"
      aria-label="Lucky wheel of love"
    >
      <h2 className="font-display text-4xl md:text-5xl text-plum mb-3 text-center">
        Lucky Wheel of Love
      </h2>
      <p className="text-plum/60 font-body mb-10 text-center">spin it, see what you win</p>

      <div className="relative w-64 h-64 md:w-72 md:h-72">
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[18px] border-l-transparent border-r-transparent border-t-gold"
          aria-hidden="true"
        />
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 3.2, ease: [0.17, 0.67, 0.3, 0.99] }}
          className="w-full h-full rounded-full shadow-xl border-4 border-gold overflow-hidden relative"
          style={{
            background: `conic-gradient(${PRIZES.map((_, i) =>
              `${i % 2 === 0 ? "#FFB6C8" : "#C9B6E4"} ${i * SEGMENT_ANGLE}deg ${(i + 1) * SEGMENT_ANGLE}deg`
            ).join(", ")})`,
          }}
        >
          {PRIZES.map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 flex items-start justify-center"
              style={{ transform: `rotate(${i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2}deg)` }}
              aria-hidden="true"
            >
              <span className="mt-4 text-lg">🎁</span>
            </div>
          ))}
        </motion.div>
      </div>

      <button
        type="button"
        onClick={spin}
        disabled={spinning}
        className="mt-10 px-8 py-3 rounded-full bg-gold text-plum font-display font-semibold text-lg shadow-lg hover:brightness-105 disabled:opacity-50 transition-all focus-visible:outline focus-visible:outline-2"
      >
        {spinning ? "Spinning..." : "Spin the Wheel"}
      </button>

      <div className="mt-6 min-h-[2rem]" role="status" aria-live="polite">
        {result && (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-hand text-2xl text-rose-gold-dark text-center"
          >
            You won: {result}
          </motion.p>
        )}
      </div>
    </section>
  );
}
