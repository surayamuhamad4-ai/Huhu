import { describe, it, expect } from "vitest";
import { daysSince, nextAnniversary, getCountdownParts, mulberry32, clamp, lerp } from "@/lib/utils";
import { parseISODate } from "@/lib/data";

describe("parseISODate", () => {
  it("parses an ISO date string into local midnight, not UTC", () => {
    const d = parseISODate("2025-12-26");
    expect(d.getFullYear()).toBe(2025);
    expect(d.getMonth()).toBe(11); // 0-indexed
    expect(d.getDate()).toBe(26);
  });

  it("throws on malformed input rather than silently returning Invalid Date", () => {
    expect(() => parseISODate("not-a-date")).toThrow();
  });
});

describe("daysSince", () => {
  it("returns 0 on the start date itself", () => {
    const start = "2025-12-26";
    const now = parseISODate(start);
    expect(daysSince(start, now)).toBe(0);
  });

  it("returns 1 the day after the start date", () => {
    const start = "2025-12-26";
    const now = new Date(2025, 11, 27);
    expect(daysSince(start, now)).toBe(1);
  });

  it("never returns a negative number even if now precedes start", () => {
    const start = "2025-12-26";
    const now = new Date(2025, 11, 1);
    expect(daysSince(start, now)).toBe(0);
  });

  it("counts correctly across a year boundary", () => {
    const start = "2025-12-26";
    const now = new Date(2026, 0, 19); // Jan 19 2026
    expect(daysSince(start, now)).toBe(24);
  });
});

describe("nextAnniversary", () => {
  it("rolls over to next year if the anniversary already passed this year", () => {
    const anniversary = "2026-07-21";
    const now = new Date(2026, 7, 1); // Aug 1 2026, after July 21
    const result = nextAnniversary(anniversary, now);
    expect(result.getFullYear()).toBe(2027);
    expect(result.getMonth()).toBe(6);
    expect(result.getDate()).toBe(21);
  });

  it("returns this year's date if the anniversary has not yet occurred", () => {
    const anniversary = "2026-07-21";
    const now = new Date(2026, 0, 1); // Jan 1 2026
    const result = nextAnniversary(anniversary, now);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(6);
    expect(result.getDate()).toBe(21);
  });
});

describe("getCountdownParts", () => {
  it("clamps to zero when target is in the past", () => {
    const target = new Date(2020, 0, 1);
    const now = new Date(2026, 0, 1);
    const parts = getCountdownParts(target, now);
    expect(parts.totalMs).toBe(0);
    expect(parts.days).toBe(0);
  });

  it("computes correct day/hour/minute/second breakdown", () => {
    const now = new Date(2026, 0, 1, 0, 0, 0);
    const target = new Date(2026, 0, 3, 5, 30, 15); // +2d 5h 30m 15s
    const parts = getCountdownParts(target, now);
    expect(parts.days).toBe(2);
    expect(parts.hours).toBe(5);
    expect(parts.minutes).toBe(30);
    expect(parts.seconds).toBe(15);
  });
});

describe("mulberry32", () => {
  it("is deterministic for a given seed", () => {
    const rand1 = mulberry32(42);
    const rand2 = mulberry32(42);
    const seq1 = [rand1(), rand1(), rand1()];
    const seq2 = [rand2(), rand2(), rand2()];
    expect(seq1).toEqual(seq2);
  });

  it("produces values within [0, 1)", () => {
    const rand = mulberry32(7);
    for (let i = 0; i < 50; i++) {
      const v = rand();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("clamp", () => {
  it("clamps below minimum", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });
  it("clamps above maximum", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
  it("passes through in-range values", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });
});

describe("lerp", () => {
  it("interpolates linearly", () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
  });
  it("clamps t outside [0,1]", () => {
    expect(lerp(0, 10, 1.5)).toBe(10);
    expect(lerp(0, 10, -1)).toBe(0);
  });
});
