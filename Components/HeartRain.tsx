"use client";

/**
 * components/HeartRain.tsx
 * A one-shot burst of falling hearts, triggered whenever `triggerKey`
 * changes. Auto-unmounts itself after the animation completes so it
 * never accumulates DOM nodes across repeated triggers.
 */
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mulberry32 } from "@/lib/utils";

interface HeartRainProps {
  triggerKey: number;
  count?: number;
}

export default function HeartRain({ triggerKey, count = 28 }: HeartRainProps) {
  const [visible, setVisible] = useState(true);

  const hearts = useMemo(() => {
    const rand = mulberry32(triggerKey % 100000);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: rand() * 100,
      delay: rand() * 0.6,
      duration: 2.2 + rand() * 1.4,
      size: 16 + rand() * 22,
      drift: (rand() - 0.5) * 80,
      emoji: rand() > 0.5 ? "💕" : rand() > 0.5 ? "❤️" : "💗",
    }));
  }, [triggerKey, count]);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 4200);
    return () => clearTimeout(timer);
  }, [triggerKey]);

  return (
    <AnimatePresence>
      {visible && (
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
          {hearts.map((h) => (
            <motion.span
              key={h.id}
              initial={{ y: -40, x: 0, opacity: 0 }}
              animate={{ y: "110vh", x: h.drift, opacity: [0, 1, 1, 0] }}
              transition={{ duration: h.duration, delay: h.delay, ease: "easeIn" }}
              style={{ left: `${h.left}%`, fontSize: h.size, position: "absolute" }}
            >
              {h.emoji}
            </motion.span>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
