// client/src/pages/EchoVaultPage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";
import HaloRippleEmber from "@/components/HaloRippleEmber";
import {
  clearEchoesLocal,
  readEchoesLocal,
  purgeExpiredDeletesLocal,
  tuckEchoLocal,
  returnEchoLocal,
  softDeleteEchoLocal,
  finalizeDeleteEchoLocal,
  type EchoItem,
  base64ToBlob,
} from "@/lib/EchoVaultLocal";

/* ----------------------- helpers ----------------------- */

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

type Pos = { x: number; y: number; dur: number; delay: number };

function generatePositions(ids: string[], seedKey: string): Record<string, Pos> {
  const rand = seedRng(seedKey);
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
  try {
    return new Date(ts).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

/* ----------------------- page ----------------------- */

const UNDO_MS = 6000;

export default function EchoVaultPage() {
  const [, setLocation] = useLocation();

  const [echoes, setEchoes] = useState<EchoItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; id: string } | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeAudioUrl, setActiveAudioUrl] = useState<string | null>(null);

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

  const pondEchoes = useMemo(
    () => echoes.filter((e) => !e.deletedAt && !e.tuckedAt),
    [echoes]
  );

  const positions = useMemo(
    () => generatePositions(pondEchoes.map((e) => e.id), "vault"),
    [pondEchoes]
  );

  /* ---------- audio rebuild ---------- */

  useEffect(() => {
    if (activeAudioUrl) {
      URL.revokeObjectURL(activeAudioUrl);
      setActiveAudioUrl(null);
    }

    if (!active || active.type !== "voice") return;

    if (active.audioBase64) {
      const blob = base64ToBlob(
        active.audioBase64,
        active.audioMime || "audio/webm"
      );
      const url = URL.createObjectURL(blob);
      setActiveAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [activeId]);

  /* ---------- actions ---------- */

  const closeOverlay = () => setActiveId(null);

  const onTuckAway = () => {
    if (!active) return;
    tuckEchoLocal(active.id);
    setToast({ message: "Echo tucked away.", id: active.id });
    setActiveId(null);
    refresh();
  };

  const onDelete = () => {
    if (!active) return;
    softDeleteEchoLocal(active.id);
    setToast({ message: "Echo deleted.", id: active.id });
    setActiveId(null);

    setTimeout(() => {
      finalizeDeleteEchoLocal(active.id);
      refresh();
    }, UNDO_MS);
  };

  /* ----------------------- render ----------------------- */

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#fff1ec] via-[#f9ece6] to-[#fff]" />

      <section className="relative mx-auto max-w-md px-6 pt-10 pb-10">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setLocation("/")}
            className="h-10 w-10 rounded-full bg-white/50 border border-blush-200"
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

        <div className="relative h-[62vh]">
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
      </section>

      {/* ---------- OVERLAY ---------- */}
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
              className="w-full max-w-md rounded-[28px] px-6 py-6 bg-white/70 border border-blush-200"
              initial={{ scale: 0.96, y: 8, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 8, opacity: 0 }}
            >
              <div className="mb-4">
                <div className="text-[11px] uppercase tracking-widest text-warm-500">
                  {active.type === "voice" ? "Voice Echo" : "Text Echo"} •{" "}
                  {active.mood}
                </div>

                <div className="mt-2 text-[22px] italic font-serif text-warm-800">
                  {active.type === "voice" ? "Listening…" : "Reading…"}
                </div>
              </div>

              {active.type === "text" && (
                <div className="rounded-2xl p-4 bg-white/60 border border-blush-200 text-warm-700">
                  {active.content}
                </div>
              )}

              {active.type === "voice" && activeAudioUrl && (
                <audio
                  ref={audioRef}
                  src={activeAudioUrl}
                  controls
                  className="w-full mt-4"
                />
              )}

              <div className="mt-6 flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={onTuckAway}
                    className="flex-1 rounded-full px-4 py-2 text-[10px] uppercase bg-white/60 border border-blush-200"
                  >
                    Tuck away
                  </button>

                  <button
                    onClick={onDelete}
                    className="flex-1 rounded-full px-4 py-2 text-[10px] uppercase bg-white/60 border border-blush-200 text-rose-700"
                  >
                    Delete
                  </button>
                </div>

                <button
                  onClick={closeOverlay}
                  className="rounded-full px-4 py-2 text-[10px] uppercase bg-white/60 border border-blush-200"
                >
                  Back to stillness
                </button>
              </div>

              <p className="mt-4 text-center text-[11px] italic text-warm-500 font-serif">
                Nothing here needs to be fixed.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
