"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { REASONS } from "@/lib/data";
import { useLoveStore } from "@/lib/store";

const BATCH_SIZE = 12;

function ReasonCard({ index, text }: { index: number; text: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % BATCH_SIZE) * 0.04 }}
      className="text-left glass-card p-4 min-h-[110px] flex flex-col justify-between hover:border-sakura/40 transition-colors"
      aria-expanded={flipped}
    >
      {!flipped ? (
        <>
          <span className="text-sakura font-display text-sm">#{index + 1}</span>
          <span className="text-cream/40 text-xs font-body mt-2">tap to reveal</span>
        </>
      ) : (
        <p className="font-body text-cream/90 text-sm leading-relaxed">{text}</p>
      )}
    </motion.button>
  );
}

export default function Reasons() {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const unlockAchievement = useLoveStore((s) => s.unlockAchievement);
  const incrementLoveMeter = useLoveStore((s) => s.incrementLoveMeter);
  const visibleReasons = useMemo(() => REASONS.slice(0, visibleCount), [visibleCount]);
  const allRevealed = visibleCount >= REASONS.length;

  useEffect(() => {
    if (allRevealed) { unlockAchievement("read-all-reasons"); incrementLoveMeter(10); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allRevealed]);

  return (
    <section id="reasons" className="relative w-full px-6 py-24" aria-label="Reasons I love you">
      <h2 className="font-display text-4xl md:text-5xl text-cream text-center mb-2">{REASONS.length}+ Reasons I Love You</h2>
      <p className="text-center text-cream/50 font-body mb-12">cheerful, beautiful, funny, always happy, and so comel</p>
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {visibleReasons.map((text, i) => <ReasonCard key={i} index={i} text={text} />)}
        </AnimatePresence>
      </div>
      <div className="flex justify-center mt-10">
        {!allRevealed ? (
          <button
            type="button"
            onClick={() => setVisibleCount((c) => Math.min(REASONS.length, c + BATCH_SIZE))}
            className="px-6 py-3 rounded-full bg-rose-gold text-plum font-body font-semibold shadow-md hover:bg-rose-gold-dark transition-colors focus-visible:outline focus-visible:outline-2"
          >
            Show {Math.min(BATCH_SIZE, REASONS.length - visibleCount)} more reasons
          </button>
        ) : (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-hand text-2xl text-rose-gold text-center">
            and a hundred more I haven&rsquo;t found words for yet 💛
          </motion.p>
        )}
      </div>
    </section>
  );
}
