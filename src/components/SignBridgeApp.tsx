import { useEffect, useRef, useState } from "react";
import { getNextSignMapping, signMappings, type SignMapping } from "@/data/signMappings";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

type Status = "idle" | "loading" | "playing";

export function SignBridgeApp() {
  const [input, setInput] = useState("");
  const [match, setMatch] = useState<SignMapping | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [subtitleText, setSubtitleText] = useState("");
  const [nextVideoIndex, setNextVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const speech = useSpeechRecognition({
    onFinal: (text) => {
      setInput(text);
      handleTranslate(text);
    },
  });

  const handleTranslate = (raw?: string) => {
    const value = (raw ?? input).trim();
    if (!value) return;

    setStatus("loading");
    setSubtitleText(value);

    // Tiny delay so the loader is perceivable on instant matches.
    window.setTimeout(() => {
      const nextMapping = getNextSignMapping(nextVideoIndex);
      setMatch(nextMapping);
      setStatus("playing");
      setNextVideoIndex((current) => (current + 1) % signMappings.length);
    }, 280);
  };

  const handleClear = () => {
    setInput("");
    setMatch(null);
    setSubtitleText("");
    setStatus("idle");
    speech.stop();
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !match) return;

    v.load();
    const playPromise = v.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }, [match]);

  const liveText = speech.listening && speech.interim ? speech.interim : input;

  return (
    <div className="min-h-dvh bg-background text-foreground antialiased flex flex-col items-center p-4 sm:p-8">
      <nav className="w-full max-w-5xl flex justify-between items-center mb-8 sm:mb-12">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-moss rounded-full flex items-center justify-center shadow-stone">
            <div className="size-4 bg-stone-base rounded-sm rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-serif italic tracking-tight leading-tight">Wamu</span>
            <span className="text-[10px] font-medium text-muted-foreground tracking-wide">better together</span>
          </div>
        </div>
        <div className="hidden sm:flex gap-6 items-center text-sm font-medium text-muted-foreground">
          <span>Inclusive translator</span>
          <button
            onClick={() => setShowSubtitles((s) => !s)}
            className="px-4 py-2 bg-stone-deep/50 rounded-full hover:bg-stone-deep transition-colors text-foreground"
          >
            Subtitles: {showSubtitles ? "On" : "Off"}
          </button>
        </div>
      </nav>

      <main className="w-full max-w-5xl bg-stone-surface p-4 sm:p-6 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-stone flex flex-col gap-5 sm:gap-6">
        <div className="relative bg-stone-deep/30 rounded-[1.75rem] sm:rounded-[2.5rem] overflow-hidden shadow-inset-stone">
          <div className="aspect-video w-full relative overflow-hidden">
            {match ? (
              <video
                key={match.id}
                ref={videoRef}
                src={match.video}
                playsInline
                autoPlay
                loop
                muted
                className="absolute top-[-8%] left-0 w-full h-[108%] object-contain transition-opacity duration-500 opacity-100"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <EmptyStage status={status} />
              </div>
            )}

            <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
              <StatusBadge status={status} listening={speech.listening} />
            </div>

            {match && showSubtitles && subtitleText && (
              <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 px-4 sm:px-10">
                <div className="bg-stone-base/90 backdrop-blur-md px-5 sm:px-7 py-3 sm:py-4 rounded-[1.5rem] sm:rounded-[2rem] shadow-stone border border-white/40 mx-auto max-w-3xl">
                  <p className="text-base sm:text-xl font-medium leading-relaxed tracking-tight text-center">
                    <span className="opacity-40 mr-2">Subtitle:</span>
                    {subtitleText}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 p-1 sm:p-2">
          <div className="flex-1">
            <label
              htmlFor="phrase"
              className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4 sm:ml-6 mb-2 sm:mb-3"
            >
              Type or speak a phrase
            </label>
            <div className="relative">
              <input
                id="phrase"
                type="text"
                value={liveText}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTranslate();
                }}
                placeholder="Type or say any sentence to play the next video..."
                className="w-full bg-stone-base h-16 sm:h-20 pl-6 sm:pl-8 pr-36 sm:pr-44 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-moss/30 text-base sm:text-lg transition-all placeholder:text-earth/30 shadow-inset-stone"
              />
              <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {input && (
                  <button
                    onClick={handleClear}
                    aria-label="Clear input"
                    className="h-10 sm:h-12 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-stone-deep/40 transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => handleTranslate()}
                  className="h-12 sm:h-14 px-5 sm:px-6 bg-earth text-stone-base rounded-full font-medium hover:bg-moss transition-colors text-sm sm:text-base"
                >
                  Translate
                </button>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex sm:flex-col items-center gap-3 sm:gap-2">
            <button
              onClick={() => (speech.listening ? speech.stop() : speech.start())}
              disabled={!speech.supported}
              aria-label={speech.listening ? "Stop recording" : "Start recording"}
              className={`size-16 sm:size-20 rounded-full flex items-center justify-center shadow-stone transition-all active:scale-95 group ${
                speech.listening
                  ? "bg-destructive animate-mic-pulse"
                  : "bg-moss hover:bg-moss-deep hover:scale-105"
              } ${!speech.supported ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <MicIcon className="size-7 sm:size-8 text-stone-base" />
            </button>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground sm:mt-1">
              {speech.listening ? "Listening" : speech.supported ? "Voice" : "N/A"}
            </p>
          </div>
        </div>
      </main>

      <footer className="mt-12 sm:mt-20 mb-6 opacity-40 text-[10px] font-medium uppercase tracking-[0.2em]">
        Handcrafted for inclusion | Wamu
      </footer>
    </div>
  );
}

function StatusBadge({
  status,
  listening,
}: {
  status: Status;
  listening: boolean;
}) {
  if (listening) {
    return (
      <Badge color="destructive" pulse>
        Listening
      </Badge>
    );
  }
  if (status === "loading") {
    return (
      <Badge color="moss" pulse>
        Loading
      </Badge>
    );
  }
  if (status === "playing") {
    return <Badge color="moss">Playing</Badge>;
  }
  return <Badge color="muted">Ready</Badge>;
}

function Badge({
  children,
  color,
  pulse,
}: {
  children: React.ReactNode;
  color: "moss" | "destructive" | "muted";
  pulse?: boolean;
}) {
  const bg =
    color === "moss"
      ? "bg-moss text-stone-base"
      : color === "destructive"
        ? "bg-destructive text-destructive-foreground"
        : "bg-stone-base/90 text-foreground border border-stone-deep/50";
  return (
    <div
      className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-full flex items-center gap-2 backdrop-blur-md ${bg}`}
    >
      <span
        className={`size-1.5 rounded-full ${
          color === "muted" ? "bg-muted-foreground" : "bg-stone-base"
        } ${pulse ? "animate-pulse" : ""}`}
      />
      {children}
    </div>
  );
}

function EmptyStage({ status }: { status: Status }) {
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-moss animate-bounce [animation-delay:-0.3s]" />
          <span className="size-2.5 rounded-full bg-moss animate-bounce [animation-delay:-0.15s]" />
          <span className="size-2.5 rounded-full bg-moss animate-bounce" />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest">Loading the next sign</p>
      </div>
    );
  }
  return (
    <div className="text-center px-6 max-w-md">
      <p className="font-serif italic text-3xl sm:text-4xl mb-3 leading-tight">
        Bridging hearts through signs.
      </p>
      <p className="text-sm sm:text-base text-muted-foreground">
        Type a phrase or tap the microphone to begin. Each new phrase plays the next video in the 1 to 6 sequence.
      </p>
    </div>
  );
}

function MicIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <line x1="12" y1="18" x2="12" y2="22" />
    </svg>
  );
}
