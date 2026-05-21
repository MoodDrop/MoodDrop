import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ArrowLeft,
} from "lucide-react";
import { Link } from "wouter";

import {
  breathingPresets,
  type BreathingPreset,
} from "@/lib/breathingPresets";

export default function TakeABreath() {
  const [selectedPreset, setSelectedPreset] =
    useState<BreathingPreset>(breathingPresets[0]);

  const [isRunning, setIsRunning] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const animationFrameRef = useRef<number | null>(null);
  const phaseStartTimeRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/breath-chime.mp3");

    if (audioRef.current) {
      audioRef.current.volume = 0.15;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const currentPhase = selectedPreset.phases[currentPhaseIndex];

  const startBreathing = () => {
    setIsRunning(true);
    phaseStartTimeRef.current = performance.now();
  };

  const pauseBreathing = () => {
    setIsRunning(false);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const resetBreathing = () => {
    pauseBreathing();
    setCurrentPhaseIndex(0);
    setPhaseProgress(0);
  };

  const playChime = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;

      audioRef.current.play().catch(() => {
        // ignore autoplay issues
      });
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    const animate = (timestamp: number) => {
      const elapsed = timestamp - phaseStartTimeRef.current;
      const phaseDurationMs = currentPhase.duration * 1000;
      const progress = Math.min(elapsed / phaseDurationMs, 1);

      setPhaseProgress(progress);

      if (progress >= 1) {
        const nextIndex =
          (currentPhaseIndex + 1) % selectedPreset.phases.length;

        setCurrentPhaseIndex(nextIndex);
        setPhaseProgress(0);
        phaseStartTimeRef.current = timestamp;
        playChime();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    isRunning,
    currentPhaseIndex,
    currentPhase,
    selectedPreset,
    soundEnabled,
  ]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();

        if (isRunning) {
          pauseBreathing();
        } else {
          startBreathing();
        }
      }

      if (e.code === "Enter" && e.target === document.body) {
        e.preventDefault();
        resetBreathing();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isRunning]);

  const getOrbScale = () => {
    if (currentPhase.type === "inhale") {
      return 0.88 + phaseProgress * 0.16;
    }

    if (currentPhase.type === "exhale") {
      return 1.04 - phaseProgress * 0.16;
    }

    return currentPhase.type === "hold" ? 1.04 : 0.88;
  };

  const secondsRemaining = Math.max(
    1,
    Math.ceil(currentPhase.duration * (1 - phaseProgress))
  );

  return (
    <div className="min-h-[calc(100vh-8rem)] overflow-hidden bg-[radial-gradient(circle_at_top,#FFF8F1_0%,#FAD8D0_42%,#DFA59E_100%)] px-4 py-8 text-[#7f5148]">
      <div className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-lg flex-col">
        <div className="mb-8">
          <Link href="/comfort">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/30 px-4 py-2 text-sm text-[#7f5148] shadow-sm backdrop-blur-md transition hover:bg-white/45"
            >
              <ArrowLeft size={16} />
              Back to Calm Studio
            </button>
          </Link>
        </div>

        <div className="text-center">
          <h1 className="font-serif text-4xl text-[#7f5148]">
            Take a Breath
          </h1>

          <p className="mt-3 text-sm text-[#9b6c63]">
            Slow down. You’re safe here.
          </p>
        </div>

        <div className="mt-8">
          <select
            value={selectedPreset.id}
            onChange={(e) => {
              const preset = breathingPresets.find(
                (p) => p.id === e.target.value
              );

              if (preset) {
                resetBreathing();
                setSelectedPreset(preset);
              }
            }}
            className="w-full rounded-2xl border border-white/40 bg-white/25 px-4 py-3 text-sm text-[#7f5148] shadow-sm backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/50"
            data-testid="select-breathing-preset"
          >
            {breathingPresets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>

          <p className="mt-2 text-center text-xs text-[#9b6c63]">
            {selectedPreset.description}
          </p>
        </div>

        <div className="relative mt-14 flex flex-1 flex-col items-center justify-center">
          {!prefersReducedMotion ? (
            <div className="relative flex h-80 w-80 items-center justify-center">
              <div className="absolute h-72 w-72 rounded-full bg-white/25 blur-3xl" />

              <div
                className="relative flex h-72 w-72 items-center justify-center rounded-full border border-white/55 bg-[radial-gradient(circle_at_30%_25%,#FFF9F0_0%,#F8B6A7_35%,#EFA194_72%,#F8D8CD_100%)] shadow-[0_0_80px_rgba(255,244,232,0.8)] transition-transform duration-1000 ease-in-out"
                style={{
                  transform: `scale(${getOrbScale()})`,
                }}
              >
                <div className="absolute left-16 top-16 h-5 w-5 rounded-full bg-white/80 blur-[1px]" />
                <div className="absolute inset-3 rounded-full border border-white/20" />

                <div className="relative z-10 text-center">
                  <p
                    className="tracking-[0.3em] text-[#7f5148]/80"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {currentPhase.label}
                  </p>

                  <p className="mt-6 font-serif text-5xl text-[#7f5148]/75">
                    {secondsRemaining}s
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full rounded-[2rem] border border-white/40 bg-white/25 p-6 text-center shadow-sm backdrop-blur-md">
              <p
                className="text-2xl font-semibold text-[#7f5148]"
                aria-live="polite"
                aria-atomic="true"
              >
                {currentPhase.label} for {currentPhase.duration}
              </p>

              <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-white/35">
                <div
                  className="h-full rounded-full bg-[#f6b7a6] transition-all duration-300"
                  style={{
                    width: `${phaseProgress * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="mt-12 w-full rounded-[2rem] border border-white/35 bg-white/20 px-6 py-4 shadow-sm backdrop-blur-md">
            <div className="grid grid-cols-3 text-center text-sm text-[#7f5148]">
              {selectedPreset.phases.slice(0, 3).map((phase, index) => {
                const active = index === currentPhaseIndex;

                return (
                  <div
                    key={`${phase.type}-${index}`}
                    className="flex flex-col items-center gap-2"
                  >
                    <span
                      className={`h-3 w-3 rounded-full transition ${
                        active
                          ? "bg-white shadow-[0_0_16px_rgba(255,255,255,0.9)]"
                          : "bg-[#9b6c63]/35"
                      }`}
                    />

                    <span>{phase.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 pb-4">
          <div className="grid grid-cols-3 items-center">
            <button
              onClick={resetBreathing}
              className="flex flex-col items-center gap-2 text-sm text-[#7f5148]"
              data-testid="button-breath-reset"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/25 backdrop-blur-md">
                <RotateCcw size={21} />
              </span>
              Reset
            </button>

            <button
              onClick={isRunning ? pauseBreathing : startBreathing}
              aria-label={
                isRunning
                  ? "Pause breathing exercise"
                  : "Start breathing exercise"
              }
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/50 bg-white/35 text-[#7f5148] shadow-md backdrop-blur-md transition hover:bg-white/45"
              data-testid="button-breath-start-pause"
            >
              {isRunning ? <Pause size={32} /> : <Play size={32} />}
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex flex-col items-center gap-2 text-sm text-[#7f5148]"
              data-testid="button-breath-sound"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/25 backdrop-blur-md">
                {soundEnabled ? <Volume2 size={21} /> : <VolumeX size={21} />}
              </span>
              Sound
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-[#9b6c63]">
            You can come back to this anytime.
          </p>
        </div>
      </div>
    </div>
  );
}