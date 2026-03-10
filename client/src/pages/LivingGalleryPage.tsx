// client/src/pages/LivingGalleryPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { CanvasCard } from "../components/gallery/CanvasCard";
import { SharedCanvas, getSharedDrops } from "@/lib/livingGallery";

const FILTERS = [
  "All",
  "CrashOut",
  "Overwhelmed",
  "Healing",
  "Hopeful",
  "Reflective",
  "Lonely",
  "Grateful",
];

export default function LivingGalleryPage() {
  const [selectedMood, setSelectedMood] = useState<string>("All");
  const [canvases, setCanvases] = useState<SharedCanvas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGallery() {
      try {
        setLoading(true);
        setError(null);

        const data = await getSharedDrops(selectedMood);
        setCanvases(data);
      } catch (err) {
        console.error("[MoodDrop] Error loading Living Gallery:", err);
        setError("Unable to load the Living Gallery right now.");
      } finally {
        setLoading(false);
      }
    }

    loadGallery();
  }, [selectedMood]);

  const emotionalWeather = useMemo(() => {
    const moods = canvases
      .map((item) => item.mood)
      .filter(Boolean) as string[];

    if (moods.length === 0) {
      return ["CrashOut", "Overwhelmed", "Healing", "Hopeful"];
    }

    return Array.from(new Set(moods)).slice(0, 4);
  }, [canvases]);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
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

        <section className="mb-8 rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Emotional Weather
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {emotionalWeather.map((mood) => (
              <span
                key={mood}
                className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
              >
                {mood}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => {
              const isActive = selectedMood === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedMood(filter)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-10 text-center text-slate-500">
              Gathering today’s shared moments...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center text-red-700">
              {error}
            </div>
          ) : canvases.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-10 text-center text-slate-500">
              No shared canvases yet for this mood.
            </div>
          ) : (
           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
  {canvases.map((canvas) => (
    <CanvasCard
      key={canvas.id}
      canvas={canvas}
      onOpen={(selected: SharedCanvas) => {
        console.log("[MoodDrop] Open canvas:", selected);
      }}
    />
  ))}
</div>
          )}
        </section>

        <section className="mt-12 text-center">
          <p className="text-sm italic text-slate-500">
            Some feelings are lighter once witnessed.
          </p>
        </section>
      </div>
    </div>
  );
}