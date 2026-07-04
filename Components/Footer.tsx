"use client";
import { RELATIONSHIP_START, MILESTONES, REASONS, GIRLFRIEND_FIRST_NAME } from "@/lib/data";
import { daysSince } from "@/lib/utils";

export default function Footer() {
  const days = daysSince(RELATIONSHIP_START);
  const stats = [
    { label: "Days together",             value: days.toLocaleString("en-MY") },
    { label: "Milestones marked",         value: MILESTONES.length },
    { label: "Reasons written",           value: `${REASONS.length}+` },
    { label: "Times I'd choose you again", value: "∞" },
  ];

  return (
    <footer className="relative w-full px-6 py-20 text-center glass-card mx-0 rounded-none border-x-0 border-b-0">
      <h2 className="font-display text-2xl md:text-3xl text-cream mb-10">Us, in Numbers</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-14">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="font-display text-3xl text-gold">{s.value}</p>
            <p className="text-cream/50 text-xs uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="font-hand text-2xl text-sakura">made with every bit of love I have, for {GIRLFRIEND_FIRST_NAME}. 🌸</p>
      <p className="text-cream/30 text-xs mt-6">© {new Date().getFullYear()} — just for us</p>
    </footer>
  );
}
