/**
 * lib/data.ts
 * Single source of truth for all relationship data used across the site.
 * Edit THIS file to update dates, milestones, or reasons — every component
 * (Timeline, Countdown, LoveMeter, Reasons) reads from here, so there is
 * no duplicated or inconsistent data anywhere else in the codebase.
 */

export interface Milestone {
  id: string;
  date: string; // ISO 8601 (YYYY-MM-DD)
  title: string;
  description: string;
  emoji: string;
}

/**
 * All dates are stored as ISO strings and parsed with `parseISODate` below
 * to avoid the classic JS footgun where `new Date("2025-12-26")` is
 * interpreted in UTC and can render as the previous day in negative-UTC
 * timezones. We always construct dates in the LOCAL timezone.
 */
export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) {
    throw new Error(`Invalid ISO date string: "${iso}"`);
  }
  return new Date(year, month - 1, day);
}

export const RELATIONSHIP_START: string = "2025-12-26";
export const ANNIVERSARY_DATE: string = "2026-07-21"; // month/day re-used yearly
export const GIRLFRIEND_NAME = "Megan Boo Yin Ern";
export const GIRLFRIEND_FIRST_NAME = "Megan";
export const PARTNER_NAME = "Aidil";

export const MILESTONES: Milestone[] = [
  {
    id: "first-meet",
    date: "2025-12-26",
    title: "The Day Our Story Began",
    description:
      "The first time our paths crossed. I didn't know it yet, but this was the day everything changed.",
    emoji: "✨",
  },
  {
    id: "fell-in-love",
    date: "2026-01-19",
    title: "You Walked Into Class, and I Fell",
    description:
      "You walked into Aku Dan Aku class, and somewhere between that moment and the next, I fell for you completely.",
    emoji: "💕",
  },
  {
    id: "first-smile",
    date: "2026-02-21",
    title: "The Look, The Smile",
    description:
      "We looked at each other and smiled — no words needed. That small moment said everything.",
    emoji: "🌸",
  },
];

/**
 * Personality traits used to seed the "Reasons I Love You" generator.
 * Based on: cheerful, beautiful, funny, always happy, and adorable.
 */
const PERSONALITY_TRAITS = [
  "cheerful",
  "beautiful",
  "funny",
  "always happy",
  "comel (adorable)",
] as const;

/**
 * 100+ reasons, written by hand across thematic categories so the list
 * reads as genuine and varied rather than a templated loop. Order is
 * intentional: it moves from first impressions -> daily life -> character
 * -> future, mirroring how love actually deepens over time.
 */
