// Rotating video playlist for Wamu.
// Each new typed or spoken phrase advances to the next video in /public/videos/.

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
    id: "video-2",
    text: "Video 2",
    video: "/videos/2.mp4",
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

export function getNextSignMapping(index: number): SignMapping {
  return signMappings[((index % signMappings.length) + signMappings.length) % signMappings.length];
}
