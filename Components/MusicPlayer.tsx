"use client";

/**
 * components/MusicPlayer.tsx
 * Plays a local audio file via Howler.js. The actual "No. 1 Party Anthem"
 * by Arctic Monkeys audio file is NOT bundled with this codebase (it is
 * copyrighted commercial music) — this component expects you to place a
 * legally-owned copy at /public/audio/song.mp3. Until that file exists,
 * it shows a friendly empty state instead of throwing a broken-audio error.
 */
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SONG } from "@/lib/data";

export default function MusicPlayer() {
  const howlRef = useRef<import("howler").Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null); // null = checking
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    fetch(SONG.src, { method: "HEAD" })
      .then((res) => {
        if (!cancelled) setIsAvailable(res.ok);
      })
      .catch(() => {
        if (!cancelled) setIsAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isAvailable) return;
    let mounted = true;
    import("howler").then(({ Howl }) => {
      if (!mounted) return;
      howlRef.current = new Howl({ src: [SONG.src], html5: true, loop: true, volume: 0.5 });
    });
    return () => {
      mounted = false;
      howlRef.current?.unload();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isAvailable]);

  function togglePlay() {
    const howl = howlRef.current;
    if (!howl) return;
    if (isPlaying) {
      howl.pause();
      setIsPlaying(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    } else {
      howl.play();
      setIsPlaying(true);
      const updateProgress = () => {
        const dur = howl.duration() || 1;
        setProgress((howl.seek() as number) / dur);
        rafRef.current = requestAnimationFrame(updateProgress);
      };
      updateProgress();
    }
  }

  return (
    <section
      id="music"
      className="relative w-full bg-plum px-6 py-20 flex flex-col items-center text-cream"
      aria-label="Our song"
    >
      <h2 className="font-display text-3xl md:text-4xl mb-2 text-center">Our Song</h2>
      <p className="font-hand text-xl text-sakura-light mb-8">
        {SONG.title} — {SONG.artist}
      </p>

      {isAvailable === false && (
        <div className="text-center max-w-md text-cream/60 text-sm font-body border border-cream/20 rounded-xl px-6 py-5">
          🎵 Add your own legally-owned copy of the track to{" "}
          <code className="text-gold">/public/audio/song.mp3</code> and this player will work
          automatically — no further code changes needed.
        </div>
      )}

      {isAvailable && (
        <div className="flex flex-col items-center gap-4 w-full max-w-sm">
          <motion.button
            type="button"
            onClick={togglePlay}
            whileTap={{ scale: 0.92 }}
            aria-label={isPlaying ? "Pause song" : "Play song"}
            className="w-20 h-20 rounded-full bg-sakura text-plum text-3xl flex items-center justify-center shadow-lg shadow-sakura/30"
          >
            {isPlaying ? "⏸" : "▶"}
          </motion.button>
          <div className="w-full h-1.5 rounded-full bg-cream/20 overflow-hidden">
            <div
              className="h-full bg-gold transition-[width] duration-200"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
