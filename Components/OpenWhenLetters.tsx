"use client";

/**
 * components/OpenWhenLetters.tsx
 * A grid of "Open When..." envelopes. Each one is a self-contained
 * mini-letter written for that specific emotional context, opened
 * individually and tracked in the store (openLetter).
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OPEN_WHEN_LETTERS, GIRLFRIEND_FIRST_NAME } from "@/lib/data";
import { useLoveStore } from "@/lib/store";

const LETTER_CONTENT: Record<string, string> = {
  sad: `Hey, ${GIRLFRIEND_FIRST_NAME}. If you're reading this, something's weighing on you. I won't pretend I can fix it from here, but I want you to know: whatever it is, it doesn't change how I see you. You're allowed to feel exactly what you're feeling. Take your time. I'm not going anywhere.`,
  happy: `If you're opening this on a really good day — I'm so happy for you. Tell me about it, every detail, even the small ones. Your happiness is one of my favorite things in the world to witness.`,
  "missing-me": `Missing me, huh? I'm probably thinking about you right now too — that's just how it works between us. Text me something random. I'll drop whatever I'm doing to talk to you.`,
  stressed: `Exams stressing you out? Breathe. You've handled hard things before, and you'll handle this too. You don't have to be perfect, you just have to keep showing up — which you always do, more than you give yourself credit for.`,
  doubt: `If you're ever doubting how much I love you — stop, and reread the letter on this site. Every word in it was true the day I wrote it, and it's still true now. You are not a maybe to me.`,
  proud: `Whatever you just did — congratulations. I'm proud of you, genuinely, not just because I love you but because I've watched how hard you work. Go celebrate. You earned it.`,
};

export default function OpenWhenLetters() {
  const [openedId, setOpenedId] = useState<string | null>(null);
  const openLetter = useLoveStore((s) => s.openLetter);
  const openedLetters = useLoveStore((s) => s.openedLetters);
  const unlockAchievement = useLoveStore((s) => s.unlockAchievement);

  function handleOpen(id: string) {
    setOpenedId(id);
    openLetter(id);
    if (OPEN_WHEN_LETTERS.every((l) => openedLetters[l.id] || l.id === id)) {
      unlockAchievement("opened-all-letters");
    }
  }

  return (
    <section
      id="open-when"
      className="relative w-full px-6 py-24"
      aria-label="Open when letters"
    >
      <h2 className="font-display text-4xl md:text-5xl text-plum text-center mb-3">
        &ldquo;Open When...&rdquo; Letters
      </h2>
      <p className="text-center text-plum/60 font-body mb-12">for whenever you need one</p>

      <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        {OPEN_WHEN_LETTERS.map((letter) => (
          <button
            key={letter.id}
            type="button"
            onClick={() => handleOpen(letter.id)}
            className="text-left bg-gradient-to-br from-rose-gold/20 to-sakura/20 hover:from-rose-gold/30 hover:to-sakura/30 border border-rose-gold/30 rounded-xl px-5 py-4 transition-colors flex items-center justify-between gap-3"
          >
            <span className="font-hand text-xl text-plum">{letter.trigger}</span>
            <span aria-hidden="true">{openedLetters[letter.id] ? "💌" : "✉️"}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {openedId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-plum/60 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setOpenedId(null)}
            role="dialog"
            aria-modal="true"
            aria-label={OPEN_WHEN_LETTERS.find((l) => l.id === openedId)?.title}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full px-7 py-8 shadow-2xl"
            >
              <h3 className="font-display text-2xl text-plum mb-4">
                {OPEN_WHEN_LETTERS.find((l) => l.id === openedId)?.title}
              </h3>
              <p className="font-body text-plum/80 leading-relaxed">{LETTER_CONTENT[openedId]}</p>
              <button
                type="button"
                onClick={() => setOpenedId(null)}
                className="mt-6 px-5 py-2 rounded-full bg-rose-gold text-cream font-semibold focus-visible:outline focus-visible:outline-2"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
