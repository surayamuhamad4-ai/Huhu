"use client";

/**
 * components/PixelSpaceBackground.tsx
 *
 * Full-page fixed canvas background inspired by the pixel solar system
 * reference image. Renders:
 *   1. Deep space gradient (near-black → deep purple)
 *   2. 220 twinkling stars (mulberry32 seeded — no hydration mismatch)
 *   3. Periodic shooting stars streaking across the screen
 *   4. 7 pixel-art planets slowly floating / bobbing at fixed regions
 *
 * All drawn on a single <canvas> — no per-frame DOM layout costs.
 * Respects prefers-reduced-motion: static first frame only.
 */
import { useEffect, useRef } from "react";
import { mulberry32 } from "@/lib/utils";

/* ─── Planet definitions ─────────────────────────────────────────────── */
interface PlanetDef {
  name: string;
  /** Position as fraction of canvas width/height */
  xFrac: number;
  yFrac: number;
  /** Logical radius before pixel scaling */
  logicalR: number;
  /** How many real pixels each "pixel" occupies — creates the pixel art look */
  pixelSize: number;
  layers: { r: number; color: string }[]; // concentric pixel rings, outside→in
  ringColor?: string;
  bobSpeed: number;   // radians per second
  bobAmt: number;     // pixels
  bobPhase: number;   // starting phase offset
}

const PLANETS: PlanetDef[] = [
  {
    name: "sun",
    xFrac: 0.88,
    yFrac: 0.06,
    logicalR: 14,
    pixelSize: 4,
    layers: [
      { r: 14, color: "#FF4400" },
      { r: 12, color: "#FF6600" },
      { r: 10, color: "#FF8800" },
      { r: 8,  color: "#FFAA00" },
      { r: 5,  color: "#FFCC00" },
      { r: 3,  color: "#FFE566" },
    ],
    bobSpeed: 0.18,
    bobAmt: 6,
    bobPhase: 0,
  },
  {
    name: "jupiter",
    xFrac: 0.15,
    yFrac: 0.72,
    logicalR: 11,
    pixelSize: 3,
    layers: [
      { r: 11, color: "#8B6914" },
      { r: 9,  color: "#C4943B" },
      { r: 7,  color: "#E8B86D" },
      { r: 5,  color: "#D4A055" },
      { r: 3,  color: "#F0C880" },
    ],
    bobSpeed: 0.12,
    bobAmt: 8,
    bobPhase: 1.2,
  },
  {
    name: "saturn",
    xFrac: 0.5,
    yFrac: 0.82,
    logicalR: 8,
    pixelSize: 3,
    layers: [
      { r: 8,  color: "#9B8855" },
      { r: 6,  color: "#C4A86B" },
      { r: 4,  color: "#D4B87A" },
      { r: 2,  color: "#E8CC90" },
    ],
    ringColor: "#C4A86B",
    bobSpeed: 0.14,
    bobAmt: 7,
    bobPhase: 2.1,
  },
  {
    name: "earth",
    xFrac: 0.35,
    yFrac: 0.32,
    logicalR: 6,
    pixelSize: 3,
    layers: [
      { r: 6,  color: "#1A4A8A" },
      { r: 5,  color: "#2266BB" },
      { r: 4,  color: "#33AA55" },
      { r: 2,  color: "#55CC66" },
      { r: 1,  color: "#AADDFF" },
    ],
    bobSpeed: 0.22,
    bobAmt: 5,
    bobPhase: 0.6,
  },
  {
    name: "neptune",
    xFrac: 0.82,
    yFrac: 0.78,
    logicalR: 7,
    pixelSize: 3,
    layers: [
      { r: 7,  color: "#112255" },
      { r: 5,  color: "#1A3388" },
      { r: 3,  color: "#2255BB" },
      { r: 1,  color: "#4488DD" },
    ],
    bobSpeed: 0.10,
    bobAmt: 9,
    bobPhase: 3.8,
  },
  {
    name: "mars",
    xFrac: 0.62,
    yFrac: 0.18,
    logicalR: 5,
    pixelSize: 3,
    layers: [
      { r: 5,  color: "#882211" },
      { r: 3,  color: "#BB4422" },
      { r: 1,  color: "#DD6644" },
    ],
    bobSpeed: 0.28,
    bobAmt: 4,
    bobPhase: 1.9,
  },
  {
    name: "uranus",
    xFrac: 0.08,
    yFrac: 0.42,
    logicalR: 6,
    pixelSize: 3,
    layers: [
      { r: 6,  color: "#227799" },
      { r: 4,  color: "#33AACC" },
      { r: 2,  color: "#55CCDD" },
    ],
    bobSpeed: 0.16,
    bobAmt: 6,
    bobPhase: 4.5,
  },
];

/* ─── Drawing helpers ────────────────────────────────────────────────── */

/**
 * Draw a pixel-art planet by rendering to a tiny offscreen canvas then
 * scaling up with imageSmoothingEnabled = false (nearest-neighbour),
 * which produces the hard pixel edges of the reference image.
 */
