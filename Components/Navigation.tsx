"use client";
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero",          label: "Start"      },
  { id: "letter",        label: "Letter"     },
  { id: "timeline",      label: "Timeline"   },
  { id: "reasons",       label: "Reasons"    },
  { id: "countdown",     label: "Countdown"  },
  { id: "love-meter",    label: "Love Meter" },
  { id: "wish-jar",      label: "Wishes"     },
  { id: "lucky-wheel",   label: "Wheel"      },
  { id: "catch-hearts",  label: "Game"       },
  { id: "promises",      label: "Promises"   },
  { id: "wedding-dream", label: "Future"     },
  { id: "open-when",     label: "Letters"    },
  { id: "fortune-cookie",label: "Fortune"    },
  { id: "music",         label: "Music"      },
  { id: "easter-egg",    label: "Surprise"   },
];

export default function Navigation() {
  const [activeId, setActiveId] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const closest = visible.reduce((best, e) => {
          const bDist = Math.abs(best.boundingClientRect.top + best.boundingClientRect.height / 2 - window.innerHeight / 2);
          const eDist = Math.abs(e.boundingClientRect.top + e.boundingClientRect.height / 2 - window.innerHeight / 2);
          return eDist < bDist ? e : best;
        });
        setActiveId(closest.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => { const el = document.getElementById(s.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Page sections" className="hidden lg:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-label={`Go to ${s.label}`}
          aria-current={activeId === s.id ? "true" : undefined}
          className={`group relative w-2.5 h-2.5 rounded-full transition-all ${
            activeId === s.id ? "bg-sakura scale-125 shadow-[0_0_8px_rgba(255,182,200,0.8)]" : "bg-cream/20 hover:bg-cream/50"
          }`}
        >
          <span className="absolute right-5 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs glass-card text-cream px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {s.label}
          </span>
        </a>
      ))}
    </nav>
  );
}
