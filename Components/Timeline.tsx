"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { MILESTONES, parseISODate } from "@/lib/data";
import { useLoveStore } from "@/lib/store";

function formatDate(iso: string): string {
  const d = parseISODate(iso);
  return d.toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" });
}

function MilestoneCard({ milestone, index }: { milestone: (typeof MILESTONES)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8 py-10">
      <div className={isEven ? "text-right" : "col-start-3 text-left"}>
        <motion.div
          initial={{ opacity: 0, x: isEven ? -30 : 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="glass-card inline-block px-5 py-4 max-w-sm"
        >
          <p className="font-hand text-rose-gold text-lg">{formatDate(milestone.date)}</p>
          <h3 className="font-display text-xl text-cream mt-1">{milestone.emoji} {milestone.title}</h3>
          <p className="text-cream/70 text-sm mt-2 leading-relaxed">{milestone.description}</p>
        </motion.div>
      </div>
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="relative z-10 w-4 h-4 rounded-full bg-gold shadow-[0_0_0_6px_rgba(212,175,106,0.25)]"
      />
      <div className={isEven ? "col-start-3" : ""} />
    </div>
  );
}

export default function Timeline() {
  const unlockAchievement = useLoveStore((s) => s.unlockAchievement);
  const lastRef = useRef<HTMLDivElement>(null);
  const lastInView = useInView(lastRef, { once: true, margin: "-30% 0px" });

  useEffect(() => {
    if (lastInView) unlockAchievement("completed-timeline");
  }, [lastInView, unlockAchievement]);

  return (
    <section id="timeline" className="relative w-full px-6 py-24 overflow-hidden" aria-label="Our timeline">
      <h2 className="font-display text-4xl md:text-5xl text-cream text-center mb-4">Our Story So Far</h2>
      <p className="text-center text-cream/50 font-body mb-16">every thread, stitched together</p>
      <div className="relative max-w-3xl mx-auto">
        <div className="scene-thread" aria-hidden="true" />
        {MILESTONES.map((m, i) => <MilestoneCard key={m.id} milestone={m} index={i} />)}
        <div ref={lastRef} aria-hidden="true" />
      </div>
    </section>
  );
}
