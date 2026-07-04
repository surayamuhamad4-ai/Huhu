"use client";

/**
 * components/ParticlesLayer.tsx
 *
 * Renders ambient particle effects (sakura petals, fireflies, stars,
 * hearts) on a single <canvas>, driven by requestAnimationFrame.
 *
 * WHY CANVAS INSTEAD OF DOM NODES:
 * Rendering 60-150 particles as individually animated `<motion.div>`
 * elements causes serious layout/paint thrashing on mobile Safari/Chrome,
 * especially when stacked across multiple scroll sections. A single
 * canvas with manual particle physics keeps this at a steady frame rate
 * even on mid-range phones, and respects `prefers-reduced-motion` by
 * rendering a single static frame instead of animating.
 */
import { useEffect, useRef } from "react";
import { mulberry32 } from "@/lib/utils";

export type ParticleVariant = "sakura" | "firefly" | "star" | "heart" | "snow";

interface ParticlesLayerProps {
  variant: ParticleVariant;
  count?: number;
  className?: string;
  /** Seed keeps particle layout deterministic between server and client renders. */
  seed?: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  phase: number; // for flicker/twinkle timing
}

const VARIANT_COLORS: Record<ParticleVariant, string> = {
  sakura: "#FFB6C8",
  firefly: "#D4AF6A",
  star: "#FFFFFF",
  heart: "#FF8FAB",
  snow: "#FFFFFF",
};

function drawParticle(
  ctx: CanvasRenderingContext2D,
  p: Particle,
  variant: ParticleVariant,
  time: number
) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.globalAlpha = p.opacity;

  switch (variant) {
    case "sakura": {
      ctx.fillStyle = VARIANT_COLORS.sakura;
      for (let i = 0; i < 5; i++) {
        ctx.rotate((Math.PI * 2) / 5);
        ctx.beginPath();
        ctx.ellipse(0, p.size * 0.6, p.size * 0.45, p.size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "heart": {
      const s = p.size * 0.5;
      ctx.fillStyle = VARIANT_COLORS.heart;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(-s, -s * 0.6, -s * 1.6, s * 0.5, 0, s * 1.6);
      ctx.bezierCurveTo(s * 1.6, s * 0.5, s, -s * 0.6, 0, s * 0.3);
      ctx.fill();
      break;
    }
    case "firefly": {
      const flicker = 0.5 + 0.5 * Math.sin(time / 400 + p.phase);
      ctx.globalAlpha = p.opacity * flicker;
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2);
      grad.addColorStop(0, VARIANT_COLORS.firefly);
      grad.addColorStop(1, "rgba(212,175,106,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "star": {
      const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(time / 900 + p.phase));
      ctx.globalAlpha = p.opacity * twinkle;
      ctx.fillStyle = VARIANT_COLORS.star;
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "snow": {
      ctx.fillStyle = VARIANT_COLORS.snow;
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }
  ctx.restore();
}

export default function ParticlesLayer({
  variant,
  count = 40,
  className = "",
  seed = 42,
}: ParticlesLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const rand = mulberry32(seed + variant.length);
    let width = (canvas.width = canvas.offsetWidth * devicePixelRatio);
    let height = (canvas.height = canvas.offsetHeight * devicePixelRatio);
    ctx.scale(devicePixelRatio, devicePixelRatio);

    function initParticles() {
      const cssWidth = canvas!.offsetWidth;
      const cssHeight = canvas!.offsetHeight;
      particlesRef.current = Array.from({ length: count }, () => ({
        x: rand() * cssWidth,
        y: rand() * cssHeight,
        size: 6 + rand() * 10,
        speedY: 0.2 + rand() * 0.6,
        speedX: (rand() - 0.5) * 0.4,
        rotation: rand() * Math.PI * 2,
        rotationSpeed: (rand() - 0.5) * 0.02,
        opacity: 0.3 + rand() * 0.6,
        phase: rand() * Math.PI * 2,
      }));
    }
    initParticles();

    function resize() {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.scale(devicePixelRatio, devicePixelRatio);
    }
    window.addEventListener("resize", resize);

    function renderStaticFrame() {
      const cssWidth = canvas!.offsetWidth;
      const cssHeight = canvas!.offsetHeight;
      ctx!.clearRect(0, 0, cssWidth, cssHeight);
      particlesRef.current.forEach((p) => drawParticle(ctx!, p, variant, 0));
    }

    if (prefersReducedMotion) {
      renderStaticFrame();
      return () => window.removeEventListener("resize", resize);
    }

    function tick(time: number) {
      const cssWidth = canvas!.offsetWidth;
      const cssHeight = canvas!.offsetHeight;
      ctx!.clearRect(0, 0, cssWidth, cssHeight);

      for (const p of particlesRef.current) {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time / 2000 + p.phase) * 0.3;
        p.rotation += p.rotationSpeed;

        if (p.y > cssHeight + 20) {
          p.y = -20;
          p.x = rand() * cssWidth;
        }
        if (p.x > cssWidth + 20) p.x = -20;
        if (p.x < -20) p.x = cssWidth + 20;

        drawParticle(ctx!, p, variant, time);
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, count, seed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
    />
  );
}
