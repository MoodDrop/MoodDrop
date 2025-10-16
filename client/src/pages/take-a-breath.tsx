import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { breathingPresets, type BreathingPreset, type BreathPhase } from "@/lib/breathingPresets";

export default function TakeABreath() {
  const [selectedPreset, setSelectedPreset] = useState<BreathingPreset>(breathingPresets[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0); // 0 to 1
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const animationFrameRef = useRef<number | null>(null);
  const phaseStartTimeRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Initialize audio
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
        // Ignore errors if audio can't play
      });
    }
  };

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;

    const animate = (timestamp: number) => {
      const elapsed = timestamp - phaseStartTimeRef.current;
      const phaseDurationMs = currentPhase.duration * 1000;
      const progress = Math.min(elapsed / phaseDurationMs, 1);

      setPhaseProgress(progress);

      if (progress >= 1) {
        // Move to next phase
        const nextIndex = (currentPhaseIndex + 1) % selectedPreset.phases.length;
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
  }, [isRunning, currentPhaseIndex, currentPhase, selectedPreset, soundEnabled]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        if (isRunning) {
          pauseBreathing();
        } else {
          startBreathing();
        }
      } else if (e.code === "Enter" && e.target === document.body) {
        e.preventDefault();
        resetBreathing();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isRunning]);

  const getRingScale = () => {
    if (currentPhase.type === "inhale") {
      return 0.6 + (phaseProgress * 0.4); // Expand from 0.6 to 1.0
    } else if (currentPhase.type === "exhale") {
      return 1.0 - (phaseProgress * 0.4); // Contract from 1.0 to 0.6
    } else {
      // Hold phases - maintain current size
      return currentPhase.type === "hold" ? 1.0 : 0.6;
    }
  };

  const getPhaseColor = () => {
    if (currentPhase.type === "inhale") return "rgba(166, 200, 255, 0.4)"; // Calm blue
    if (currentPhase.type === "exhale") return "rgba(251, 230, 148, 0.4)"; // Warm yellow
    return "rgba(201, 199, 210, 0.3)"; // Neutral gray for holds
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-10">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-warm-gray-800 mb-2">
              Take a Breath
            </h1>
            <p className="text-sm text-warm-gray-600">
              Follow the ring or the cues below.
            </p>
          </div>

          {/* Preset Selector */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-warm-gray-700 mb-2">
              Breathing Pattern
            </label>
            <select
              value={selectedPreset.id}
              onChange={(e) => {
                const preset = breathingPresets.find(p => p.id === e.target.value);
                if (preset) {
                  resetBreathing();
                  setSelectedPreset(preset);
                }
              }}
              className="w-full px-4 py-3 rounded-xl border border-warm-gray-200 bg-white text-warm-gray-800 focus:ring-2 focus:ring-blush-300 focus:outline-none transition"
              data-testid="select-breathing-preset"
            >
              {breathingPresets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-warm-gray-500 mt-2">
              {selectedPreset.description}
            </p>
          </div>

          {/* Breathing Ring or Progress Bar */}
          {!prefersReducedMotion ? (
            <div className="flex justify-center mb-8">
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Ring */}
                <div
                  className="absolute rounded-full border-8 transition-all duration-1000 ease-in-out"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderColor: getPhaseColor(),
                    transform: `scale(${getRingScale()})`,
                    boxShadow: `0 0 30px ${getPhaseColor()}`,
                  }}
                />
                
                {/* Center Content */}
                <div className="relative z-10 text-center">
                  <div
                    className="text-3xl font-semibold text-warm-gray-800 mb-2"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {currentPhase.label}
                  </div>
                  <div className="text-lg text-warm-gray-600">
                    for {currentPhase.duration}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              {/* Static text cues for reduced motion */}
              <div className="text-center mb-4">
                <div
                  className="text-2xl font-semibold text-warm-gray-800 mb-2"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {currentPhase.label} for {currentPhase.duration}
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-warm-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-blush-300 transition-all duration-300"
                  style={{ width: `${phaseProgress * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <button
              onClick={isRunning ? pauseBreathing : startBreathing}
              className="flex items-center gap-2 px-6 py-3 bg-blush-300 hover:bg-blush-400 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
              data-testid="button-breath-start-pause"
            >
              {isRunning ? (
                <>
                  <Pause size={20} />
                  Pause
                </>
              ) : (
                <>
                  <Play size={20} />
                  Start
                </>
              )}
            </button>

            <button
              onClick={resetBreathing}
              className="flex items-center gap-2 px-6 py-3 bg-warm-gray-600 hover:bg-warm-gray-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
              data-testid="button-breath-reset"
            >
              <RotateCcw size={20} />
              Reset
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg ${
                soundEnabled
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-cream-200 hover:bg-cream-300 text-warm-gray-700"
              }`}
              data-testid="button-breath-sound"
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              Sound
            </button>
          </div>

          {/* Keyboard Hints */}
          <div className="text-center text-xs text-warm-gray-500">
            <kbd className="px-2 py-1 bg-warm-gray-100 rounded border border-warm-gray-300 mr-1">
              Space
            </kbd>
            Start/Pause •
            <kbd className="px-2 py-1 bg-warm-gray-100 rounded border border-warm-gray-300 mx-1">
              Enter
            </kbd>
            Reset
          </div>
        </div>
      </div>
    </div>
  );
}
