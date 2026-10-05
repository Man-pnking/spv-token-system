import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const STORAGE_KEY = "spv_audio_enabled";

export default function BackgroundAudio() {
  const audioRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const audio = new Audio("/ambience.mp3");
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (started || !enabled) return;

    const tryStart = async () => {
      try {
        const audio = audioRef.current;
        if (!audio) return;
        await audio.play();
        setStarted(true);
        let v = 0;
        const target = 0.2;
        const step = target / 20;
        const interval = setInterval(() => {
          v += step;
          if (v >= target) {
            v = target;
            clearInterval(interval);
          }
          audio.volume = v;
        }, 100);
      } catch {
        // autoplay blocked — retry on next interaction
      }
    };

    const onInteract = () => tryStart();

    window.addEventListener("click", onInteract);
    window.addEventListener("keydown", onInteract);
    window.addEventListener("touchstart", onInteract);

    return () => {
      window.removeEventListener("click", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("touchstart", onInteract);
    };
  }, [enabled, started]);

  useEffect(() => {
    if (!enabled || !started) return;

    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden) {
        audio.pause();
      } else {
        audio.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [enabled, started]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (enabled) {
      let v = audio.volume;
      const interval = setInterval(() => {
        v -= 0.02;
        if (v <= 0) {
          v = 0;
          audio.pause();
          clearInterval(interval);
        }
        audio.volume = v;
      }, 60);
      setEnabled(false);
      setStarted(false);
      localStorage.setItem(STORAGE_KEY, "false");
    } else {
      setEnabled(true);
      localStorage.setItem(STORAGE_KEY, "true");
    }
  };

  if (!visible) return null;

  return (
    <button
      onClick={toggle}
      aria-label={enabled ? "Mute background audio" : "Play background audio"}
      title={enabled ? "Mute ambience" : "Play ambience"}
      className="fixed top-20 right-4 sm:right-6 z-40 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-105"
      style={{
        background: "rgba(10, 8, 6, 0.92)",
        border: "1px solid rgba(0, 255, 255, 0.15)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
      }}
    >
      {enabled && started ? (
        <Volume2 className="w-4 h-4 text-[#00ffff]" />
      ) : (
        <VolumeX className="w-4 h-4 text-warm-dim" />
      )}
      {enabled && started && (
        <span
          className="absolute inset-0 rounded-full"
          style={{
            animation: "audioPulse 2.5s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
      )}
      <style>{`
        @keyframes audioPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.35); }
          50% { box-shadow: 0 0 0 8px rgba(0, 255, 255, 0); }
        }
      `}</style>
    </button>
  );
}