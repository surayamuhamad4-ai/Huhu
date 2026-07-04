"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const PROMISES: string[] = [
  "I promise to keep choosing you, on the easy days and the hard ones.",
  "I promise to celebrate every small win of yours like it's my own.",
  "I promise to be patient with you, the way you've always been with me.",
  "I promise to keep learning who you are, even years from now.",
  "I promise to never let you doubt how loved you are.",
  "I promise to build a home with you — not just a house, a home.",
];

export default function PromiseSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <section id="promises" ref={ref} className="relative w-full px-6 py-24" aria-label="Promises">
      <h2 className="font-display text-4xl md:text-5xl text-cream text-center mb-12">My Promises to You</h2>
      <div className="max-w-2xl mx-auto space-y-5">
        {PROMISES.map((promise, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="flex items-start gap-4 glass-card px-5 py-4"
          >
            <span className="text-xl mt-0.5" aria-hidden="true">🎀</span>
            <p className="font-body text-cream/90 leading-relaxed">{promise}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
