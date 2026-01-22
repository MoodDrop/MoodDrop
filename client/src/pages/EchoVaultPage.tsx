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
  patchEchoLocal,
  type EchoItem,
  base64ToBlob,
} from "@/lib/EchoVaultLocal";

/* ----------------------- positioning ----------------------- */

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

function generatePositions(
  ids: string[],
  seedKey: string,
  minDist = 16
): Record<string, Pos> {
  const rand = seedRng(seedKey);
  const placed: { x: number; y: number }[] = [];
  const out: Record<string, Pos> = {};

  const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.hypot(a.x - b.x, a.y - b.y);

  const pick = () => ({
    x: 8 + rand() * 84, // 8..92
    y: 12 + rand() * 76, // 12..88
  });

  for (const id of ids) {
    let p = pick();
    let tries = 0;
    while (tries < 300 && placed.some((q) => dist(q, p) < minDist)) {
      p = pick();
      tries++;
    }
    placed.push(p);
    out[id] = { x: p.x, y: p.y, dur: 6 + rand() * 3, delay: rand() * 3 };
  }
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

type VaultView = "pond" | "tucked";
type LastAction =
  | { kind: "tuck"; id: string; prevTuckedAt?: number | undefined }
  | { kind: "delete"; id: string; prevTuckedAt?: number | undefined };

const UNDO_MS = 6000;

export default function EchoVaultPage() {
  const [, setLocation] = useLocation();

  const [view, setView] = useState<VaultView>("pond");
  const [echoes, setEchoes] = useState<EchoItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [activeAudioUrl, setActiveAudioUrl] = useState<string | null>(null);
  const createdAudioUrlRef = useRef(false); // ✅ only revoke URLs we created
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [toast, setToast] = useState<{ message: string; action: LastAction } | null>(
    null
  );
  const toastTimerRef = useRef<number | null>(null);
  const finalizeTimerRef = useRef<number | null>(null);

  const refresh = () => {
    purgeExpiredDeletesLocal(UNDO_MS);
    setEchoes(readEchoesLocal());
  };

  useEffect(() => {
    refresh();
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const active = useMemo(
    () => (activeId ? echoes.find((e) => e.id === activeId) : null),
    [activeId, echoes]
  );

  const pondEchoes = useMemo(
    () => echoes.filter((e) => !e.deletedAt && !e.tuckedAt),
    [echoes]
  );

  const tuckedEchoes = useMemo(
    () => echoes.filter((e) => !e.deletedAt && !!e.tuckedAt),
    [echoes]
  );

  const positions = useMemo(() => {
    const ids = pondEchoes.map((e) => e.id);
    return generatePositions(ids, "vault-v4", 16);
  }, [pondEchoes]);

  /* ---------- audio rebuild for overlay ---------- */
  useEffect(() => {
    // ✅ Clean up previous URL ONLY if we created it
    if (activeAudioUrl && createdAudioUrlRef.current) {
      URL.revokeObjectURL(activeAudioUrl);
    }
    setActiveAudioUrl(null);
    createdAudioUrlRef.current = false;

    if (!active || active.type !== "voice") return;

    // ✅ Preferred: audioBase64 -> Blob URL (we create it)
    if (active.audioBase64) {
      const blob = base64ToBlob(active.audioBase64, active.audioMime || "audio/webm");
      const url = URL.createObjectURL(blob);
      createdAudioUrlRef.current = true;
      setActiveAudioUrl(url);
      return;
    }

    // ✅ Legacy: use stored blob: URL as-is (do NOT revoke)
    if (active.audioUrl) {
      createdAudioUrlRef.current = false;
      setActiveAudioUrl(active.audioUrl);
    }
  }, [activeId]); // only when opening a different echo

  useEffect(() => {
    if (active?.type !== "voice") return;
    if (!audioRef.current) return;

    try {
      audioRef.current.currentTime = 0;
      void audioRef.current.play();
    } catch {
      // autoplay may be blocked; user can press play
    }
  }, [activeAudioUrl, active?.type]);

  /* ---------- toast helpers (global undo) ---------- */
  const clearTimers = () => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    if (finalizeTimerRef.current) window.clearTimeout(finalizeTimerRef.current);
    toastTimerRef.current = null;
    finalizeTimerRef.current = null;
  };

  const showUndoToast = (message: string, action: LastAction, finalize?: () => void) => {
    clearTimers();
    setToast({ message, action });

    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, UNDO_MS) as unknown as number;

    if (finalize) {
      finalizeTimerRef.current = window.setTimeout(() => {
        finalize();
        finalizeTimerRef.current = null;
      }, UNDO_MS) as unknown as number;
    }
  };

  const undoLast = () => {
    if (!toast) return;
    const { action } = toast;

    audioRef.current?.pause();

    if (action.kind === "tuck") {
      // restore previous tucked state
      if (action.prevTuckedAt) tuckEchoLocal(action.id);
      else returnEchoLocal(action.id);
    } else if (action.kind === "delete") {
      // ✅ undo soft delete cleanly
      patchEchoLocal(action.id, {
        deletedAt: undefined,
        tuckedAt: action.prevTuckedAt, // restore tuck if it was tucked
      });
    }

    clearTimers();
    setToast(null);
    refresh();
  };

  /* ---------- actions ---------- */
  const clearAll = () => {
    const ok = window.confirm("Clear all echoes from this device?");
    if (!ok) return;
    clearEchoesLocal();
    setActiveId(null);
    setToast(null);
    clearTimers();
    refresh();
  };

  const onTuckAway = () => {
    if (!active) return;

    const prevTuckedAt = active.tuckedAt;
    tuckEchoLocal(active.id);

    setActiveId(null);
    refresh();

    showUndoToast("Echo tucked away.", { kind: "tuck", id: active.id, prevTuckedAt });
  };

  const onReturnToPond = () => {
    if (!active) return;

    const prevTuckedAt = active.tuckedAt;
    returnEchoLocal(active.id);

    setActiveId(null);
    refresh();

    // Undo should re-tuck it
    showUndoToast("Echo returned to the pond.", {
      kind: "tuck",
      id: active.id,
      prevTuckedAt,
    });
  };

  const onDelete = () => {
    if (!active) return;

    const ok = window.confirm("Delete this echo?");
    if (!ok) return;

    audioRef.current?.pause();

    const prevTuckedAt = active.tuckedAt;
    softDeleteEchoLocal(active.id);

    setActiveId(null);
    refresh();

    showUndoToast(
      "Echo deleted.",
      { kind: "delete", id: active.id, prevTuckedAt },
      () => {
        const current = readEchoesLocal().find((e) => e.id === active.id);
        if (current?.deletedAt) {
          finalizeDeleteEchoLocal(active.id);
          refresh();
        }
      }
    );
  };

  const closeOverlay = () => setActiveId(null);

  /* ----------------------- render ----------------------- */

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Still pond atmosphere */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 22%, rgba(255,240,235,0.94), rgba(252,232,225,0.72), rgba(249,244,240,0.98))",
        }}
      />
      <div className="pointer-events-none absolute inset-0 mooddrop-grain opacity-20" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(255,255,255,0), rgba(0,0,0,0.040))",
        }}
      />

      <section className="relative mx-auto flex min-h-screen max-w-md flex-col px-6 pb-10 pt-10">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setLocation("/")}
            className="h-10 w-10 rounded-full"
            style={{
              background: "rgba(255,255,255,0.50)",
              border: "1px solid rgba(210,160,170,0.18)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
            aria-label="Back"
          >
            <span style={{ color: "rgba(35,28,28,0.72)" }}>←</span>
          </button>

          <div className="text-center">
            <h1
              className="text-[30px] italic leading-none"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "rgba(35,28,28,0.88)",
              }}
            >
              {view === "pond" ? "Your Echoes" : "Tucked Away"}
            </h1>
            <p className="mt-2 text-[12.5px] italic" style={{ color: "rgba(35,28,28,0.52)" }}>
              {view === "pond"
                ? "Drift through what you’ve released."
                : "Held gently, out of sight."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setView(view === "pond" ? "tucked" : "pond")}
              className="rounded-full px-3 py-2 text-[10px] uppercase"
              style={{
                letterSpacing: "0.22em",
                background: "rgba(255,255,255,0.40)",
                border: "1px solid rgba(210,160,170,0.14)",
                color: "rgba(35,28,28,0.54)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
              title="Toggle tucked away"
            >
              {view === "pond" ? "Tucked" : "Pond"}
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="rounded-full px-3 py-2 text-[10px] uppercase"
              style={{
                letterSpacing: "0.22em",
                background: "rgba(255,255,255,0.40)",
                border: "1px solid rgba(210,160,170,0.14)",
                color: "rgba(35,28,28,0.54)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
              title="Clear vault"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Content */}
        {view === "pond" ? (
          <div className="relative mt-10 h-[62vh] w-full">
            {pondEchoes.map((e, idx) => {
              const p = positions[e.id] || { x: 50, y: 50, dur: 6.5, delay: 0 };
              const dateLabel = formatShort(e.createdAt);

              return (
                <motion.div
                  key={e.id}
                  className="absolute"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  animate={{ x: [0, 8, 0, -6, 0], y: [0, -10, 0, 8, 0] }}
                  transition={{
                    duration: p.dur + (idx % 3) * 0.35,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: p.delay,
                  }}
                >
                  <div
                    className={e.type === "voice" ? "scale-[1.12]" : "scale-100"}
                    style={{ transformOrigin: "center" }}
                  >
                    <HaloRippleEmber
                      type={e.type}
                      dateLabel={dateLabel}
                      onClick={() => setActiveId(e.id)}
                    />
                  </div>
                </motion.div>
              );
            })}

            {pondEchoes.length === 0 && (
              <div
                className="mt-10 rounded-3xl px-6 py-8 text-center"
                style={{
                  background: "rgba(255,255,255,0.46)",
                  border: "1px solid rgba(210,160,170,0.16)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  boxShadow: "0 18px 44px rgba(210,160,170,0.12)",
                }}
              >
                <div
                  className="text-[18px] italic"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "rgba(35,28,28,0.82)",
                  }}
                >
                  The pond is still.
                </div>
                <p className="mt-2 text-[12px] italic" style={{ color: "rgba(35,28,28,0.52)" }}>
                  Release something, and it will begin to glow here.
                </p>

                <button
                  type="button"
                  onClick={() => setLocation("/release/text")}
                  className="mt-6 w-full rounded-3xl px-6 py-4 text-[12px] uppercase"
                  style={{
                    letterSpacing: "0.28em",
                    background: "rgba(255,255,255,0.64)",
                    border: "1px solid rgba(210,160,170,0.18)",
                    color: "rgba(35,28,28,0.74)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    boxShadow: "0 18px 44px rgba(210,160,170,0.14)",
                  }}
                >
                  Release something
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-10 space-y-3">
            {tuckedEchoes.length === 0 ? (
              <div
                className="rounded-3xl px-6 py-8 text-center"
                style={{
                  background: "rgba(255,255,255,0.46)",
                  border: "1px solid rgba(210,160,170,0.16)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  boxShadow: "0 18px 44px rgba(210,160,170,0.12)",
                }}
              >
                <div
                  className="text-[18px] italic"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "rgba(35,28,28,0.82)",
                  }}
                >
                  Nothing tucked away.
                </div>
                <p className="mt-2 text-[12px] italic" style={{ color: "rgba(35,28,28,0.52)" }}>
                  When you tuck an echo away, it rests here.
                </p>
              </div>
            ) : (
              tuckedEchoes.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setActiveId(e.id)}
                  className="w-full rounded-3xl px-5 py-4 text-left"
                  style={{
                    background: "rgba(255,255,255,0.46)",
                    border: "1px solid rgba(210,160,170,0.14)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div
                        className="text-[11px] uppercase"
                        style={{ letterSpacing: "0.22em", color: "rgba(35,28,28,0.58)" }}
                      >
                        {e.type === "voice" ? "Listen" : "Read"} • {e.mood || "Mood"} •{" "}
                        {formatShort(e.createdAt)}
                      </div>
                      <div
                        className="mt-2 text-[14px] italic"
                        style={{
                          color: "rgba(35,28,28,0.70)",
                          fontFamily: "'Playfair Display', serif",
                        }}
                      >
                        {e.content || (e.type === "voice" ? "Voice echo" : "Text echo")}
                      </div>
                    </div>

                    <div className="text-[11px] italic" style={{ color: "rgba(35,28,28,0.52)" }}>
                      Tap
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* Bottom whisper */}
        <div className="mt-auto pt-8 text-center">
          <p
            className="text-[11px] italic"
            style={{ color: "rgba(35,28,28,0.45)", fontFamily: "'Playfair Display', serif" }}
          >
            Tap a light to remember.
          </p>
        </div>
      </section>

      {/* Overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: "rgba(255,255,255,0.10)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.96, y: 8, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 8, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full max-w-md rounded-[28px] px-6 py-7"
              style={{
                background: "rgba(255,255,255,0.62)",
                border: "1px solid rgba(210,160,170,0.18)",
                boxShadow: "0 24px 80px rgba(210,160,170,0.18)",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div
                    className="text-[11px] uppercase"
                    style={{ letterSpacing: "0.26em", color: "rgba(35,28,28,0.58)" }}
                  >
                    {active.type === "voice" ? "Voice Echo" : "Text Echo"} • {active.mood}
                  </div>

                  <div className="mt-2">
                    <div
                      className="text-[22px] italic"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: "rgba(35,28,28,0.84)",
                      }}
                    >
                      {active.type === "voice" ? "Listening…" : "Reading…"}
                    </div>
                    <div className="mt-1 text-[12px] italic" style={{ color: "rgba(35,28,28,0.50)" }}>
                      {new Date(active.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Buttons: Tuck away, Delete, Back */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={active.tuckedAt ? onReturnToPond : onTuckAway}
                    className="rounded-full px-4 py-2 text-[10px] uppercase"
                    style={{
                      letterSpacing: "0.22em",
                      background: "rgba(255,255,255,0.55)",
                      border: "1px solid rgba(210,160,170,0.16)",
                      color: "rgba(35,28,28,0.58)",
                    }}
                  >
                    {active.tuckedAt ? "Return to pond" : "Tuck away"}
                  </button>

                  <button
                    type="button"
                    onClick={onDelete}
                    className="rounded-full px-4 py-2 text-[10px] uppercase"
                    style={{
                      letterSpacing: "0.22em",
                      background: "rgba(255,255,255,0.55)",
                      border: "1px solid rgba(210,160,170,0.16)",
                      color: "rgba(120, 60, 70, 0.68)",
                    }}
                  >
                    Delete
                  </button>

                  <button
                    type="button"
                    onClick={closeOverlay}
                    className="rounded-full px-4 py-2 text-[10px] uppercase"
                    style={{
                      letterSpacing: "0.22em",
                      background: "rgba(255,255,255,0.55)",
                      border: "1px solid rgba(210,160,170,0.16)",
                      color: "rgba(35,28,28,0.58)",
                    }}
                  >
                    Back to stillness
                  </button>
                </div>
              </div>

              {active.type === "text" && (
                <div
                  className="mt-6 rounded-2xl px-5 py-4 text-[14px] leading-relaxed"
                  style={{
                    background: "rgba(255,255,255,0.50)",
                    border: "1px solid rgba(210,160,170,0.12)",
                    color: "rgba(35,28,28,0.76)",
                  }}
                >
                  {active.content}
                </div>
              )}

              {active.type === "voice" && (
                <div className="mt-6">
                  <div className="relative mx-auto flex h-56 w-56 items-center justify-center">
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      animate={{ scale: [1, 1.55], opacity: [0.26, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                      style={{ border: "1px solid rgba(210,160,170,0.22)" }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      animate={{ scale: [1, 2.1], opacity: [0.18, 0] }}
                      transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
                      style={{ border: "1px solid rgba(210,160,170,0.18)" }}
                    />
                    <div
                      className="h-40 w-40 rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), rgba(245,215,220,0.18), rgba(255,255,255,0.05))",
                        border: "1px solid rgba(210,160,170,0.22)",
                        boxShadow: "0 22px 70px rgba(210,160,170,0.20)",
                      }}
                    />
                  </div>

                  {activeAudioUrl ? (
                    <div className="mt-4">
                      <audio ref={audioRef} src={activeAudioUrl} controls className="w-full" preload="metadata" />
                      <p className="mt-2 text-[11px] italic" style={{ color: "rgba(35,28,28,0.50)" }}>
                        If autoplay doesn’t start, press play gently.
                      </p>
                    </div>
                  ) : (
                    <div
                      className="mt-4 rounded-2xl px-5 py-4 text-center text-[12px] italic"
                      style={{
                        background: "rgba(255,255,255,0.50)",
                        border: "1px solid rgba(210,160,170,0.12)",
                        color: "rgba(35,28,28,0.60)",
                      }}
                    >
                      This echo was saved before audio persistence was added.
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 text-center">
                <p
                  className="text-[11px] italic"
                  style={{ color: "rgba(35,28,28,0.45)", fontFamily: "'Playfair Display', serif" }}
                >
                  Nothing here needs to be fixed.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle Undo Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed bottom-5 left-1/2 z-[60] w-[min(420px,calc(100%-2rem))]"
            style={{ transform: "translateX(-50%)" }}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div
              className="flex items-center justify-between gap-3 rounded-full px-4 py-3"
              style={{
                background: "rgba(255,255,255,0.62)",
                border: "1px solid rgba(210,160,170,0.16)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                boxShadow: "0 18px 50px rgba(210,160,170,0.18)",
              }}
            >
              <div
                className="text-[12px] italic"
                style={{ color: "rgba(35,28,28,0.68)", fontFamily: "'Playfair Display', serif" }}
              >
                {toast.message}
              </div>

              <button
                type="button"
                onClick={undoLast}
                className="rounded-full px-3 py-2 text-[10px] uppercase"
                style={{
                  letterSpacing: "0.22em",
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(210,160,170,0.16)",
                  color: "rgba(35,28,28,0.62)",
                }}
              >
                Undo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
