// Phrase -> video mapping for SignBridge.
// Replace the `video` URLs with your own MP4s in /public/videos/ when ready.
// Keywords help with flexible matching (any keyword match counts as a hit).

export type SignMapping = {
  id: string;
  text: string;
  keywords: string[];
  video: string;
  poster?: string;
};

// Free, hot-linkable sample MP4s so the demo works out of the box.
const SAMPLE = {
  wave: "https://cdn.pixabay.com/video/2024/03/17/204058-924698132_large.mp4",
  thanks: "https://cdn.pixabay.com/video/2023/10/06/184093-872215559_large.mp4",
  yes: "https://cdn.pixabay.com/video/2022/11/07/138442-768621408_large.mp4",
  no: "https://cdn.pixabay.com/video/2021/04/19/71336-540090231_large.mp4",
  love: "https://cdn.pixabay.com/video/2022/11/24/140511-774754031_large.mp4",
  help: "https://cdn.pixabay.com/video/2023/05/23/164671-829238615_large.mp4",
  please: "https://cdn.pixabay.com/video/2022/12/01/141387-777964304_large.mp4",
  sorry: "https://cdn.pixabay.com/video/2021/08/30/86867-595058849_large.mp4",
};

export const signMappings: SignMapping[] = [
  {
    id: "hello",
    text: "Hello",
    keywords: ["hello", "hi", "hey", "greetings", "howdy", "hola"],
    video: SAMPLE.wave,
  },
  {
    id: "thank-you",
    text: "Thank you",
    keywords: ["thank", "thanks", "thank you", "appreciate", "grateful"],
    video: SAMPLE.thanks,
  },
  {
    id: "yes",
    text: "Yes",
    keywords: ["yes", "yeah", "yep", "sure", "of course", "affirmative"],
    video: SAMPLE.yes,
  },
  {
    id: "no",
    text: "No",
    keywords: ["no", "nope", "nah", "negative", "never"],
    video: SAMPLE.no,
  },
  {
    id: "i-love-you",
    text: "I love you",
    keywords: ["love", "i love you", "love you", "adore"],
    video: SAMPLE.love,
  },
  {
    id: "help",
    text: "Help",
    keywords: ["help", "assist", "support", "aid", "need help"],
    video: SAMPLE.help,
  },
  {
    id: "please",
    text: "Please",
    keywords: ["please", "kindly", "pls"],
    video: SAMPLE.please,
  },
  {
    id: "sorry",
    text: "Sorry",
    keywords: ["sorry", "apologies", "apologize", "my bad", "forgive"],
    video: SAMPLE.sorry,
  },
];

/**
 * Flexible match: returns the best mapping for an input string,
 * or null if nothing reasonable matches. Uses keyword inclusion +
 * a tiny similarity score so phrasing variations still hit.
 */
export function findBestMatch(input: string): SignMapping | null {
  const q = input.trim().toLowerCase();
  if (!q) return null;

  let best: { mapping: SignMapping; score: number } | null = null;

  for (const m of signMappings) {
    let score = 0;

    for (const kw of m.keywords) {
      const k = kw.toLowerCase();
      if (q === k) score += 100;
      else if (q.includes(k)) score += 40 + k.length;
      else if (k.includes(q) && q.length >= 2) score += 20 + q.length;
    }

    // Token overlap as a soft fallback
    const qTokens = new Set(q.split(/\s+/).filter(Boolean));
    for (const kw of m.keywords) {
      for (const t of kw.split(/\s+/)) {
        if (qTokens.has(t)) score += 5;
      }
    }

    if (score > 0 && (!best || score > best.score)) {
      best = { mapping: m, score };
    }
  }

  return best ? best.mapping : null;
}
