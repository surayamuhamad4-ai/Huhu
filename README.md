# For Megan — An Interactive Love Letter

A cinematic, interactive love letter website built with Next.js 14, TypeScript, Tailwind CSS, Framer Motion, and a touch of Three.js. Built for Megan Boo Yin Ern.

## What's included

- **Scroll-driven scene backgrounds** — night sky → sakura park → fairy forest → flower garden → starlit promise → moonlit letters → galaxy, crossfading automatically as you scroll
- **Achievements system** — floating trophy button (top-right) tracks 9 unlockable achievements as Megan explores
- **Daily Love Message** — a different message each calendar day, deterministic (no flicker/mismatch)
- **Fortune Cookie** — click to crack, random fortune
- **Hero** — lazy-loaded R3F starfield, double-click for heart rain
- **Love Letter** — your real letter, envelope-open reveal animation
- **Timeline** — your 3 real milestones (first meet, fell in love, the smile), scroll-revealed along a stitched "thread" motif
- **100+ Reasons I Love You** — flip-cards, progressively revealed
- **Countdown** — live days-together counter + countdown to your 21 July anniversary
- **Love Meter** — animated ring that fills as Megan explores the site (persisted)
- **Wish Jar** — Megan can write wishes, saved to her browser's local storage
- **Lucky Wheel of Love** — spin for a randomized prize
- **Catch the Hearts** — 30-second mini-game
- **Promises** + **Wedding Dream** page — built from the wedding paragraph in your real letter
- **"Open When..." Letters** — 6 written letters for different moods
- **Music Player** — wired to play Arctic Monkeys' "No. 1 Party Anthem" once you add the file yourself (see below — **the actual audio file is NOT included**, for copyright reasons)
- **Hidden Easter egg** — long-press anywhere on the last section, or shake the phone
- Dark/light mode, full keyboard accessibility, `prefers-reduced-motion` support, SEO meta tags (set to `noindex` since this is a private gift site)

## 1. Install

You'll need [Node.js 18.18+](https://nodejs.org) installed.

```bash
cd megan-love
npm install
```

## 2. Add the song (required for the Music Player to work)

The Music Player code is fully functional, but the actual MP3 file for "No. 1 Party Anthem" by Arctic Monkeys is **not bundled** in this project — that would be copyright infringement. To make the player work:

1. Get a legally-owned copy of the song (e.g. exported from music you've purchased) as an MP3.
2. Rename it `song.mp3`.
3. Place it at `public/audio/song.mp3`.

That's it — no code changes needed. The player automatically detects the file and switches from the "add your song" empty state to the working player.

## 3. Add photos (optional)

You mentioned you don't need a gallery right now, so there isn't one wired into the page — but `public/photos/` is ready if you want to add one later. Drop images there and ask for a `<Gallery />` component to be added; the project structure is built to make that a clean addition (just another section dropped into `app/page.tsx`).

## 4. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

## 5. Run tests

```bash
npm run test       # unit tests (date math, countdown logic, RNG)
npm run typecheck  # TypeScript strict-mode check
npm run lint        # ESLint
```

## 6. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or push this folder to a GitHub repo and import it at [vercel.com/new](https://vercel.com/new) — zero config needed, Next.js is auto-detected.

**Important:** the site is set to `noindex` (won't show up in Google) and there's no authentication — anyone with the URL can view it. If you want to restrict access, ask and I can add a simple password gate (Vercel Edge Middleware) before deploying.

## Editing content later

Everything personal lives in **`lib/data.ts`** — one file, fully typed:

- `MILESTONES` — timeline entries (date, title, description)
- `REASONS` — the 100+ reasons array
- `ANNIVERSARY_DATE` / `RELATIONSHIP_START` — drives all countdown/day-counter math
- `OPEN_WHEN_LETTERS` — the letter triggers (actual letter bodies are in `components/OpenWhenLetters.tsx`)
- `SONG` — title/artist/file path

You should never need to touch component files just to update a date or add a reason.

## Project structure

```
megan-love/
├── app/
│   ├── layout.tsx         # fonts, metadata, skip-link
│   ├── page.tsx           # assembles all sections
│   └── globals.css
├── components/            # one component per section/feature
├── lib/
│   ├── data.ts             # ALL personal content — edit this file
│   ├── utils.ts             # pure date/RNG helpers (unit tested)
│   ├── utils.test.ts
│   └── store.ts             # zustand client state (love meter, wishes, achievements)
├── public/
│   ├── audio/                # put song.mp3 here
│   └── photos/                # reserved for future gallery
├── tailwind.config.js
├── next.config.mjs           # security headers (CSP, X-Frame-Options, etc.)
└── package.json
```

## Notes on scope

This build focused on a curated, fully-functional core feature set rather than implementing literally every item from the original wishlist at shallow quality. The scroll-driven scenes, achievements system, daily message, and fortune cookie were added in a second pass. Still intentionally left out: a photo gallery/scrapbook (you said you don't need one yet), additional mini-games (memory puzzle, find-the-teddy), and a Love Diary/Calendar view. Everything that IS here is real, tested, and production-ready rather than stubbed. Happy to add any of those next — just say which ones matter most.
