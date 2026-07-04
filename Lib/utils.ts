/**
 * lib/utils.ts
 * Pure, dependency-light utility functions shared across components.
 * Kept framework-agnostic (no React imports) so they're trivially unit-testable.
 */
import { parseISODate } from "./data";

/**
 * Returns the number of whole days elapsed between `startISO` and `now`.
 * Uses local-midnight boundaries so the count only increments once per
 * calendar day, never mid-day due to time-of-day drift.
 */
export function daysSince(startISO: string, now: Date = new Date()): number {
  const start = parseISODate(startISO);
  const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.max(0, Math.round((nowMidnight.getTime() - startMidnight.getTime()) / msPerDay));
}

/**
 * Returns a Date object for the NEXT occurrence of an annual anniversary,
 * given a reference date in "YYYY-MM-DD" form (year is ignored, only
 * month/day are reused). If today IS the anniversary, returns today.
 */
export function nextAnniversary(anniversaryISO: string, now: Date = new Date()): Date {
  const ref = parseISODate(anniversaryISO);
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let candidate = new Date(now.getFullYear(), ref.getMonth(), ref.getDate());
  if (candidate.getTime() < todayMidnight.getTime()) {
    candidate = new Date(now.getFullYear() + 1, ref.getMonth(), ref.getDate());
  }
  return candidate;
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

export function getCountdownParts(target: Date, now: Date = new Date()): CountdownParts {
  const totalMs = Math.max(0, target.getTime() - now.getTime());
  const seconds = Math.floor(totalMs / 1000) % 60;
  const minutes = Math.floor(totalMs / (1000 * 60)) % 60;
  const hours = Math.floor(totalMs / (1000 * 60 * 60)) % 24;
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds, totalMs };
}

/**
 * Deterministic pseudo-random number generator (mulberry32).
 * Used for particle layout (sakura petals, fireflies, stars) so that
 * server-rendered HTML and the client's first paint match exactly —
 * using Math.random() directly here would cause React hydration
 * mismatches because server and client would compute different values.
 */
export function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function clsx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Clamp a number between min and max (inclusive). */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Linear interpolation. */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * clamp(t, 0, 1);
}
