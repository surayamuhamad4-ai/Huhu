"use client";

/**
 * components/CatchHearts.tsx
 * A simple, self-contained mini-game: hearts fall from the top of a
 * play area; clicking/tapping one before it reaches the bottom scores a
 * point. Round lasts 30 seconds. Uses requestAnimationFrame for smooth
 * motion, with all spawn timing derived from elapsed time (not naive
 * setInterval stacking) to avoid drift or runaway spawn rates if the
 * tab is backgrounded and rAF throttles.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useLoveStore } from "@/lib/store";

interface FallingHeart {
  id: number;
  x: number; // percentage 0-100
  y: number; // px from top of play area
  speed: number; // px/sec
  caught: boolean;
}

const ROUND_DURATION_MS = 30000;
const SPAWN_INTERVAL_MS = 650;
const HEART_EMOJIS = ["💗", "💖", "💕", "❤️"];

export default function CatchHearts() {
  const [hearts, setHearts] = useState<FallingHeart[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeftMs, setTimeLeftMs] = useState(ROUND_DURATION_MS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const playAreaRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const lastSpawnRef = useRef(0);
  const startTimeRef = useRef(0);
  const nextIdRef = useRef(0);
  const heartsRef = useRef<FallingHeart[]>([]);

  const registerHeartCatch = useLoveStore((s) => s.registerHeartCatch);
  const unlockAchievement = useLoveStore((s) => s.unlockAchievement);
  const incrementLoveMeter = useLoveStore((s) => s.incrementLoveMeter);
  const heartsCaught = useLoveStore((s) => s.heartsCaught);

  const startGame = useCallback(() => {
    setScore(0);
    setHearts([]);
    heartsRef.current = [];
    setTimeLeftMs(ROUND_DURATION_MS);
    setHasFinished(false);
    setIsPlaying(true);
    startTimeRef.current = performance.now();
    lastSpawnRef.current = 0;
  }, []);

  const handleCatch = useCallback(
    (id: number) => {
      setHearts((prev) => prev.filter((h) => h.id !== id));
      heartsRef.current = heartsRef.current.filter((h) => h.id !== id);
      setScore((s) => s + 1);
      registerHeartCatch();
    },
    [registerHeartCatch]
  );

  useEffect(() => {
    if (!isPlaying) return;
    const playAreaHeight = playAreaRef.current?.offsetHeight ?? 400;

    function tick(now: number) {
      const elapsed = now - startTimeRef.current;
      const remaining = Math.max(0, ROUND_DURATION_MS - elapsed);
      setTimeLeftMs(remaining);

      if (remaining <= 0) {
        setIsPlaying(false);
        setHasFinished(true);
        return;
      }

      if (elapsed - lastSpawnRef.current > SPAWN_INTERVAL_MS) {
        lastSpawnRef.current = elapsed;
        const newHeart: FallingHeart = {
          id: nextIdRef.current++,
          x: 5 + Math.random() * 90,
          y: -20,
          speed: 60 + Math.random() * 70,
          caught: false,
        };
        heartsRef.current = [...heartsRef.current, newHeart];
      }

      heartsRef.current = heartsRef.current
        .map((h) => ({ ...h, y: h.y + (h.speed * 16) / 1000 }))
        .filter((h) => h.y < playAreaHeight + 30);

      setHearts([...heartsRef.current]);
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (heartsCaught >= 50) {
      unlockAchievement("caught-50-hearts");
    }
  }, [heartsCaught, unlockAchievement]);

  useEffect(() => {
    if (hasFinished && score > 0) {
      incrementLoveMeter(Math.min(10, Math.ceil(score / 3)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasFinished]);

  return (
    <section
      id="catch-hearts"
      className="relative w-full px-6 py-24 flex flex-col items-center"
      aria-label="Catch the hearts mini game"
    >
      <h2 className="font-display text-4xl md:text-5xl text-plum mb-3 text-center">Catch the Hearts</h2>
      <p className="text-plum/60 font-body mb-6 text-center">30 seconds, see how many you can catch</p>

      <div className="flex gap-8 mb-4 font-body text-plum">
        <span>
          Score: <strong>{score}</strong>
        </span>
        <span>
          Time: <strong>{Math.ceil(timeLeftMs / 1000)}s</strong>
        </span>
      </div>

      <div
        ref={playAreaRef}
        className="relative w-full max-w-xl h-[420px] rounded-2xl bg-white/50 border-2 border-sakura/30 overflow-hidden"
      >
        {!isPlaying && !hasFinished && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              onClick={startGame}
              className="px-8 py-3 rounded-full bg-sakura text-plum font-display font-semibold shadow-lg hover:bg-sakura-dark transition-colors focus-visible:outline focus-visible:outline-2"
            >
              Start Game
            </button>
          </div>
        )}

        {hasFinished && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/70 backdrop-blur-sm">
            <p className="font-display text-2xl text-plum">You caught {score} hearts! 💕</p>
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-2.5 rounded-full bg-sakura text-plum font-semibold shadow-md hover:bg-sakura-dark transition-colors focus-visible:outline focus-visible:outline-2"
            >
              Play Again
            </button>
          </div>
        )}

        {isPlaying &&
          hearts.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => handleCatch(h.id)}
              aria-label="Catch this heart"
              className="absolute text-3xl leading-none hover:scale-125 transition-transform select-none"
              style={{ left: `${h.x}%`, top: `${h.y}px` }}
            >
              {HEART_EMOJIS[h.id % HEART_EMOJIS.length]}
            </button>
          ))}
      </div>
    </section>
  );
}
