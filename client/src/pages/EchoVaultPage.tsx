// client/src/pages/EchoVaultPage.tsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";
import HaloRippleEmber from "@/components/HaloRippleEmber";
import {
  readEchoesLocal,
  purgeExpiredDeletesLocal,
  softDeleteEchoLocal,
  finalizeDeleteEchoLocal,
  type EchoItem,
  base64ToBlob,
} from "@/lib/EchoVaultLocal";

/* ---------- helpers ---------- */

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
  delay: number;
};

function generatePositions(ids: string[]): Record<string, Pos> {
  const rand = seedRng(ids.join("|") || "droplets");
  const out: Record<string, Pos> = {};

  ids.forEach((id) => {
    out[id] = {
      x: 10 + rand() * 80,
      y: 18 + rand() * 58,
      dur: 6 + rand() * 3,
      delay: rand() * 2,
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
  return new Date(ts).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function normalizeMoodLabel(mood?: string) {
  const key = (mood || "").trim().toLowerCase();

  if (key === "crashout" || key === "crash out") return "Crash Out";
  if (key === "calm") return "Calm";
  if (key === "anxious") return "Anxious";
  if (key === "grounded") return "Grounded";
  if (key === "joy") return "Joy";
  if (key === "overwhelmed") return "Overwhelmed";
  if (key === "tense") return "Anxious";

  return mood || "Unnamed";
}

function getDropletText(e: EchoItem) {
  if (e.type === "text") return e.content || "";
  return "Voice droplet";
}

function getPreviewText(e: EchoItem, maxLen = 120) {
  const text = getDropletText(e);
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen).trim()}…`;
}

function moodTint(mood?: string) {
  const normalized = normalizeMoodLabel(mood).toLowerCase();

  if (["joy"].includes(normalized)) {
    return "from-[#fff6ea] to-[#fffdf8]";
  }

  if (["overwhelmed", "crash out"].includes(normalized)) {
    return "from-[#fff1f1] to-[#fff9f8]";
  }

  if (["calm", "grounded"].includes(normalized)) {
    return "from-[#f8f1ee] to-[#fffdfc]";
  }

  if (["anxious"].includes(normalized)) {
    return "from-[#fff4ef] to-[#fffaf8]";
  }

  return "from-[#fff7f4] to-[#fffdfc]";
}

/* ---------- page ---------- */

const UNDO_MS = 6000;
const MOOD_OPTIONS = [
  "All",
  "Calm",
  "Anxious",
  "Crash Out",
  "Grounded",
  "Joy",
  "Overwhelmed",
];

export default function EchoVaultPage() {
  const [, setLocation] = useLocation();

  const [echoes, setEchoes] = useState<EchoItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMood, setActiveMood] = useState("All");

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

  const visibleEchoes = useMemo(
    () => echoes.filter((e) => !e.deletedAt && !e.tuckedAt),
    [echoes]
  );

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return visibleEchoes.filter((e) => {
      const normalizedMood = normalizeMoodLabel(e.mood);
      const moodMatch = activeMood === "All" ? true : normalizedMood === activeMood;

      const text = getDropletText(e).toLowerCase();
      const moodText = normalizedMood.toLowerCase();

      const searchMatch = !q || text.includes(q) || moodText.includes(q);

      return moodMatch && searchMatch;
    });
  }, [visibleEchoes, activeMood, searchTerm]);

  const pondDroplets = useMemo(() => filtered.slice(0, 8), [filtered]);

  const positions = useMemo(
    () => generatePositions(pondDroplets.map((e) => e.id)),
    [pondDroplets]
  );

  const hasAnyDroplets = visibleEchoes.length > 0;
  const hasFilteredResults = filtered.length > 0;

  /* ---------- audio ---------- */

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  useEffect(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    if (!active || active.type !== "voice") return;

    if (active.audioBase64) {
      const blob = base64ToBlob(
        active.audioBase64,
        active.audioMime || "audio/webm"
      );

      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    }
  }, [active]);

  /* ---------- actions ---------- */

  const closeOverlay = () => setActiveId(null);

  const onDelete = () => {
    if (!active) return;

    softDeleteEchoLocal(active.id);
    setActiveId(null);

    setTimeout(() => {
      finalizeDeleteEchoLocal(active.id);
      refresh();
    }, UNDO_MS);

    refresh();
  };

  /* ---------- render ---------- */

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#fff1ec] via-[#f9ece6] to-[#fff]" />

      <section className="relative mx-auto max-w-5xl px-6 pt-10 pb-16">
        {/* Header */}

        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => setLocation("/")}
            className="h-10 w-10 rounded-full border border-blush-200 bg-white/60 text-warm-700 shadow-sm transition hover:bg-white/80"
            aria-label="Back home"
          >
            ←
          </button>

          <div className="text-center">
            <h1 className="text-[30px] italic font-serif text-warm-800">
              My Droplets
            </h1>
            <p className="text-[12px] italic text-warm-500">
              A private space for what you’ve released.
            </p>
          </div>

          <div className="w-10" />
        </div>

        {/* Empty State */}

        {!hasAnyDroplets && (
          <section className="mb-12">
            <div className="mx-auto flex min-h-[52vh] max-w-2xl items-center justify-center rounded-[32px] border border-white/50 bg-white/35 px-6 py-10 backdrop-blur-xl">
              <div className="mx-auto max-w-md text-center">
                <motion.div
                  className="mx-auto mb-6 h-28 w-28 rounded-full bg-white/40 blur-[2px]"
                  animate={{
                    scale: [1, 1.04, 1],
                    opacity: [0.35, 0.55, 0.35],
                  }}
                  transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="flex h-full w-full items-center justify-center text-4xl text-white/80">
                    💧
                  </div>
                </motion.div>

                <h2 className="text-lg font-medium text-warm-800">
                  No droplets yet
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-warm-600">
                  When you release something, it can rest here quietly.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Content State */}

        {hasAnyDroplets && (
          <>
            {/* Floating Droplet Field */}

            <section className="mx-auto mb-8 max-w-2xl rounded-[32px] border border-white/50 bg-white/28 px-4 py-5 backdrop-blur-xl">
              <div className="mb-4 text-center">
                <h2 className="text-sm font-medium text-warm-700">
                  Floating softly
                </h2>
                <p className="mt-1 text-xs italic text-warm-500">
                  A gentle view of what you’ve been holding.
                </p>
              </div>

              <div className="relative h-[34vh] min-h-[240px] sm:h-[40vh]">
                {pondDroplets.map((e) => {
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
                      animate={{
                        y: [0, -10, 0],
                        scale: [1, 1.05, 1],
                        opacity: [0.9, 1, 0.9],
                      }}
                      transition={{
                        duration: p.dur,
                        delay: p.delay,
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
            </section>

            {/* Search + Filters */}

            <section className="mx-auto mb-8 max-w-2xl rounded-[26px] border border-white/50 bg-white/45 p-4 backdrop-blur-xl">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search your droplets..."
                className="w-full rounded-xl border border-blush-200 bg-white/75 px-4 py-3 text-sm text-warm-800 placeholder:text-warm-400 focus:outline-none"
              />

              <div className="mt-4 flex flex-wrap gap-2">
                {MOOD_OPTIONS.map((m) => {
                  const isActive = m === activeMood;

                  return (
                    <button
                      key={m}
                      onClick={() => setActiveMood(m)}
                      className={[
                        "rounded-full px-3 py-1.5 text-xs transition",
                        isActive
                          ? "border border-blush-300 bg-white text-warm-800 shadow-sm"
                          : "border border-blush-200 bg-white/60 text-warm-600",
                      ].join(" ")}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* No Filter Results */}

            {!hasFilteredResults && (
              <section className="mx-auto mb-4 max-w-2xl rounded-[28px] border border-white/50 bg-white/35 px-6 py-10 text-center backdrop-blur-xl">
                <h3 className="text-base font-medium text-warm-800">
                  No droplets here yet
                </h3>
                <p className="mt-2 text-sm text-warm-600">
                  When you feel this way, it can rest here.
                </p>
              </section>
            )}

            {/* List View */}

            {hasFilteredResults && (
              <section className="mx-auto max-w-2xl">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-medium text-warm-700">
                      Revisit gently
                    </h2>
                    <p className="mt-1 text-xs italic text-warm-500">
                      A quieter way to return to what you’ve released.
                    </p>
                  </div>

                  <div className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-warm-400">
                    Saved privately
                  </div>
                </div>

                <div className="space-y-2">
                  {filtered.map((e) => (
                    <motion.button
                      key={e.id}
                      type="button"
                      onClick={() => setActiveId(e.id)}
                      className={`w-full rounded-[20px] border border-white/60 bg-gradient-to-br ${moodTint(
                        e.mood
                      )} px-4 py-3 text-left shadow-[0_8px_30px_rgba(120,90,80,0.06)] transition hover:scale-[1.01]`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                    >
                      <div className="mb-2 flex items-start justify-between gap-4">
                        <div className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-warm-600">
                          {normalizeMoodLabel(e.mood)}
                        </div>

                        <div className="shrink-0 text-xs text-warm-500">
                          {formatLong(e.createdAt)}
                        </div>
                      </div>

                      <div className="line-clamp-2 text-sm leading-relaxed text-warm-800">
                        {getPreviewText(e)}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
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
              className="w-full max-w-md rounded-[28px] border border-blush-200 bg-white/75 px-6 py-6"
              initial={{ scale: 0.96, y: 8, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 8, opacity: 0 }}
            >
              <div className="mb-4 text-[11px] uppercase tracking-widest text-warm-500">
                {normalizeMoodLabel(active.mood)}
              </div>

              {active.type === "text" && (
                <div className="rounded-xl border border-blush-200 bg-white/65 p-4 text-sm leading-relaxed text-warm-800">
                  {active.content}
                </div>
              )}

              {active.type === "voice" && audioUrl && (
                <div className="rounded-xl border border-blush-200 bg-white/65 p-4">
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    controls
                    className="w-full"
                  />
                </div>
              )}

              <div className="mt-6 flex gap-2">
                <button
                  onClick={onDelete}
                  className="flex-1 rounded-full border border-blush-200 bg-white/65 px-4 py-2 text-xs text-rose-700 transition hover:bg-white"
                >
                  Delete
                </button>
              </div>

              <button
                onClick={closeOverlay}
                className="mt-3 w-full rounded-full border border-blush-200 bg-white/65 px-4 py-2 text-xs text-warm-700 transition hover:bg-white"
              >
                Back to your droplets
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}