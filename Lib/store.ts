/**
 * lib/store.ts
 * Centralized client-side state using zustand. Persists to localStorage so
 * Megan's progress (achievements, easter eggs, wishes) survives page reloads.
 * Kept separate from server-rendered data (lib/data.ts) — this store only
 * ever holds ephemeral, browser-side interaction state, never secrets.
 */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AchievementId =
  | "found-teddy"
  | "popped-confetti"
  | "read-all-reasons"
  | "completed-timeline"
  | "caught-50-hearts"
  | "spun-wheel"
  | "planted-wish"
  | "found-secret-message"
  | "opened-all-letters";

export interface Wish {
  id: string;
  text: string;
  createdAt: string; // ISO timestamp
}

interface LoveStoreState {
  loveMeterValue: number; // 0-100, increments as Megan interacts with the site
  achievements: Record<AchievementId, boolean>;
  openedLetters: Record<string, boolean>;
  wishes: Wish[];
  heartsCaught: number;
  hasSeenIntro: boolean;

  incrementLoveMeter: (amount?: number) => void;
  unlockAchievement: (id: AchievementId) => void;
  openLetter: (id: string) => void;
  addWish: (text: string) => void;
  registerHeartCatch: () => void;
  markIntroSeen: () => void;
  resetProgress: () => void;
}

const ACHIEVEMENT_DEFAULTS: Record<AchievementId, boolean> = {
  "found-teddy": false,
  "popped-confetti": false,
  "read-all-reasons": false,
  "completed-timeline": false,
  "caught-50-hearts": false,
  "spun-wheel": false,
  "planted-wish": false,
  "found-secret-message": false,
  "opened-all-letters": false,
};

export const useLoveStore = create<LoveStoreState>()(
  persist(
    (set, get) => ({
      loveMeterValue: 0,
      achievements: ACHIEVEMENT_DEFAULTS,
      openedLetters: {},
      wishes: [],
      heartsCaught: 0,
      hasSeenIntro: false,

      incrementLoveMeter: (amount = 1) =>
        set((state) => ({
          loveMeterValue: Math.min(100, state.loveMeterValue + amount),
        })),

      unlockAchievement: (id) =>
        set((state) => ({
          achievements: { ...state.achievements, [id]: true },
        })),

      openLetter: (id) =>
        set((state) => ({
          openedLetters: { ...state.openedLetters, [id]: true },
        })),

      addWish: (text) => {
        const trimmed = text.trim().slice(0, 280); // hard cap to prevent abuse / storage bloat
        if (!trimmed) return;
        set((state) => ({
          wishes: [
            ...state.wishes,
            { id: crypto.randomUUID(), text: trimmed, createdAt: new Date().toISOString() },
          ],
        }));
        get().unlockAchievement("planted-wish");
      },

      registerHeartCatch: () =>
        set((state) => {
          const next = state.heartsCaught + 1;
          return { heartsCaught: next };
        }),

      markIntroSeen: () => set({ hasSeenIntro: true }),

      resetProgress: () =>
        set({
          loveMeterValue: 0,
          achievements: ACHIEVEMENT_DEFAULTS,
          openedLetters: {},
          wishes: [],
          heartsCaught: 0,
          hasSeenIntro: false,
        }),
    }),
    {
      name: "megan-love-progress",
      version: 1,
    }
  )
);