function drawPixelPlanet(
  ctx: CanvasRenderingContext2D,
  planet: PlanetDef,
  cx: number,
  cy: number
) {
  const { logicalR, pixelSize, layers, ringColor } = planet;
  const offDim = (logicalR * 2 + 4) ;
  const off = document.createElement("canvas");
  off.width  = offDim;
  off.height = offDim;
  const offCtx = off.getContext("2d")!;
  const center = logicalR + 2;

  // Draw concentric filled circles from outside-in (painter's algorithm)
  for (const layer of layers) {
    offCtx.beginPath();
    offCtx.arc(center, center, layer.r, 0, Math.PI * 2);
    offCtx.fillStyle = layer.color;
    offCtx.fill();
  }

  // Scale up with nearest-neighbour for pixel art look
  const displaySize = offDim * pixelSize;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(off, cx - displaySize / 2, cy - displaySize / 2, displaySize, displaySize);
  ctx.restore();

  // Saturn's ring — drawn after the planet, pixel-snapped
  if (ringColor) {
    const rW = displaySize * 0.85;
    const rH = displaySize * 0.18;
    ctx.save();
    ctx.strokeStyle = ringColor;
    ctx.lineWidth   = pixelSize * 2;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rW, rH, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

/* ─── Component ─────────────────────────────────────────────────────── */

export default function PixelSpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ── Resize handling ── */
    function resize() {
      canvas!.width  = window.innerWidth  * devicePixelRatio;
      canvas!.height = window.innerHeight * devicePixelRatio;
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.scale(devicePixelRatio, devicePixelRatio);
    }
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.width  / devicePixelRatio;
    const H = () => canvas.height / devicePixelRatio;

    /* ── Stars ── */
    const rand = mulberry32(31415);
    const STAR_COUNT = 220;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x:      rand(),
      y:      rand(),
      size:   0.5 + rand() * 2,
      phase:  rand() * Math.PI * 2,
      speed:  0.4 + rand() * 1.2,
    }));

    /* ── Shooting stars ── */
    interface ShootingStar {
      x: number; y: number;
      vx: number; vy: number;
      len: number;
      life: number;      // 0→1 progress
      maxLife: number;   // ms
      startTime: number;
    }
    const shootingStars: ShootingStar[] = [];
    let lastShoot = 0;
    const SHOOT_INTERVAL = 2800; // ms between spawns

    function spawnShootingStar(now: number) {
      const angle = (15 + Math.random() * 30) * (Math.PI / 180);
      const speed = 420 + Math.random() * 280;
      shootingStars.push({
        x:         Math.random() * W() * 0.8,
        y:         Math.random() * H() * 0.4,
        vx:        Math.cos(angle) * speed,
        vy:        Math.sin(angle) * speed,
        len:       80 + Math.random() * 120,
        life:      0,
        maxLife:   600 + Math.random() * 400,
        startTime: now,
      });
    }

    /* ── Main render loop ── */
    function draw(now: number) {
      const w = W(), h = H();

      /* — Background gradient — */
      const bg = ctx!.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0,   "#0A0614");
      bg.addColorStop(0.4, "#0D0A20");
      bg.addColorStop(0.7, "#150C19");
      bg.addColorStop(1,   "#0A0614");
      ctx!.fillStyle = bg;
      ctx!.fillRect(0, 0, w, h);

      /* — Stars — */
      for (const s of stars) {
        const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(now / 900 * s.speed + s.phase));
        ctx!.globalAlpha = twinkle;
        ctx!.fillStyle   = "#FFFFFF";
        ctx!.beginPath();
        ctx!.arc(s.x * w, s.y * h, s.size, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;

      /* — Shooting stars — */
      if (now - lastShoot > SHOOT_INTERVAL) {
        spawnShootingStar(now);
        lastShoot = now;
      }
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i]!;
        const elapsed = now - ss.startTime;
        ss.life = elapsed / ss.maxLife;
        if (ss.life >= 1) { shootingStars.splice(i, 1); continue; }

        const progress = ss.life;
        const alpha    = progress < 0.2
          ? progress / 0.2
          : progress > 0.7
          ? 1 - (progress - 0.7) / 0.3
          : 1;

        const x2 = ss.x + ss.vx * (elapsed / 1000);
        const y2 = ss.y + ss.vy * (elapsed / 1000);
        const x1 = x2 - (ss.vx / Math.abs(ss.vx)) * ss.len;
        const y1 = y2 - (ss.vy / Math.abs(ss.vy)) * ss.len * 0.4;

        const grad = ctx!.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(0.6, `rgba(212,175,106,${alpha * 0.6})`);
        grad.addColorStop(1, `rgba(255,255,255,${alpha})`);

        ctx!.save();
        ctx!.strokeStyle = grad;
        ctx!.lineWidth   = 2.5;
        ctx!.beginPath();
        ctx!.moveTo(x1, y1);
        ctx!.lineTo(x2, y2);
        ctx!.stroke();

        // Sparkle at tip
        ctx!.globalAlpha = alpha;
        ctx!.fillStyle   = "#FFFFFF";
        ctx!.beginPath();
        ctx!.arc(x2, y2, 2.5, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.globalAlpha = 1;
        ctx!.restore();
      }

      /* — Planets — */
      for (const planet of PLANETS) {
        const bob = Math.sin(now / 1000 * planet.bobSpeed + planet.bobPhase) * planet.bobAmt;
        const cx  = planet.xFrac * w;
        const cy  = planet.yFrac * h + bob;
        drawPixelPlanet(ctx!, planet, cx, cy);
      }

      if (!reducedMotion) {
        rafRef.current = requestAnimationFrame(draw);
      }
    }

    if (reducedMotion) {
      draw(0);
    } else {
      rafRef.current = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none w-full h-full"
    />
  );
}
