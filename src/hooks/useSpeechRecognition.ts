import { useCallback, useEffect, useRef, useState } from "react";

// Minimal Web Speech API typing
type SRConstructor = new () => SpeechRecognition;
interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: SRConstructor;
    webkitSpeechRecognition?: SRConstructor;
  }
}

export function useSpeechRecognition(opts?: {
  onFinal?: (text: string) => void;
}) {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [supported, setSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SpeechRecognition | null>(null);
  const onFinalRef = useRef(opts?.onFinal);
  onFinalRef.current = opts?.onFinal;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return;
    }
    const rec = new Ctor();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = true;

    rec.onresult = (e: any) => {
      let interimText = "";
      let finalText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) finalText += res[0].transcript;
        else interimText += res[0].transcript;
      }
      setInterim(interimText);
      if (finalText) {
        setInterim("");
        onFinalRef.current?.(finalText.trim());
      }
    };
    rec.onerror = (e: any) => {
      setError(e?.error ?? "speech-error");
      setListening(false);
    };
    rec.onend = () => setListening(false);

    recRef.current = rec;
    return () => {
      try {
        rec.abort();
      } catch {}
    };
  }, []);

  const start = useCallback(() => {
    setError(null);
    setInterim("");
    try {
      recRef.current?.start();
      setListening(true);
    } catch {
      // ignore double-start
    }
  }, []);

  const stop = useCallback(() => {
    try {
      recRef.current?.stop();
    } catch {}
    setListening(false);
  }, []);

  return { listening, interim, supported, error, start, stop };
}
