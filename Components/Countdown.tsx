"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ANNIVERSARY_DATE, RELATIONSHIP_START } from "@/lib/data";
import { daysSince, nextAnniversary, getCountdownParts, type CountdownParts } from "@/lib/utils";

function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center glass-card px-4 py-3 md:px-6 md:py-4 min-w-[72px]">
      <motion.span
        key={value}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="font-display text-3xl md:text-4xl text-cream tabular-nums"
      >
        {String(value).padStart(2, "0")}
      </motion.span>
      <span className="text-xs uppercase tracking-wider text-cream/50 mt-1">{label}</span>
    </div>
  );
}

export default function Countdown() {
  const now   = useNow(1000);
  const days  = daysSince(RELATIONSHIP_START, now);
  const target = nextAnniversary(ANNIVERSARY_DATE, now);
  const parts: CountdownParts = getCountdownParts(target, now);

  return (
    <section id="countdown" className="relative w-full px-6 py-24 text-center" aria-label="Countdown and days together">
      <h2 className="font-display text-4xl md:text-5xl text-cream mb-3">Every Day, Counted</h2>
      <p className="font-hand text-2xl text-sakura mb-10">{days.toLocaleString("en-MY")} days of you and me, and counting</p>
      <p className="text-cream/50 font-body mb-4 text-sm uppercase tracking-widest">Until our next anniversary</p>
      <div className="flex flex-wrap justify-center gap-3 md:gap-4" role="timer" aria-live="off">
        <TimeUnit value={parts.days} label="days" />
        <TimeUnit value={parts.hours} label="hrs" />
        <TimeUnit value={parts.minutes} label="min" />
        <TimeUnit value={parts.seconds} label="sec" />
      </div>
    </section>
  );
}
