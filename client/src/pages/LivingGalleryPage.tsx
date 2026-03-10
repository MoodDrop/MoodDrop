import React, { useEffect, useMemo, useState } from "react";
import { SharedCanvas, getSharedDrops } from "@/lib/livingGallery";
import EmotionField from "@/components/gallery/EmotionField";
import CanvasViewer from "../components/gallery/CanvasViewer";

const FALLBACK_MOODS = ["Healing", "CrashOut", "Hopeful", "Overwhelmed"];

function getMoodColor(mood?: string | null) {
  switch (mood) {
    case "CrashOut":
      return "bg-rose-300";
    case "Overwhelmed":
      return "bg-violet-300";
    case "Healing":
      return "bg-emerald-300";
    case "Hopeful":
      return "bg-amber-300";
    case "Reflective":
      return "bg-sky-300";
    case "Lonely":
      return "bg-slate-300";
    case "Grateful":
      return "bg-pink-300";
    case "Calm":
      return "bg-teal-300";
    case "Tense":
      return "bg-orange-300";
    case "Grounded":
      return "bg-lime-300";
    case "Joy":
      return "bg-yellow-300";
    default:
      return "bg-slate-200";
  }
}

function getMoodTint(mood?: string | null) {
  switch (mood) {
    case "CrashOut":
      return "from-rose-50 via-white to-rose-100/60";
    case "Overwhelmed":
      return "from-violet-50 via-white to-violet-100/60";
    case "Healing":
      return "from-emerald-50 via-white to-emerald-100/60";
    case "Hopeful":
      return "from-amber-50 via-white to-amber-100/60";
    case "Reflective":
      return "from-sky-50 via-white to-sky-100/60";
    default:
      return "from-[#fffaf7] via-white to-[#fff3f7]";
  }
}

function groupMoodCounts(canvases: SharedCanvas[]) {
  const counts: Record<string, number> = {};

  canvases.forEach((item) => {
    const mood = item.mood || "Unknown";
    counts[mood] = (counts[mood] || 0) + 1;
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}

export default function LivingGalleryPage() {
  const [canvases, setCanvases] = useState<SharedCanvas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCanvas, setActiveCanvas] = useState<SharedCanvas | null>(null);
  const [activeMood, setActiveMood] = useState<string | null>(null);

  useEffect(() => {
    async function loadGallery() {
      try {
        setLoading(true);
        setError(null);

        const data = await getSharedDrops();
        setCanvases(data);
      } catch (err) {
        console.error("[MoodDrop] Error loading Living Gallery:", err);
        setError("Unable to load the Living Gallery right now.");
      } finally {
        setLoading(false);
      }
    }

    loadGallery();
  }, []);

  const moodBars = useMemo(() => {
    const grouped = groupMoodCounts(canvases);

    if (grouped.length === 0) {
      return FALLBACK_MOODS.map((mood, index) => [mood, 5 - index] as [string, number]);
    }

    return grouped;
  }, [canvases]);

  const maxCount = Math.max(...moodBars.map(([, count]) => count), 1);

  const filteredMoodCanvases = useMemo(() => {
    if (!activeMood) return [];
    return canvases.filter((item) => item.mood === activeMood);
  }, [canvases, activeMood]);

  const handleWitnessedUpdate = (updatedCanvas: SharedCanvas) => {
    setCanvases((prev) =>
      prev.map((item) => (item.id === updatedCanvas.id ? updatedCanvas : item))
    );
    setActiveCanvas(updatedCanvas);
  };

  return (
    <main
      className={`min-h-screen bg-gradient-to-b ${getMoodTint(activeCanvas?.mood)} px-4 py-8 sm:px-6`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute left-[10%] top-[12%] h-40 w-40 rounded-full bg-pink-100 blur-3xl" />
        <div className="absolute right-[12%] top-[28%] h-48 w-48 rounded-full bg-amber-50 blur-3xl" />
        <div className="absolute bottom-[16%] left-[28%] h-44 w-44 rounded-full bg-rose-50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <section className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Living Gallery
          </h1>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            A quiet mosaic of what hearts released today.
          </p>
          <p className="mt-2 text-sm italic text-slate-500">
            Witness what was felt. Leave softly.
          </p>
        </section>

        <section className="mx-auto mb-10 max-w-2xl rounded-[28px] border border-white/70 bg-white/70 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="mb-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Emotional Weather Today
            </p>
          </div>

          <div className="space-y-4">
            {moodBars.map(([mood, count]) => {
              const widthPercent = Math.max((count / maxCount) * 100, 18);
              const isActive = activeMood === mood;

              return (
                <button
                  key={mood}
                  type="button"
                  onClick={() => setActiveMood(mood)}
                  className={`grid w-full grid-cols-[110px_1fr] items-center gap-3 rounded-xl px-2 py-1 text-left transition ${
                    isActive ? "bg-white/60" : "hover:bg-white/40"
                  }`}
                >
                  <div className="text-sm text-slate-700">{mood}</div>
                  <div className="h-2.5 rounded-full bg-white/70">
                    <div
                      className={`h-2.5 rounded-full ${getMoodColor(mood)}`}
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {activeMood && (
          <section className="mx-auto mb-8 max-w-3xl rounded-[28px] border border-white/70 bg-white/72 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl text-slate-800">All {activeMood}s</h2>
                <p className="mt-1 text-sm italic text-slate-500">
                  Browse everything floating through this feeling.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveMood(null)}
                className="rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm text-slate-600 hover:bg-white"
              >
                Close
              </button>
            </div>

            <div className="mt-5 max-h-[340px] space-y-3 overflow-y-auto pr-1">
              {filteredMoodCanvases.length === 0 ? (
                <div className="rounded-2xl bg-white/70 px-4 py-5 text-sm text-slate-500">
                  No shared moments here yet.
                </div>
              ) : (
                filteredMoodCanvases.slice(0, 30).map((canvas) => (
                  <button
                    key={canvas.id}
                    type="button"
                    onClick={() => setActiveCanvas(canvas)}
                    className="w-full rounded-2xl border border-white/80 bg-white/75 px-4 py-4 text-left shadow-sm hover:bg-white"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-white px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-600">
                        {canvas.mood}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Witnessed by {canvas.witness_count ?? 0}
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {canvas.text}
                    </p>
                  </button>
                ))
              )}
            </div>
          </section>
        )}

        <section className="rounded-[32px] border border-white/60 bg-white/35 px-4 py-8 shadow-[0_16px_50px_rgba(15,23,42,0.05)] backdrop-blur">
          <div className="mb-6 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Emotional Field
            </p>
            <p className="mt-2 text-sm italic text-slate-500">
              Drift through what the day is holding.
            </p>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-500">
              Gathering today’s shared moments...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center text-red-700">
              {error}
            </div>
          ) : canvases.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-10 text-center text-slate-500">
              No shared moments are floating through yet.
            </div>
          ) : (
            <EmotionField
              canvases={canvases}
              activeMood={activeMood}
              onOpen={(canvas) => {
                setActiveCanvas(canvas);
              }}
            />
          )}
        </section>
      </div>

      <CanvasViewer
        canvas={activeCanvas}
        onClose={() => setActiveCanvas(null)}
        onWitnessed={handleWitnessedUpdate}
      />
    </main>
  );
}