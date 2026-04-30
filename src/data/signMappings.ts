// Phrase -> video mapping for Wamu.
// Each phrase maps to a sign language video in /public/videos/
// Keywords help with flexible matching (any keyword match counts as a hit).

export type SignMapping = {
  id: string;
  text: string;
  keywords: string[];
  video: string;
  poster?: string;
};

export const signMappings: SignMapping[] = [
  {
    id: "go-away",
    text: "Go away",
    keywords: ["go away", "leave", "go", "away", "get out"],
    video: "/videos/go away.mp4",
  },
  {
    id: "how-was-your-day",
    text: "How was your day",
    keywords: ["how was your day", "how was day", "your day", "how are you", "how's your day"],
    video: "/videos/how was your day.mp4",
  },
  {
    id: "i-am-hungry",
    text: "I am hungry",
    keywords: ["i am hungry", "hungry", "i'm hungry", "starving", "need food"],
    video: "/videos/i am hungry.mp4",
  },
  {
    id: "lets-go-for-a-walk",
    text: "Let's go for a walk",
    keywords: ["let's go for a walk", "go for a walk", "walk", "lets walk", "go walking"],
    video: "/videos/lets go for a walk.mp4",
  },
  {
    id: "please-help",
    text: "Please help",
    keywords: ["please help", "help", "help me", "please", "need help", "assist"],
    video: "/videos/please help.mp4",
  },
  {
    id: "what-is-your-name",
    text: "What is your name",
    keywords: ["what is your name", "your name", "what's your name", "name", "who are you"],
    video: "/videos/what is your name.mp4",
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
