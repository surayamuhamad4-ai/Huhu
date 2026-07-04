"use client";

/**
 * components/AchievementsPanel.tsx
 * Surfaces the achievement-tracking already wired throughout the site
 * (CursorTeddy, Reasons, Timeline, WishJar, LuckyWheel, CatchHearts,
 * OpenWhenLetters, EasterEgg all call `unlockAchievement`). A floating
 * trophy button opens a drawer listing all achievements and their
 * unlocked state, with a live badge count.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoveStore, type AchievementId } from "@/lib/store";

const ACHIEVEMENT_META: Record<AchievementId, { label: string; emoji: string }> = {
  "found-teddy": { label: "Made the teddy wave", emoji: "🧸" },
  "popped-confetti": { label: "Popped some confetti", emoji: "🎉" },
  "read-all-reasons": { label: `Read every reason`, emoji: "📜" },
  "completed-timeline": { label: "Walked the whole timeline", emoji: "🧵" },
  "caught-50-hearts": { label: "Caught 50 hearts", emoji: "💞" },
  "spun-wheel": { label: "Spun the lucky wheel", emoji: "🎡" },
  "planted-wish": { label: "Planted a wish", emoji: "⭐" },
  "found-secret-message": { label: "Found the hidden message", emoji: "🔍" },
  "opened-all-letters": { label: "Opened every 'Open When' letter", emoji: "💌" },
};

const ACHIEVEMENT_IDS = Object.keys(ACHIEVEMENT_META) as AchievementId[];

export default function AchievementsPanel() {
  const [open, setOpen] = useState(false);
  const achievements = useLoveStore((s) => s.achievements);
  const unlockedCount = ACHIEVEMENT_IDS.filter((id) => achievements[id]).length;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Achievements: ${unlockedCount} of ${ACHIEVEMENT_IDS.length} unlocked`}
        aria-expanded={open}
        className="fixed top-4 right-4 z-40 w-11 h-11 rounded-full bg-white/80 dark:bg-plum/80 backdrop-blur shadow-md flex items-center justify-center text-lg focus-visible:outline focus-visible:outline-2"
      >
        🏆
        {unlockedCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gold text-plum text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unlockedCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-plum/40 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              role="dialog"
              aria-modal="true"
              aria-label="Achievements"
              className="fixed top-0 right-0 z-50 h-full w-full max-w-xs bg-white shadow-2xl px-6 py-8 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl text-plum">
                  Achievements ({unlockedCount}/{ACHIEVEMENT_IDS.length})
                </h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close achievements panel"
                  className="text-plum/50 hover:text-plum text-xl focus-visible:outline focus-visible:outline-2"
                >
                  ✕
                </button>
              </div>
              <ul className="space-y-3">
                {ACHIEVEMENT_IDS.map((id) => {
                  const unlocked = achievements[id];
                  const meta = ACHIEVEMENT_META[id];
                  return (
                    <li
                      key={id}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 border ${
                        unlocked
                          ? "bg-sakura-light/40 border-sakura/40"
                          : "bg-plum/5 border-transparent opacity-50"
                      }`}
                    >
                      <span className="text-xl" aria-hidden="true">
                        {unlocked ? meta.emoji : "🔒"}
                      </span>
                      <span className="text-sm font-body text-plum">{meta.label}</span>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
