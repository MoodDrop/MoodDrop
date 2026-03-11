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
  const rand = seedRng(ids.join("|") || "vault");
  const out: Record<string, Pos> = {};

  ids.forEach((id) => {
    out[id] = {
      x: 10 + rand() * 80,
      y: 18 + rand() * 62,
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

function getEchoText(e: EchoItem) {
  if (e.type === "text") return e.content || "";
  return "voice echo";
}

function getUniqueMoods(echoes: EchoItem[]) {
  return Array.from(
    new Set(
      echoes
        .map((e) => e.mood)
        .filter((m): m is string => Boolean(m))
    )
  );
}

/* ---------- page ---------- */

const UNDO_MS = 6000;

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

  const moodOptions = useMemo(
    () => ["All", ...getUniqueMoods(visibleEchoes)],
    [visibleEchoes]
  );

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return visibleEchoes.filter((e) => {
      const moodMatch = activeMood === "All" ? true : e.mood === activeMood;

      const text = getEchoText(e).toLowerCase();
      const moodText = (e.mood || "").toLowerCase();

      const searchMatch = !q || text.includes(q) || moodText.includes(q);

      return moodMatch && searchMatch;
    });
  }, [visibleEchoes, activeMood, searchTerm]);

  const pondEchoes = useMemo(() => filtered.slice(0, 12), [filtered]);

  const positions = useMemo(
    () => generatePositions(pondEchoes.map((e) => e.id)),
    [pondEchoes]
  );

  /* ---------- audio ---------- */

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

  /* ---------- actions ---------- */

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
            <h1 className="text-[30px] italic font-serif text-warm-800">
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
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your echoes..."
            className="w-full rounded-xl border border-blush-200 bg-white/70 px-4 py-3 text-sm"
          />

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

        {/* Echo Pond */}

        <div className="relative h-[56vh] min-h-[420px]">
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
              initial={{ scale: 0.96, y: 8, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 8, opacity: 0 }}
            >
              <div className="mb-4 text-[11px] uppercase tracking-widest text-warm-500">
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