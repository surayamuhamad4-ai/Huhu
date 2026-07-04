"use client";
import { motion } from "framer-motion";
import { GIRLFRIEND_FIRST_NAME } from "@/lib/data";
import ParticlesLayer from "./ParticlesLayer";

export default function WeddingDream() {
  return (
    <section id="wedding-dream" className="relative w-full min-h-[80vh] px-6 py-24 flex flex-col items-center justify-center text-center overflow-hidden" aria-label="Our wedding dream">
      <ParticlesLayer variant="sakura" count={12} seed={17} />
      <motion.span initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-6xl mb-6 relative z-10" aria-hidden="true">👰🤵</motion.span>
      <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="relative z-10 font-display text-3xl md:text-5xl text-cream max-w-2xl text-balance leading-snug">
        One day, {GIRLFRIEND_FIRST_NAME}, I hope to see you in white —<br className="hidden md:block" /> and stand right beside you.
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }} className="relative z-10 font-hand text-2xl text-sakura mt-8 max-w-xl">
        not just for your beauty, but for your kindness, your strength, and the one-of-a-kind person you are.
      </motion.p>
    </section>
  );
}
