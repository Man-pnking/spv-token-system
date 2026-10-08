import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const STORAGE_KEY = "spv_audio_enabled";
const TARGET_VOLUME = 0.15;   // quiet, ambient — not foreground music
const FADE_IN_MS = 4000;      // slow, gentle fade-in
const FADE_OUT_MS = 600;

export default function BackgroundAudio() {
  const audioRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const audio = new Audio("https://cdn.jsdelivr.net/npm/sounds-for-focus@0.1.0/audio/rain/light-rain.mp3");
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
    if (stored === "true") setEnabled(true);
  }, []);

  const fadeTo = (target, duration, onDone) => {
    const audio = audioRef.current;
    if (!audio) return;
    const startVol = audio.volume;
    const startTime = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      audio.volume = Math.max(0, Math.min(1, startVol + (target - startVol) * t));
      if (t < 1) requestAnimationFrame(tick);
      else if (onDone) onDone();
    };
    requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (started || !enabled) return;

    const tryStart = async () => {
      try {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = 0;
        await audio.play();
        setStarted(true);
        fadeTo(TARGET_VOLUME, FADE_IN_MS);
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
        fadeTo(0, FADE_OUT_MS, () => audio.pause());
      } else {
        audio.play().catch(() => {});
        fadeTo(TARGET_VOLUME, FADE_IN_MS);
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [enabled, started]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (enabled) {
      fadeTo(0, FADE_OUT_MS, () => audio.pause());
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
          style={{ animation: "audioPulse 2.5s ease-in-out infinite", pointerEvents: "none" }}
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
