// client/src/pages/EchoVaultPage.tsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";

import HaloRippleEmber from "@/components/HaloRippleEmber";

import {
  readEchoesLocal,
  purgeExpiredDeletesLocal,
  tuckEchoLocal,
  softDeleteEchoLocal,
  finalizeDeleteEchoLocal,
  type EchoItem,
  base64ToBlob,
} from "@/lib/EchoVaultLocal";

/* ------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------ */

function seedRng(seed: string) {
  let h = 2166136261;

  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }

  return () => {
    h += 0x6d2b79f5;

    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Pos = {
  x: number;
  y: number;
  dur: number;
};

function generatePositions(ids: string[]): Record<string, Pos> {
  const rand = seedRng(ids.join("|") || "vault");
  const out: Record<string, Pos> = {};

  ids.forEach((id) => {
    out[id] = {
      x: 10 + rand() * 80,
      y: 18 + rand() * 62,
      dur: 6 + rand() * 3,
    };
  });

  return out;
}

function formatShort(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function formatLong(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/* Timeline grouping */

function isToday(ts: number) {
  return new Date(ts).toDateString() === new Date().toDateString();
}

function isYesterday(ts: number) {
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return new Date(ts).toDateString() === y.toDateString();
}

function isThisWeek(ts: number) {
  return Date.now() - ts < 1000 * 60 * 60 * 24 * 7;
}

function getTimelineLabel(ts: number) {
  if (isToday(ts)) return "Today";
  if (isYesterday(ts)) return "Yesterday";
  if (isThisWeek(ts)) return "Earlier This Week";
  return "Older";
}

/* ------------------------------------------------ */
/* Page */
/* ------------------------------------------------ */

const UNDO_MS = 6000;

export default function EchoVaultPage() {
  const [, setLocation] = useLocation();

  const [echoes, setEchoes] = useState<EchoItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [activeMood, setActiveMood] = useState("All");
  const [reflectionMode, setReflectionMode] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const refresh = () => {
    purgeExpiredDeletesLocal(UNDO_MS);
    setEchoes(readEchoesLocal());
  };

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);

    return () => window.removeEventListener("focus", refresh);
  }, []);

  const active = useMemo(
    () => echoes.find((e) => e.id === activeId) || null,
    [activeId, echoes]
  );

  /* ------------------------------------------------ */
  /* Filters */
  /* ------------------------------------------------ */

  const visibleEchoes = useMemo(
    () => echoes.filter((e) => !e.deletedAt && !e.tuckedAt),
    [echoes]
  );

  const moodOptions = useMemo(() => {
    const moods = visibleEchoes
      .map((e) => e.mood)
      .filter(Boolean) as string[];

    return ["All", ...Array.from(new Set(moods))];
  }, [visibleEchoes]);

  const filtered = useMemo(() => {
    return visibleEchoes.filter((e) => {
      const text = (e.content || "").toLowerCase();

      const moodMatch =
        activeMood === "All" ? true : e.mood === activeMood;

      const searchMatch =
        search.trim() === "" ||
        text.includes(search.toLowerCase()) ||
        (e.mood || "").toLowerCase().includes(search.toLowerCase());

      return moodMatch && searchMatch;
    });
  }, [visibleEchoes, activeMood, search]);

  /* ------------------------------------------------ */
  /* Floating Pond */
  /* ------------------------------------------------ */

  const pondEchoes = useMemo(() => filtered.slice(0, 12), [filtered]);

  const positions = useMemo(
    () => generatePositions(pondEchoes.map((e) => e.id)),
    [pondEchoes]
  );

  /* ------------------------------------------------ */
  /* Timeline */
  /* ------------------------------------------------ */

  const timelineGroups = useMemo(() => {
    const grouped: Record<string, EchoItem[]> = {
      Today: [],
      Yesterday: [],
      "Earlier This Week": [],
      Older: [],
    };

    filtered.forEach((e) => {
      grouped[getTimelineLabel(e.createdAt)].push(e);
    });

    return grouped;
  }, [filtered]);

  /* ------------------------------------------------ */
  /* Audio */
  /* ------------------------------------------------ */

  useEffect(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);

    if (!active || active.type !== "voice") return;

    if (active.audioBase64) {
      const blob = base64ToBlob(
        active.audioBase64,
        active.audioMime || "audio/webm"
      );

      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    }
  }, [activeId]);

  /* ------------------------------------------------ */
  /* Actions */
  /* ------------------------------------------------ */

  const closeOverlay = () => setActiveId(null);

  const onTuck = () => {
    if (!active) return;

    tuckEchoLocal(active.id);
    setActiveId(null);
    refresh();
  };

  const onDelete = () => {
    if (!active) return;

    softDeleteEchoLocal(active.id);

    setTimeout(() => {
      finalizeDeleteEchoLocal(active.id);
      refresh();
    }, UNDO_MS);

    refresh();
    setActiveId(null);
  };

  /* ------------------------------------------------ */
  /* Render */
  /* ------------------------------------------------ */

  return (
    <main className="relative min-h-screen overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-br from-[#fff1ec] via-[#f9ece6] to-[#fff]" />

      <section className="relative mx-auto max-w-5xl px-6 pt-10 pb-14">

        {/* Header */}

        <div className="mb-6 flex items-center justify-between">

          <button
            onClick={() => setLocation("/")}
            className="h-10 w-10 rounded-full border border-blush-200 bg-white/50"
          >
            ←
          </button>

          <div className="text-center">
            <h1 className="font-serif text-[30px] italic text-warm-800">
              Your Echoes
            </h1>

            <p className="text-[12px] italic text-warm-500">
              Drift through what you’ve released.
            </p>
          </div>

          <div className="w-10" />

        </div>

        {/* Controls */}

        <div className="mb-8 rounded-[26px] border border-white/50 bg-white/45 p-4 backdrop-blur-xl">

          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your echoes..."
              className="rounded-xl border border-blush-200 bg-white/70 px-4 py-3 text-sm"
            />

            <button
              onClick={() => setReflectionMode(!reflectionMode)}
              className="rounded-xl border border-blush-200 bg-white/70 px-4 py-3 text-sm"
            >
              {reflectionMode ? "Reflection Mode On" : "Reflection Mode Off"}
            </button>

          </div>

          <div className="mt-4 flex flex-wrap gap-2">

            {moodOptions.map((m) => (
              <button
                key={m}
                onClick={() => setActiveMood(m)}
                className="rounded-full border border-blush-200 bg-white/60 px-3 py-1 text-xs"
              >
                {m}
              </button>
            ))}

          </div>

        </div>

        {/* Floating Echo Pond */}

        <div className="mb-10">

          <div className="relative h-[420px]">

            {pondEchoes.map((e) => {
              const p = positions[e.id];

              return (
                <motion.div
                  key={e.id}
                  className="absolute"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: p.dur,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <HaloRippleEmber
                    type={e.type}
                    dateLabel={formatShort(e.createdAt)}
                    onClick={() => setActiveId(e.id)}
                  />
                </motion.div>
              );
            })}

          </div>

        </div>

        {/* Timeline */}

        <div className="space-y-8">

          {Object.entries(timelineGroups).map(([label, items]) => {

            if (items.length === 0) return null;

            return (
              <section key={label}>

                <div className="mb-3 flex items-center gap-3">
                  <div className="text-xs uppercase text-warm-500">
                    {label}
                  </div>
                  <div className="h-px flex-1 bg-blush-200" />
                </div>

                <div className={reflectionMode ? "space-y-4" : "grid gap-3 sm:grid-cols-2"}>

                  {items.map((e) => (

                    <button
                      key={e.id}
                      onClick={() => setActiveId(e.id)}
                      className="rounded-[22px] border border-white/60 bg-white/55 p-4 text-left"
                    >

                      <div className="text-xs text-warm-500">
                        {e.mood}
                      </div>

                      <p className="mt-2 text-sm text-warm-700">
                        {e.type === "voice"
                          ? "Voice echo resting here."
                          : e.content}
                      </p>

                      <div className="mt-3 text-xs text-warm-400">
                        {formatLong(e.createdAt)}
                      </div>

                    </button>

                  ))}

                </div>

              </section>
            );
          })}

        </div>

      </section>

      {/* Overlay */}

      <AnimatePresence>

        {active && (

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: "rgba(255,255,255,0.14)",
              backdropFilter: "blur(20px)",
            }}
          >

            <motion.div
              className="w-full max-w-md rounded-[28px] border border-blush-200 bg-white/70 px-6 py-6"
            >

              <div className="mb-4 text-xs text-warm-500">
                {active.mood}
              </div>

              {active.type === "text" && (
                <div className="rounded-xl border border-blush-200 bg-white/60 p-4">
                  {active.content}
                </div>
              )}

              {active.type === "voice" && audioUrl && (
                <audio ref={audioRef} src={audioUrl} controls className="w-full" />
              )}

              <div className="mt-6 flex gap-2">

                <button
                  onClick={onTuck}
                  className="flex-1 rounded-full border border-blush-200 bg-white/60 px-4 py-2 text-xs"
                >
                  Tuck away
                </button>

                <button
                  onClick={onDelete}
                  className="flex-1 rounded-full border border-blush-200 bg-white/60 px-4 py-2 text-xs text-rose-700"
                >
                  Delete
                </button>

              </div>

              <button
                onClick={closeOverlay}
                className="mt-3 w-full rounded-full border border-blush-200 bg-white/60 px-4 py-2 text-xs"
              >
                Back to stillness
              </button>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </main>
  );
}