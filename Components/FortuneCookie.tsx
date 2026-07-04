"use client";

/**
 * components/FortuneCookie.tsx
 * A clickable fortune cookie that "cracks" open to reveal a random
 * fortune message. Genuinely random (Math.random) since this is a
 * one-off user-triggered action, not part of initial render — no
 * hydration mismatch risk here.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FORTUNES: string[] = [
  "A surprise milk tea is closer than you think.",
  "Someone is thinking about you right now. (It's me.)",
  "Good things come to those who study a little more today.",
  "Your next photo together will be your new favorite.",
  "A compliment is heading your way today — accept it fully.",
  "The best chapter of your story hasn't been written yet.",
  "You will laugh harder than expected sometime this week.",
  "Someone finds your laugh genuinely magnetic.",
  "Today is a good day to be a little kinder to yourself.",
  "A small act of comel-ness today will make someone's whole day.",
];

export default function FortuneCookie() {
  const [cracked, setCracked] = useState(false);
  const [fortune, setFortune] = useState<string | null>(null);

  function crack() {
    if (cracked) return;
    const pick = FORTUNES[Math.floor(Math.random() * FORTUNES.length)]!;
    setFortune(pick);
    setCracked(true);
  }

  function reset() {
    setCracked(false);
    setFortune(null);
  }

  return (
    <section
      id="fortune-cookie"
      className="relative w-full px-6 py-20 flex flex-col items-center"
      aria-label="Fortune cookie"
    >
      <h2 className="font-display text-3xl md:text-4xl text-plum mb-8 text-center">
        Crack a Fortune Cookie
      </h2>

      <button
        type="button"
        onClick={cracked ? reset : crack}
        aria-label={cracked ? "Reset fortune cookie" : "Crack open the fortune cookie"}
        className="relative"
      >
        <AnimatePresence mode="wait">
          {!cracked ? (
            <motion.span
              key="whole"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: [0, -3, 3, 0] }}
              exit={{ scale: 1.3, opacity: 0 }}
              transition={{ rotate: { duration: 2, repeat: Infinity } }}
              className="block text-7xl"
            >
              🥠
            </motion.span>
          ) : (
            <motion.span
              key="cracked"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="block text-7xl grayscale-0"
            >
              🥠💥
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <div className="min-h-[3rem] mt-6" role="status" aria-live="polite">
        {fortune && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-hand text-2xl text-rose-gold-dark text-center max-w-sm"
          >
            {fortune}
          </motion.p>
        )}
      </div>

      {cracked && (
        <button
          type="button"
          onClick={reset}
          className="mt-4 text-sm text-plum/50 underline focus-visible:outline focus-visible:outline-2"
        >
          crack another
        </button>
      )}
    </section>
  );
}
