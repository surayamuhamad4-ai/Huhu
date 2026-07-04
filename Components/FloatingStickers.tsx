"use client";

/**
 * components/FloatingStickers.tsx
 *
 * Cute character stickers (teddy, bunny, cats, hearts) from the uploaded
 * reference images, scattered across the page as fixed floating overlays.
 * Each sticker has its own float animation with randomised timing so they
 * move independently and never look in-sync / robotic.
 *
 * Images must exist in /public/images/ — they were included in the build.
 */
import { motion } from "framer-motion";
import Image from "next/image";

interface Sticker {
  src: string;
  alt: string;
  /** Fixed position as viewport % */
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: number;        // px
  floatDuration: number;
  floatDelay: number;
  rotateRange: number; // degrees
  opacity: number;
  zIndex?: number;
}

const STICKERS: Sticker[] = [
  {
    src:           "/images/teddy-bunny-hug.jpg",
    alt:           "Teddy and bunny hugging",
    bottom:        "12%",
    left:          "3%",
    size:          100,
    floatDuration: 5.5,
    floatDelay:    0,
    rotateRange:   4,
    opacity:       0.88,
    zIndex:        30,
  },
  {
    src:           "/images/cute-bunny.jpg",
    alt:           "Cute bunny with bow",
    top:           "18%",
    right:         "3%",
    size:          80,
    floatDuration: 6.2,
    floatDelay:    0.8,
    rotateRange:   6,
    opacity:       0.85,
    zIndex:        30,
  },
  {
    src:           "/images/teddy-bear.jpg",
    alt:           "Teddy bear",
    top:           "52%",
    left:          "1.5%",
    size:          72,
    floatDuration: 7,
    floatDelay:    1.4,
    rotateRange:   5,
    opacity:       0.80,
    zIndex:        30,
  },
  {
    src:           "/images/cat-flowers.jpg",
    alt:           "Cat holding flowers",
    top:           "30%",
    right:         "2%",
    size:          76,
    floatDuration: 5.8,
    floatDelay:    2.1,
    rotateRange:   7,
    opacity:       0.82,
    zIndex:        30,
  },
  {
    src:           "/images/heart-doodle.jpg",
    alt:           "Hand-drawn heart",
    top:           "8%",
    left:          "5%",
    size:          56,
    floatDuration: 4.8,
    floatDelay:    0.3,
    rotateRange:   10,
    opacity:       0.75,
    zIndex:        30,
  },
  {
    src:           "/images/pixel-heart.jpg",
    alt:           "Pixel art heart",
    bottom:        "30%",
    right:         "3%",
    size:          52,
    floatDuration: 5.2,
    floatDelay:    1.7,
    rotateRange:   8,
    opacity:       0.78,
    zIndex:        30,
  },
  {
    src:           "/images/couple-cats.jpg",
    alt:           "Couple cats",
    bottom:        "5%",
    right:         "5%",
    size:          90,
    floatDuration: 6.8,
    floatDelay:    2.5,
    rotateRange:   4,
    opacity:       0.82,
    zIndex:        30,
  },
  {
    src:           "/images/cute-cats.jpg",
    alt:           "Cute cat stickers",
    top:           "68%",
    right:         "2%",
    size:          80,
    floatDuration: 7.4,
    floatDelay:    3.0,
    rotateRange:   5,
    opacity:       0.75,
    zIndex:        30,
  },
];

export default function FloatingStickers() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {STICKERS.map((sticker, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top:     sticker.top,
            bottom:  sticker.bottom,
            left:    sticker.left,
            right:   sticker.right,
            zIndex:  sticker.zIndex ?? 30,
            opacity: sticker.opacity,
          }}
          animate={{
            y:      [0, -(14 + i * 2), 0],
            rotate: [-sticker.rotateRange / 2, sticker.rotateRange / 2, -sticker.rotateRange / 2],
          }}
          transition={{
            y:      { duration: sticker.floatDuration, repeat: Infinity, ease: "easeInOut", delay: sticker.floatDelay },
            rotate: { duration: sticker.floatDuration * 1.3, repeat: Infinity, ease: "easeInOut", delay: sticker.floatDelay + 0.4 },
          }}
        >
          <Image
            src={sticker.src}
            alt={sticker.alt}
            width={sticker.size}
            height={sticker.size}
            className="rounded-2xl shadow-lg shadow-black/40 object-cover"
            draggable={false}
          />
        </motion.div>
      ))}
    </div>
  );
}
