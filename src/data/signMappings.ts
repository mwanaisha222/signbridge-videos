// Rotating video playlist for Wamu.
// Short phrases advance through the standard videos in /public/videos/.
// Longer phrases use the extended video 6.

export type SignMapping = {
  id: string;
  text: string;
  video: string;
  poster?: string;
};

export const signMappings: SignMapping[] = [
  {
    id: "video-1",
    text: "Video 1",
    video: "/videos/1.mp4",
  },
  {
    id: "video-3",
    text: "Video 3",
    video: "/videos/3.mp4",
  },
  {
    id: "video-4",
    text: "Video 4",
    video: "/videos/4.mp4",
  },
  {
    id: "video-5",
    text: "Video 5",
    video: "/videos/5.mp4",
  },
  {
    id: "video-6",
    text: "Video 6",
    video: "/videos/6.mp4",
  },
];

const defaultLoopIds = ["video-1", "video-3", "video-4", "video-5"] as const;

export const defaultLoopMappings = defaultLoopIds
  .map((id) => signMappings.find((mapping) => mapping.id === id))
  .filter((mapping): mapping is SignMapping => Boolean(mapping));

export const longStatementMapping =
  signMappings.find((mapping) => mapping.id === "video-6") ?? signMappings[signMappings.length - 1];

export function getNextSignMapping(index: number): SignMapping {
  return defaultLoopMappings[
    ((index % defaultLoopMappings.length) + defaultLoopMappings.length) % defaultLoopMappings.length
  ];
}
