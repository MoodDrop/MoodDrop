// client/src/pages/LivingGalleryPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  SharedCanvas,
  getSharedDrops,
  incrementWitnessCount,
} from "@/lib/livingGallery";
import EmotionField from "@/components/gallery/EmotionField";
import CanvasViewer from "@/components/gallery/CanvasViewer";

const FALLBACK_MOODS = ["Healing", "CrashOut", "Hopeful", "Overwhelmed"];

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

function getMoodDotColor(mood?: string | null) {
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
      return "bg-slate-300";
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

function getDotCount(count: number, maxCount: number) {
  if (maxCount <= 0) return 3;

  const ratio = count / maxCount;

  if (ratio >= 0.9) return 7;
  if (ratio >= 0.75) return 6;
  if (ratio >= 0.55) return 5;
  if (ratio >= 0.4) return 4;
  if (ratio >= 0.2) return 3;
  return 2;
}

function getDotOpacity(index: number) {
  const opacities = [
    "opacity-100",
    "opacity-85",
    "opacity-70",
    "opacity-55",
    "opacity-40",
    "opacity-25",
    "opacity-15",
  ];

  return opacities[index] ?? "opacity-15";
}

function formatSelectedMoodTitle(mood: string) {
  return `Shared under ${mood}`;
}

function getEntryPreview(text: string, maxLength = 160) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).trim()}…`;
}

export default function LivingGalleryPage() {
  const [canvases, setCanvases] = useState<SharedCanvas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCanvas, setActiveCanvas] = useState<SharedCanvas | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

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

  const moodRows = useMemo(() => {
    const grouped = groupMoodCounts(canvases);

    if (grouped.length === 0) {
      return FALLBACK_MOODS.map(
        (mood, index) => [mood, 5 - index] as [string, number]
      );
    }

    return grouped;
  }, [canvases]);

  const maxCount = Math.max(...moodRows.map(([, count]) => count), 1);

  const selectedMoodEntries = useMemo(() => {
    if (!selectedMood) return [];
    return canvases.filter((canvas) => canvas.mood === selectedMood);
  }, [canvases, selectedMood]);

  async function handleOpenCanvas(canvas: SharedCanvas) {
    setActiveCanvas(canvas);

    try {
      const updated = await incrementWitnessCount(canvas.id);

      setCanvases((prev) =>
        prev.map((item) =>
          item.id === canvas.id
            ? { ...item, witness_count: updated.witness_count }
            : item
        )
      );

      setActiveCanvas((prev) =>
        prev && prev.id === canvas.id
          ? { ...prev, witness_count: updated.witness_count }
          : prev
      );
    } catch (err) {
      console.error("[MoodDrop] Error incrementing witness count:", err);
    }
  }

  function handleMoodSelect(mood: string) {
    setSelectedMood((prev) => (prev === mood ? null : mood));
  }

  function handleCloseMoodOverlay() {
    setSelectedMood(null);
  }

  return (
    <main
      className={`relative min-h-screen bg-gradient-to-b ${getMoodTint(
        activeCanvas?.mood ?? selectedMood
      )} px-4 py-8 sm:px-6`}
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
            A quiet mosaic of what others shared anonymously today.
          </p>

          <p className="mt-2 text-sm italic text-slate-500">
            Open a moment to gently witness it in full.
          </p>
        </section>

        <section className="mx-auto mb-10 max-w-2xl rounded-[28px] border border-white/70 bg-white/70 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="mb-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              What the space is holding
            </p>

            <p className="mt-2 text-sm italic text-slate-500">
              A soft glimpse of what’s present today. Tap a feeling to explore.
            </p>
          </div>

          <div className="space-y-3">
            {moodRows.map(([mood, count]) => {
              const percent = canvases.length
                ? Math.round((count / canvases.length) * 100)
                : 0;

              const dotCount = getDotCount(count, maxCount);
              const isActive = selectedMood === mood;
              const isDimmed = selectedMood && !isActive;

              return (
                <button
                  key={mood}
                  type="button"
                  onClick={() => handleMoodSelect(mood)}
                  className={[
                    "grid w-full grid-cols-[110px_1fr_40px] items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition duration-300",
                    "focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-0",
                    isActive
                      ? "bg-white/55 shadow-[0_8px_18px_rgba(15,23,42,0.03)]"
                      : "bg-white/18 hover:bg-white/32",
                    isDimmed ? "opacity-55" : "opacity-100",
                  ].join(" ")}
                  aria-pressed={isActive}
                >
                  <div
                    className={[
                      "text-sm transition",
                      isActive ? "text-slate-800" : "text-slate-700",
                    ].join(" ")}
                  >
                    {mood}
                  </div>

                  <div className="flex items-center gap-2.5">
                    {Array.from({ length: dotCount }).map((_, index) => (
                      <span
                        key={`${mood}-${index}`}
                        className={[
                          "h-2.5 w-2.5 rounded-full transition",
                          getMoodDotColor(mood),
                          getDotOpacity(index),
                          isActive ? "scale-105" : "",
                        ].join(" ")}
                      />
                    ))}
                  </div>

                  <div
                    className={[
                      "text-xs transition",
                      isActive ? "text-slate-500" : "text-slate-400",
                    ].join(" ")}
                  >
                    {percent}%
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[32px] border border-white/60 bg-white/35 px-4 py-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] backdrop-blur sm:px-5 sm:py-7">
          <div className="mb-5 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Emotional Field
            </p>

            <p className="mt-2 text-sm italic text-slate-500">
              Drift through what today is holding.
            </p>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500">
              Gathering what’s been gently shared today...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
              {error}
            </div>
          ) : canvases.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 text-center text-slate-500">
              <p>It’s quiet here right now.</p>
              <p className="mt-2">
                When something is shared, it will drift through.
              </p>
            </div>
          ) : (
            <>
              <EmotionField
                canvases={canvases}
                onOpen={handleOpenCanvas}
                activeMood={selectedMood ?? "All"}
              />

              <div className="mt-4 pb-1 text-center">
                <p className="text-sm italic text-slate-500">
                  A glimpse of what’s been shared today.
                </p>

                <p className="mt-1 text-sm italic text-slate-400">
                  More is quietly drifting beneath the surface.
                </p>
              </div>
            </>
          )}
        </section>
      </div>

      <AnimatePresence>
        {selectedMood && !loading && !error ? (
          <>
            <motion.div
              key="mood-overlay-backdrop"
              className="fixed inset-0 z-30 bg-[rgba(255,248,246,0.34)] backdrop-blur-[8px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            />

            <motion.section
              key={`mood-overlay-${selectedMood}`}
              initial={{ opacity: 0, y: 16, scale: 0.992 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.996 }}
              transition={{ duration: 0.34, ease: "easeOut" }}
              className="fixed inset-x-4 top-5 bottom-5 z-40 overflow-hidden rounded-[34px] border border-white/75 bg-[rgba(255,255,255,0.50)] shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:inset-x-8 sm:top-7 sm:bottom-7 lg:left-1/2 lg:right-auto lg:w-[min(760px,calc(100vw-6rem))] lg:-translate-x-1/2"
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-[10%] top-[8%] h-24 w-24 rounded-full bg-white/26 blur-3xl" />
                <div className="absolute right-[14%] top-[18%] h-20 w-20 rounded-full bg-pink-100/30 blur-3xl" />
                <div className="absolute bottom-[18%] left-[18%] h-24 w-24 rounded-full bg-amber-50/25 blur-3xl" />
              </div>

              <div className="relative flex h-full flex-col">
                <div className="border-b border-white/50 px-5 pb-5 pt-6 sm:px-7 sm:pb-6 sm:pt-7">
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      {formatSelectedMoodTitle(selectedMood)}
                    </p>

                    <p className="mt-2 text-sm italic text-slate-500">
                      Moments others needed to release.
                    </p>

                    <button
                      type="button"
                      onClick={handleCloseMoodOverlay}
                      className="mt-4 text-xs italic text-slate-400 transition hover:text-slate-600"
                    >
                      Return to the full space
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
                  {selectedMoodEntries.length === 0 ? (
                    <div className="rounded-[28px] border border-white/70 bg-white/65 p-8 text-center text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.03)]">
                      <p>Nothing has been shared here just yet.</p>
                      <p className="mt-2">
                        Try another feeling, or return to the full space.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {selectedMoodEntries.map((canvas) => (
                        <button
                          key={canvas.id}
                          type="button"
                          onClick={() => handleOpenCanvas(canvas)}
                          className="w-full rounded-[26px] border border-white/75 bg-[rgba(255,255,255,0.62)] px-4 py-4 text-left shadow-[0_8px_20px_rgba(15,23,42,0.03)] backdrop-blur-md transition duration-300 hover:bg-[rgba(255,255,255,0.78)] focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-0 sm:px-5 sm:py-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
                              {canvas.mood || "Shared"}
                            </span>

                            <span className="text-[11px] italic text-slate-350">
                              Witnessed by {canvas.witness_count ?? 0}
                            </span>
                          </div>

                          <p className="mt-3 text-sm leading-6 text-slate-700 sm:leading-7">
                            {getEntryPreview(canvas.text)}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.section>
          </>
        ) : null}
      </AnimatePresence>

      <CanvasViewer
        canvas={activeCanvas}
        onClose={() => setActiveCanvas(null)}
      />
    </main>
  );
}