export const REASONS: string[] = [
  // -- Her smile & energy --
  "The way your smile shows up before you even say a word.",
  "How your laugh is so loud and real that it makes everyone around you smile too.",
  "The way you light up a room just by walking into it.",
  "How you can turn an ordinary day into something fun just by being there.",
  "The way your eyes scrunch up when you laugh at something really funny.",
  "How your energy never seems to run out, even on tiring days.",
  "The way you greet people like you're genuinely happy to see them — because you are.",
  "How you make boring study sessions feel less boring just by being beside me.",
  "The way you hum or sing softly when you're in a good mood.",
  "How your happiness feels contagious, like it spills over onto everyone near you.",

  // -- Her humor --
  "How you always have a joke ready, even at the worst possible timing.",
  "The way you laugh at your own jokes before anyone else does.",
  "How you can make me laugh even when I'm trying to stay annoyed at you.",
  "The way you tease me and somehow it's still endearing every time.",
  "How you find humor in small, ordinary moments nobody else notices.",
  "The way your comebacks are quicker than I expect.",
  "How you never take yourself too seriously.",
  "The way you can turn a mistake into a funny story five minutes later.",
  "How being around you never feels heavy, even when life is.",
  "The way you make fun of yourself before anyone else can.",

  // -- Her looks, the way I see her --
  "The way you look when you're concentrating on schoolwork, brows slightly furrowed.",
  "How beautiful you are without even trying.",
  "The way your whole face changes when something excites you.",
  "How you somehow look prettier the longer I know you.",
  "The way you tuck your hair back when you're focused.",
  "How your smile is the first thing I notice in every memory of you.",
  "The way you look mid-laugh, completely unguarded and real.",
  "How even your sleepy, tired face is something I've grown to love.",
  "The way you glow when you're genuinely happy about something.",
  "How no photo has ever fully captured how you look in person.",

  // -- Her kindness & character --
  "How you're kind to people even when they don't deserve it.",
  "The way you genuinely care about how other people are doing.",
  "How you never make people feel small, even when you're annoyed.",
  "The way you notice when someone's having a bad day before they say anything.",
  "How you give without expecting anything back.",
  "The way you stand up for people you care about.",
  "How patient you are, even with me on my difficult days.",
  "The way you forgive easily but still hold your ground.",
  "How you make people feel safe just by being around you.",
  "The way you're honest, even when the truth is uncomfortable.",

  // -- Daily life together --
  "Sitting beside you at your desk while you study, just being near you.",
  "How you ask me to explain a question twice and then get it instantly the third time.",
  "The way you complain about studying but still push through anyway.",
  "How our conversations can go from serious to ridiculous in two seconds.",
  "The comfortable silence we share when we're just doing our own things side by side.",
  "How you save snacks for me without me even asking.",
  "The way you text me random things throughout the day just because you thought of me.",
  "How you remember small details I mentioned once, weeks ago.",
  "The way studying with you feels less like work and more like time well spent.",
  "How even mundane days feel meaningful when you're part of them.",

  // -- Comel / cute things --
  "The way you pout when you don't get your way.",
  "How you get excited over the smallest, silliest things.",
  "The way you talk to yourself when you think no one's listening.",
  "How you do this little happy dance when something good happens.",
  "The way you get sleepy and stubbornly insist you're not tired.",
  "How you scrunch your nose when you disagree with something.",
  "The way you say things in the cutest, most confident way even when you're wrong.",
  "How you get shy out of nowhere after being loud a second ago.",
  "The way you hold onto silly little habits that are so distinctly you.",
  "How your whole personality somehow fits into the word 'comel'.",

  // -- Strength & resilience --
  "How you keep going even when school and life get overwhelming.",
  "The way you don't let setbacks define your mood for long.",
  "How you handle pressure better than you give yourself credit for.",
  "The way you bounce back from a bad day without losing yourself.",
  "How you stay yourself even when things around you are stressful.",
  "The way you push through hard topics in class instead of giving up.",
  "How brave you are about things that quietly scare you.",
  "The way you hold your composure even when you're overwhelmed inside.",
  "How you turn frustration into determination instead of giving up.",
  "The way your strength is quiet but absolutely real.",

  // -- Us, together --
  "How talking to you feels easy, even when we're talking about nothing at all.",
  "The way a single glance and smile from you across the room says more than words.",
  "How you make me want to be a better, more patient person.",
  "The way I think about you randomly throughout my day, for no reason at all.",
  "How being your favorite person is something I never take for granted.",
  "The way we can disagree and still end up laughing about it later.",
  "How safe and at ease I feel whenever I'm around you.",
  "The way you make ordinary moments feel like memories worth keeping.",
  "How natural it feels to imagine you in my future.",
  "The way you've become the person I want to share everything with first.",

  // -- The little things --
  "How you remember inside jokes from weeks ago and bring them up at the perfect time.",
  "The way your mood can instantly lift mine, even through a screen.",
  "How you get genuinely curious about things I care about, just because I care about them.",
  "The way you say 'okay lah' like it settles everything.",
  "How your texts somehow always arrive at the exact moment I needed them.",
  "The way you care about doing well, even when you act like you don't.",
  "How you never let me stay upset for too long.",
  "The way you make effort in quiet, unspoken ways.",
  "How your presence alone makes hard days feel lighter.",
  "The way you've made yourself impossible to imagine life without.",

  // -- Future-facing --
  "Knowing that your kindness is something I want around for the rest of my life.",
  "How excited I am to watch you grow into everything you're capable of.",
  "The thought of still making you laugh decades from now.",
  "How I want to be the person who gets to see your bad days too, not just the good ones.",
  "The way I can already picture us building a home filled with your laughter.",
  "How every version of my future automatically includes you in it.",
  "The way I want to keep learning new things about you, forever.",
  "How I look forward to celebrating every small win of yours, always.",
  "The way I want to be patient with you the way you've been patient with me.",
  "How loving you doesn't feel like work — it feels like the easiest, most obvious choice.",

  // -- Closing reasons --
  "Because you are cheerful in a way that makes everyone around you feel lighter.",
  "Because you are beautiful, inside far more than just outside.",
  "Because you are funny in a way that's effortless and uniquely yours.",
  "Because you choose to be happy, even when it would be easier not to.",
  "Because you are comel in every single way, and I notice all of them.",
  "Because of you, I believe in the kind of love that doesn't need convincing.",
  "Because loving you, Megan, has been the best decision I never had to think twice about.",
];

export const PERSONALITY_TAGS = PERSONALITY_TRAITS;

export const FAVORITE_QUOTES: { quote: string; context: string }[] = [
  {
    quote: "如果有人问我，这个世界上最美的风景是什么，我会毫不犹豫地回答——是你的笑容。",
    context: "From the first letter I ever wrote you",
  },
  {
    quote: "看着你认真学习的模样，我总会觉得，原来幸福可以如此简单。",
    context: "On the quiet afternoons studying beside you",
  },
  {
    quote: "无论岁月如何流转，我都会珍惜与你相遇的每一天。",
    context: "A promise, not just a quote",
  },
];

export const SONG = {
  title: "No. 1 Party Anthem",
  artist: "Arctic Monkeys",
  // Place a legally-owned local audio file at /public/audio/song.mp3
  // The player gracefully shows a "add the song" empty state until then.
  src: "/audio/song.mp3",
};

export const OPEN_WHEN_LETTERS: { id: string; trigger: string; title: string }[] = [
  { id: "sad", trigger: "Open when you're sad", title: "Open When You're Sad" },
  { id: "happy", trigger: "Open when you're really happy", title: "Open When You're Really Happy" },
  { id: "missing-me", trigger: "Open when you miss me", title: "Open When You Miss Me" },
  { id: "stressed", trigger: "Open when exams are stressing you out", title: "Open When You're Stressed About Exams" },
  { id: "doubt", trigger: "Open when you doubt how much I love you", title: "Open When You Doubt Us" },
  { id: "proud", trigger: "Open on a day you did something great", title: "Open When You're Proud of Yourself" },
];
