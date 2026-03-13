import React, { useMemo, useState } from "react";
import dropletIcon from "@/assets/droplet.png";

type CalmStudioGame = "light-garden" | "bubble-drift" | "glow-trail" | "sand-sweep" | null;

function SectionCard({
  title,
  description,
  active,
  onClick,
  children,
}: {
  title: string;
  description: string;
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-3xl border text-left transition-all duration-300 p-5 md:p-6 shadow-sm ${
        active
          ? "border-blush-300 bg-white/95 shadow-md"
          : "border-blush-200 bg-white/80 hover:bg-white hover:shadow-md"
      }`}
    >
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-stone-800">{title}</h3>
        <p className="text-sm leading-6 text-stone-600">{description}</p>
        {children}
      </div>
    </button>
  );
}

function CalmIntro() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-blush-200 bg-white/75 px-6 py-7 md:px-8 md:py-8 shadow-sm backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-amber-50 opacity-80" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-stone-600 border border-blush-200">
            <img src={dropletIcon} alt="MoodDrop droplet" className="h-4 w-4 object-contain" />
            Calm Studio
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-stone-900">
            A softer place to land.
          </h1>
          <p className="mt-3 text-sm md:text-base leading-7 text-stone-600">
            Calm Studio is gently coming to life. Gentle Play is already available.
          </p>
        </div>
      </div>
    </div>
  );
}

function LightGarden() {
  const [lights, setLights] = useState<{ id: number; x: number; y: number }[]>([]);

  const handlePlace = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setLights((prev) => [...prev, { id: Date.now() + Math.random(), x, y }]);
  };

  const handleReset = () => setLights([]);

  return (
    <div className="rounded-[2rem] border border-blush-200 bg-white/90 p-4 md:p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-stone-800">Light Garden</h3>
          <p className="text-sm text-stone-600">Tap to place calming lights.</p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full border border-blush-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-blush-50"
        >
          Reset
        </button>
      </div>

      <div
        onClick={handlePlace}
        className="relative h-[280px] md:h-[340px] overflow-hidden rounded-[1.75rem] border border-blush-100 bg-gradient-to-br from-rose-100 via-amber-50 to-pink-100 cursor-crosshair"
      >
        {lights.map((light) => (
          <div
            key={light.id}
            className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 blur-[2px] shadow-[0_0_30px_rgba(255,200,200,0.9)]"
            style={{ left: `${light.x}%`, top: `${light.y}%` }}
          >
            <div className="absolute inset-0 rounded-full bg-amber-100/80 blur-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

function BubbleDrift() {
  const [bubbles, setBubbles] = useState(
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 26 + Math.random() * 42,
      duration: 8 + Math.random() * 8,
      delay: Math.random() * 6,
    }))
  );

  const refresh = () => {
    setBubbles(
      Array.from({ length: 14 }, (_, i) => ({
        id: Date.now() + i,
        left: Math.random() * 100,
        size: 26 + Math.random() * 42,
        duration: 8 + Math.random() * 8,
        delay: Math.random() * 6,
      }))
    );
  };

  return (
    <div className="rounded-[2rem] border border-blush-200 bg-white/90 p-4 md:p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-stone-800">Bubble Drift</h3>
          <p className="text-sm text-stone-600">Watch soft bubbles float upward.</p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="rounded-full border border-blush-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-blush-50"
        >
          Refresh
        </button>
      </div>

      <div className="relative h-[280px] md:h-[340px] overflow-hidden rounded-[1.75rem] border border-blush-100 bg-gradient-to-b from-sky-50 via-rose-50 to-amber-50">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute bottom-[-80px] rounded-full border border-white/70 bg-white/30 backdrop-blur-sm animate-[floatUp_linear_infinite]"
            style={{
              left: `${bubble.left}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              animationDuration: `${bubble.duration}s`,
              animationDelay: `${bubble.delay}s`,
              boxShadow: "0 0 24px rgba(255,255,255,0.45)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function GlowTrail() {
  const [points, setPoints] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPoints((prev) => [...prev.slice(-220), { x, y, id: Date.now() + Math.random() }]);
  };

  const reset = () => setPoints([]);

  return (
    <div className="rounded-[2rem] border border-blush-200 bg-white/90 p-4 md:p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-stone-800">Glow Trail</h3>
          <p className="text-sm text-stone-600">Press and drag to draw glowing trails.</p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-blush-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-blush-50"
        >
          Reset
        </button>
      </div>

      <div
        onMouseMove={handleMove}
        className="relative h-[280px] md:h-[340px] overflow-hidden rounded-[1.75rem] border border-blush-100 bg-gradient-to-br from-violet-50 via-pink-50 to-amber-50 cursor-crosshair"
      >
        {points.map((point) => (
          <div
            key={point.id}
            className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 blur-[3px]"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              boxShadow: "0 0 20px rgba(255, 210, 230, 0.95)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SandSweep() {
  const [sweeps, setSweeps] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSweeps((prev) => [...prev.slice(-180), { x, y, id: Date.now() + Math.random() }]);
  };

  const reset = () => setSweeps([]);

  return (
    <div className="rounded-[2rem] border border-blush-200 bg-white/90 p-4 md:p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-stone-800">Sand Sweep</h3>
          <p className="text-sm text-stone-600">Drag slowly to clear soft sand patterns.</p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-blush-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-blush-50"
        >
          Reset
        </button>
      </div>

      <div
        onMouseMove={handleMove}
        className="relative h-[280px] md:h-[340px] overflow-hidden rounded-[1.75rem] border border-blush-100 bg-gradient-to-br from-amber-100 via-rose-50 to-orange-100 cursor-crosshair"
      >
        {sweeps.map((point) => (
          <div
            key={point.id}
            className="absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 blur-md"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              boxShadow: "0 0 30px rgba(255,255,255,0.35)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function GameArea({
  activeGame,
  onClose,
}: {
  activeGame: CalmStudioGame;
  onClose: () => void;
}) {
  const gameTitle = useMemo(() => {
    switch (activeGame) {
      case "light-garden":
        return "Light Garden";
      case "bubble-drift":
        return "Bubble Drift";
      case "glow-trail":
        return "Glow Trail";
      case "sand-sweep":
        return "Sand Sweep";
      default:
        return "";
    }
  }, [activeGame]);

  if (!activeGame) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3 rounded-[1.5rem] border border-blush-200 bg-white/85 px-4 py-3 shadow-sm">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-stone-800">{gameTitle}</h2>
          <p className="text-sm text-stone-600">A gentle interactive moment, right here.</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-blush-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-blush-50"
        >
          Close
        </button>
      </div>

      {activeGame === "light-garden" && <LightGarden />}
      {activeGame === "bubble-drift" && <BubbleDrift />}
      {activeGame === "glow-trail" && <GlowTrail />}
      {activeGame === "sand-sweep" && <SandSweep />}
    </section>
  );
}

export default function CalmStudioPage() {
  const [activeGame, setActiveGame] = useState<CalmStudioGame>(null);

  const cardsDimmed = !!activeGame;

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 via-[#fffaf8] to-amber-50">
      <style>
        {`
          @keyframes floatUp {
            0% {
              transform: translateY(0) scale(1);
              opacity: 0;
            }
            10% {
              opacity: 0.8;
            }
            100% {
              transform: translateY(-430px) scale(1.08);
              opacity: 0;
            }
          }
        `}
      </style>

      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8 space-y-6 md:space-y-8">
        <CalmIntro />

        <GameArea activeGame={activeGame} onClose={() => setActiveGame(null)} />

        <section
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 transition-all duration-300 ${
            cardsDimmed ? "opacity-40" : "opacity-100"
          }`}
        >
          <SectionCard
            title="Take a Breath"
            description="A quiet breathing space will live here soon."
          />

          <SectionCard
            title="Soft Visuals"
            description="Calming loops and soft visual grounding moments are coming soon."
          />

          <SectionCard
            title="Soothing Sounds"
            description="Rain, ocean, fireplace, café ambience, and white noise will live here."
          />

          <div className="rounded-3xl border border-blush-300 bg-white/90 p-5 md:p-6 shadow-sm">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-stone-800">Gentle Play</h3>
              <p className="text-sm leading-6 text-stone-600">
                Small calming interactions you can use right now.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActiveGame("light-garden")}
                className="rounded-2xl border border-blush-200 bg-gradient-to-br from-rose-50 to-amber-50 p-4 text-left hover:shadow-md transition"
              >
                <div className="text-sm font-semibold text-stone-800">Light Garden</div>
                <div className="mt-1 text-xs leading-5 text-stone-600">
                  Tap to place calming lights.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveGame("bubble-drift")}
                className="rounded-2xl border border-blush-200 bg-gradient-to-br from-sky-50 to-rose-50 p-4 text-left hover:shadow-md transition"
              >
                <div className="text-sm font-semibold text-stone-800">Bubble Drift</div>
                <div className="mt-1 text-xs leading-5 text-stone-600">
                  Floating bubbles in palette tones.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveGame("glow-trail")}
                className="rounded-2xl border border-blush-200 bg-gradient-to-br from-violet-50 to-pink-50 p-4 text-left hover:shadow-md transition"
              >
                <div className="text-sm font-semibold text-stone-800">Glow Trail</div>
                <div className="mt-1 text-xs leading-5 text-stone-600">
                  Draw glowing trails with your movement.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveGame("sand-sweep")}
                className="rounded-2xl border border-blush-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 text-left hover:shadow-md transition"
              >
                <div className="text-sm font-semibold text-stone-800">Sand Sweep</div>
                <div className="mt-1 text-xs leading-5 text-stone-600">
                  Clear soft sand with slow motion.
                </div>
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}