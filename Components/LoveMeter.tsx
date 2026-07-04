"use client";

/**
 * components/LoveMeter.tsx
 * A circular progress ring reflecting `loveMeterValue` from the global
 * store — increments as Megan interacts with the site (opens the letter,
 * finds the teddy, reads all reasons, etc). Pure SVG, no canvas needed
 * since it's a single static-ish shape.
 */
import { motion } from "framer-motion";
import { useLoveStore } from "@/lib/store";

const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function LoveMeter() {
  const value = useLoveStore((s) => s.loveMeterValue);
  const offset = CIRCUMFERENCE * (1 - value / 100);

  const label =
    value < 20
      ? "just getting started"
      : value < 50
      ? "warming up"
      : value < 80
      ? "falling deeper"
      : value < 100
      ? "head over heels"
      : "completely, hopelessly in love";

  return (
    <section
      id="love-meter"
      className="relative w-full px-6 py-24 flex flex-col items-center"
      aria-label="Love meter"
    >
      <h2 className="font-display text-4xl md:text-5xl text-plum mb-10 text-center">Love Meter</h2>

      <div className="relative w-48 h-48 md:w-56 md:h-56">
        <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
          <circle cx="80" cy="80" r={RADIUS} stroke="#FFE1E9" strokeWidth="12" fill="none" />
          <motion.circle
            cx="80"
            cy="80"
            r={RADIUS}
            stroke="url(#meterGradient)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB6C8" />
              <stop offset="100%" stopColor="#D4AF6A" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl text-plum">{value}%</span>
          <span className="text-2xl mt-1" aria-hidden="true">
            {value >= 100 ? "💍" : "💗"}
          </span>
        </div>
      </div>

      <p className="font-hand text-2xl text-rose-gold-dark mt-6 text-center">{label}</p>
      <p className="text-plum/50 text-sm font-body mt-2 max-w-sm text-center">
        keeps filling up the more of this site you explore
      </p>
    </section>
  );
}
