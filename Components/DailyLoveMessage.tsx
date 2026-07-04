"use client";
import { useMemo } from "react";

const DAILY_MESSAGES: string[] = [
  "Today's reminder: your smile is still my favorite thing in the world. 🌸",
  "Today's reminder: I'm grateful for you, even on the days I forget to say it. 💛",
  "Today's reminder: you make ordinary days feel a little more magical. ✨",
  "Today's reminder: whatever you're working on today, you've got this. 💪",
  "Today's reminder: I'm proud of you, quietly, all the time. 🌟",
  "Today's reminder: you are loved more than you probably realize. 💕",
  "Today's reminder: thank you for being exactly, unapologetically you. 🧸",
  "Today's reminder: I'd choose this — choose you — all over again. 💍",
  "Today's reminder: your laugh is still my favorite sound. 🎵",
  "Today's reminder: take a breath. You're doing better than you think. 🌙",
  "Today's reminder: I think about you more than you'd guess. 💭",
  "Today's reminder: you deserve every good thing coming your way. 🌺",
  "Today's reminder: being comel is basically your whole personality, and I love it. 🐰",
  "Today's reminder: I'm in your corner, always. 🎀",
];

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime() + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function DailyLoveMessage() {
  const message = useMemo(() => {
    const idx = dayOfYear(new Date()) % DAILY_MESSAGES.length;
    return DAILY_MESSAGES[idx]!;
  }, []);

  return (
    <div className="w-full flex justify-center px-6 py-8" aria-label="Today's love message">
      <p className="font-hand text-2xl md:text-3xl text-sakura text-center max-w-lg">{message}</p>
    </div>
  );
}
