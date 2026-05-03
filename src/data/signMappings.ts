// Statement-to-video mappings for Wamu.
// Known phrases play their matching video.
// Unknown phrases fall back to the rotating playlist while keeping the user's subtitle text.

export type SignMapping = {
  id: string;
  text: string;
  video: string;
  aliases?: string[];
  poster?: string;
};

export const signMappings: SignMapping[] = [
  {
    id: "stay-away-from-me",
    text: "stay away from me",
    video: "/videos/stay away from me.mp4",
  },
  {
    id: "please-wait-a-moment",
    text: "please wait a moment",
    video: "/videos/please wait a moment.mp4",
  },
  {
    id: "hello-what-is-your-name",
    text: "hello what is your name",
    video: "/videos/hello what is your name.mp4",
  },
  {
    id: "i-am-hungry",
    text: "i am hungry",
    aliases: ["am feeling hungry", "i'm hungry", "im hungry", "feeling hungry"],
    video: "/videos/am feeling hungry.mp4",
  },
  {
    id: "where-have-i-parked-my-car",
    text: "where have i parked my car",
    aliases: ["where have i packed my car"],
    video: "/videos/where have i packed my car.mp4",
  },
];

const defaultLoopIds = [
  "stay-away-from-me",
  "please-wait-a-moment",
  "hello-what-is-your-name",
  "i-am-hungry",
  "where-have-i-parked-my-car",
] as const;

export const defaultLoopMappings = defaultLoopIds
  .map((id) => signMappings.find((mapping) => mapping.id === id))
  .filter((mapping): mapping is SignMapping => Boolean(mapping));

export function getNextSignMapping(index: number): SignMapping {
  return defaultLoopMappings[
    ((index % defaultLoopMappings.length) + defaultLoopMappings.length) % defaultLoopMappings.length
  ];
}

function normalizePhrase(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findSignMappingByPhrase(phrase: string): SignMapping | undefined {
  const normalized = normalizePhrase(phrase);
  return signMappings.find((mapping) => {
    const candidates = [mapping.text, ...(mapping.aliases ?? [])];
    return candidates.some((candidate) => normalizePhrase(candidate) === normalized);
  });
}
