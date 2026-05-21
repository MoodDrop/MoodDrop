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

import {
  Sun,
  Sprout,
  Wind,
  Waves,
  TreePine,
  Cloud,
  User,
  Minus,
  Flower2,
  Orbit,
  CircleAlert,
  HeartCrack,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const MOOD_ORDER = [
  "Joy",
  "Hopeful",
  "Relieved",
  "Calm",
  "Grounded",
  "Reflective",
  "Lonely",
  "Numb",
  "Upset",
  "Tense",
  "Overwhelmed",
  "CrashOut",
];

const COLLAPSED_MOODS = [
  "Joy",
  "Hopeful",
  "Calm",
  "Reflective",
  "Overwhelmed",
  "CrashOut",
];

function getMoodVisuals(mood: string) {
  switch (mood) {
    case "Joy":
      return {
        icon: Sun,
        iconColor: "text-yellow-500",
        bg: "bg-yellow-50",
      };

    case "Hopeful":
      return {
        icon: Sprout,
        iconColor: "text-lime-500",
        bg: "bg-lime-50",
      };

    case "Relieved":
      return {
        icon: Wind,
        iconColor: "text-teal-400",
        bg: "bg-teal-50",
      };

    case "Calm":
      return {
        icon: Waves,
        iconColor: "text-cyan-500",
        bg: "bg-cyan-50",
      };

    case "Grounded":
      return {
        icon: TreePine,
        iconColor: "text-emerald-500",
        bg: "bg-emerald-50",
      };

    case "Reflective":
      return {
        icon: Cloud,
        iconColor: "text-sky-500",
        bg: "bg-sky-50",
      };

    case "Lonely":
      return {
        icon: User,
        iconColor: "text-indigo-400",
        bg: "bg-indigo-50",
      };

    case "Numb":
      return {
        icon: Minus,
        iconColor: "text-slate-400",
        bg: "bg-slate-50",
      };

    case "Upset":
      return {
        icon: Flower2,
        iconColor: "text-rose-400",
        bg: "bg-rose-50",
      };

    case "Tense":
      return {
        icon: Orbit,
        iconColor: "text-orange-400",
        bg: "bg-orange-50",
      };

    case "Overwhelmed":
      return {
        icon: CircleAlert,
        iconColor: "text-violet-400",
        bg: "bg-violet-50",
      };

    case "CrashOut":
      return {
        icon: HeartCrack,
        iconColor: "text-red-400",
        bg: "bg-red-50",
      };

    default:
      return {
        icon: Cloud,
        iconColor: "text-slate-400",
        bg: "bg-slate-50",
      };
  }
}

function getMoodTint(mood?: string | null) {
  switch (mood) {
    case "Joy":
      return "from-yellow-50 via-white to-yellow-100/60";

    case "Hopeful":
      return "from-lime-50 via-white to-lime-100/60";

    case "Relieved":
      return "from-teal-50 via-white to-teal-100/60";

    case "Calm":
      return "from-cyan-50 via-white to-cyan-100/60";

    case "Grounded":
      return "from-emerald-50 via-white to-emerald-100/60";

    case "Reflective":
      return "from-sky-50 via-white to-sky-100/60";

    case "Lonely":
      return "from-indigo-50 via-white to-indigo-100/60";

    case "Numb":
      return "from-slate-50 via-white to-slate-100/60";

    case "Upset":
      return "from-rose-50 via-white to-rose-100/60";

    case "Tense":
      return "from-orange-50 via-white to-orange-100/60";

    case "Overwhelmed":
      return "from-violet-50 via-white to-violet-100/60";

    case "CrashOut":
      return "from-red-50 via-white to-red-100/60";

    default:
      return "from-[#fffaf7] via-white to-[#fff3f7]";
  }
}

function getMoodDotColor(mood?: string | null) {
  switch (mood) {
    case "Joy":
      return "bg-yellow-300";

    case "Hopeful":
      return "bg-lime-300";

    case "Relieved":
      return "bg-teal-200";

    case "Calm":
      return "bg-cyan-300";

    case "Grounded":
      return "bg-emerald-200";

    case "Reflective":
      return "bg-sky-300";

    case "Lonely":
      return "bg-indigo-200";

    case "Numb":
      return "bg-slate-200";

    case "Upset":
      return "bg-rose-200";

    case "Tense":
      return "bg-orange-300";

    case "Overwhelmed":
      return "bg-violet-300";

    case "CrashOut":
      return "bg-red-300";

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

  return MOOD_ORDER.map((mood) => [
    mood,
    counts[mood] || 0,
  ]) as [string, number][];
}

function getDotCount(count: number, maxCount: number) {
  if (count === 0) return 2;

  const ratio = count / maxCount;

  if (ratio >= 0.9) return 7;
  if (ratio >= 0.75) return 6;
  if (ratio >= 0.55) return 5;
  if (ratio >= 0.4) return 4;
  if (ratio >= 0.2) return 3;

  return 2;
}

function getDotOpacity(index: number, count: number) {
  if (count === 0) {
    return index === 0 ? "opacity-25" : "opacity-15";
  }

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

  const [activeCanvas, setActiveCanvas] =
    useState<SharedCanvas | null>(null);

  const [selectedMood, setSelectedMood] =
    useState<string | null>(null);

  const [expandedSpectrum, setExpandedSpectrum] =
    useState(false);

  useEffect(() => {
    async function loadGallery() {
      try {
        setLoading(true);

        const data = await getSharedDrops();

        setCanvases(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load the Living Gallery.");
      } finally {
        setLoading(false);
      }
    }

    loadGallery();
  }, []);

  const moodRows = useMemo(() => {
    const rows = groupMoodCounts(canvases);

    if (expandedSpectrum) return rows;

    return rows.filter(([mood]) =>
      COLLAPSED_MOODS.includes(mood)
    );
  }, [canvases, expandedSpectrum]);

  const maxCount = Math.max(
    ...groupMoodCounts(canvases).map(([, count]) => count),
    1
  );

  const selectedMoodEntries = useMemo(() => {
    if (!selectedMood) return [];

    return canvases.filter(
      (canvas) => canvas.mood === selectedMood
    );
  }, [canvases, selectedMood]);

  async function handleOpenCanvas(canvas: SharedCanvas) {
    setActiveCanvas(canvas);

    try {
      const updated = await incrementWitnessCount(canvas.id);

      setCanvases((prev) =>
        prev.map((item) =>
          item.id === canvas.id
            ? {
                ...item,
                witness_count: updated.witness_count,
              }
            : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main
      className={`relative min-h-screen bg-gradient-to-b ${getMoodTint(
        activeCanvas?.mood ?? selectedMood
      )} px-4 py-8 sm:px-6`}
    >
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

        <section className="mx-auto mb-10 max-w-2xl rounded-[28px] border border-white/70 bg-white/70 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="mb-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              What the space is holding
            </p>

            <p className="mt-2 text-sm italic text-slate-500">
              A soft glimpse of what’s present today.
              Tap a feeling to explore.
            </p>
          </div>

          <div className="space-y-2.5">
            {moodRows.map(([mood, count]) => {
              const {
                icon: Icon,
                iconColor,
                bg,
              } = getMoodVisuals(mood);

              const percent = canvases.length
                ? Math.round((count / canvases.length) * 100)
                : 0;

              const dotCount = getDotCount(count, maxCount);

              const isActive = selectedMood === mood;

              return (
                <button
                  key={mood}
                  onClick={() =>
                    setSelectedMood((prev) =>
                      prev === mood ? null : mood
                    )
                  }
                  className={`w-full rounded-2xl border border-white/60 bg-white/40 px-3 py-3 transition hover:bg-white/60 ${
                    isActive
                      ? "shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${bg}`}
                    >
                      <Icon
                        size={18}
                        className={iconColor}
                        strokeWidth={1.8}
                      />
                    </div>

                    <div className="min-w-[92px] text-left text-[15px] text-slate-800">
                      {mood}
                    </div>

                    <div className="flex flex-1 items-center gap-2">
                      {Array.from({ length: dotCount }).map(
                        (_, index) => (
                          <span
                            key={`${mood}-${index}`}
                            className={[
                              "h-2.5 w-2.5 rounded-full",
                              getMoodDotColor(mood),
                              getDotOpacity(index, count),
                            ].join(" ")}
                          />
                        )
                      )}
                    </div>

                    <div className="w-[38px] text-right text-xs text-slate-400">
                      {percent}%
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() =>
              setExpandedSpectrum((prev) => !prev)
            }
            className="mx-auto mt-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-rose-400 transition hover:text-rose-500"
          >
            {expandedSpectrum ? (
              <>
                <ChevronUp size={14} />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                View All Feelings
              </>
            )}
          </button>
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
          ) : (
            <EmotionField
              canvases={canvases}
              onOpen={handleOpenCanvas}
              activeMood={selectedMood ?? "All"}
            />
          )}
        </section>
      </div>

      <AnimatePresence>
        {selectedMood && (
          <>
            <motion.div
              className="fixed inset-0 z-30 bg-[rgba(255,248,246,0.34)] backdrop-blur-[8px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="fixed inset-x-4 top-5 bottom-5 z-40 overflow-hidden rounded-[34px] border border-white/75 bg-[rgba(255,255,255,0.55)] shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-2xl"
            >
              <div className="flex h-full flex-col">
                <div className="border-b border-white/50 px-5 pb-5 pt-6 text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {formatSelectedMoodTitle(selectedMood)}
                  </p>

                  <p className="mt-2 text-sm italic text-slate-500">
                    Moments others needed to release.
                  </p>

                  <button
                    onClick={() => setSelectedMood(null)}
                    className="mt-4 text-xs italic text-slate-400 transition hover:text-slate-600"
                  >
                    Return to the full space
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-5 pt-5">
                  {selectedMoodEntries.length === 0 ? (
                    <div className="rounded-[28px] border border-white/70 bg-white/65 p-8 text-center text-slate-500">
                      Nothing has been shared here just yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedMoodEntries.map((canvas) => (
                        <button
                          key={canvas.id}
                          onClick={() =>
                            handleOpenCanvas(canvas)
                          }
                          className="w-full rounded-[26px] border border-white/75 bg-[rgba(255,255,255,0.62)] px-4 py-4 text-left transition hover:bg-[rgba(255,255,255,0.78)]"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
                              {canvas.mood || "Shared"}
                            </span>

                            <span className="text-[11px] italic text-slate-350">
                              Witnessed by {canvas.witness_count ?? 0}
                            </span>
                          </div>

                          <p className="mt-3 text-sm leading-6 text-slate-700">
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
        )}
      </AnimatePresence>

      <CanvasViewer
        canvas={activeCanvas}
        onClose={() => setActiveCanvas(null)}
      />
    </main>
  );
}