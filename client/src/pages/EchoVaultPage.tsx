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

/* ----------------------- positioning helpers ----------------------- */

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

function generatePositions(ids: string[], seedKey: string, minDist = 16) {
  const rand = seedRng(seedKey);
  const placed: { x: number; y: number }[] = [];
  const out: Record<string, Pos> = {};

  const dist = (a: any, b: any) => Math.hypot(a.x - b.x, a.y - b.y);

  const pick = () => ({
    x: 8 + rand() * 84,
    y: 12 + rand() * 76,
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
  | { kind: "tuck"; id: string; prevTuckedAt?: number }
  | { kind: "delete"; id: string; prevTuckedAt?: number };

const UNDO_MS = 6000;

export default function EchoVaultPage() {
  const [, setLocation] = useLocation();

  const [view, setView] = useState<VaultView>("pond");
  const [echoes, setEchoes] = useState<EchoItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [activeAudioUrl, setActiveAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [toast, setToast] = useState<{ message: string; action: LastAction } | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const finalizeTimerRef = useRef<number | null>(null);

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
    () => (activeId ? echoes.find((e) => e.id === activeId) : null),
    [activeId, echoes]
  );

  const pondEchoes = useMemo(
    () => echoes.filter((e) => !e.deletedAt && !e.tuckedAt),
    [echoes]
  );

  const tuckedEchoes = useMemo(
    () => echoes.filter((e) => !e.deletedAt && e.tuckedAt),
    [echoes]
  );

  const positions = useMemo(
    () => generatePositions(pondEchoes.map((e) => e.id), "vault-v4", 16),
    [pondEchoes]
  );

  /* ----------------------- audio restore ----------------------- */

  useEffect(() => {
    if (activeAudioUrl) URL.revokeObjectURL(activeAudioUrl);
    setActiveAudioUrl(null);

    if (!active || active.type !== "voice") return;

    if (active.audioBase64) {
      const blob = base64ToBlob(active.audioBase64, active.audioMime || "audio/webm");
      const url = URL.createObjectURL(blob);
      setActiveAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    if (active.audioUrl) setActiveAudioUrl(active.audioUrl);
  }, [activeId]);

  useEffect(() => {
    if (active?.type === "voice" && audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      } catch {}
    }
  }, [activeAudioUrl]);

  /* ----------------------- undo helpers ----------------------- */

  const clearTimers = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    if (finalizeTimerRef.current) clearTimeout(finalizeTimerRef.current);
  };

  const showUndoToast = (message: string, action: LastAction, finalize?: () => void) => {
    clearTimers();
    setToast({ message, action });

    toastTimerRef.current = window.setTimeout(() => setToast(null), UNDO_MS);

    if (finalize) {
      finalizeTimerRef.current = window.setTimeout(finalize, UNDO_MS);
    }
  };

  const undoLast = () => {
    if (!toast) return;
    const { action } = toast;

    if (action.kind === "tuck") {
      action.prevTuckedAt ? tuckEchoLocal(action.id) : returnEchoLocal(action.id);
    } else {
      const all = readEchoesLocal();
      const next = all.map((e) =>
        e.id === action.id
          ? { ...e, deletedAt: undefined, tuckedAt: action.prevTuckedAt }
          : e
      );
      localStorage.setItem("mooddrop_echo_vault_v1", JSON.stringify(next));
    }

    clearTimers();
    setToast(null);
    refresh();
  };

  /* ----------------------- actions ----------------------- */

  const onTuckAway = () => {
    if (!active) return;
    tuckEchoLocal(active.id);
    setActiveId(null);
    refresh();
    showUndoToast("Echo tucked away.", { kind: "tuck", id: active.id });
  };

  const onReturnToPond = () => {
    if (!active) return;
    returnEchoLocal(active.id);
    setActiveId(null);
    refresh();
    showUndoToast("Echo returned to the pond.", { kind: "tuck", id: active.id, prevTuckedAt: Date.now() });
  };

  const onDelete = () => {
    if (!active) return;
    softDeleteEchoLocal(active.id);
    setActiveId(null);
    refresh();
    showUndoToast(
      "Echo deleted.",
      { kind: "delete", id: active.id },
      () => finalizeDeleteEchoLocal(active.id)
    );
  };

  /* ----------------------- render ----------------------- */

  return (
    <main className="relative min-h-screen overflow-hidden">
      <section className="relative mx-auto flex min-h-screen max-w-md flex-col px-6 pb-10 pt-10">

        {/* Pond */}
        {view === "pond" && (
          <div className="relative mt-10 h-[62vh] w-full">
            {pondEchoes.map((e) => {
              const p = positions[e.id];
              return (
                <motion.div
                  key={e.id}
                  className="absolute"
                  style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)" }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: p.dur, repeat: Infinity }}
                >
                  <HaloRippleEmber type={e.type} onClick={() => setActiveId(e.id)} />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Overlay */}
        <AnimatePresence>
          {active && (
            <motion.div className="absolute inset-0 z-50 flex items-center justify-center px-6">
              <motion.div className="w-full max-w-md rounded-[28px] px-6 py-7 bg-white/70">

                {/* ✅ FIXED BUTTON GROUP */}
                <div className="flex flex-wrap items-center justify-end gap-2 max-w-[220px] sm:max-w-none">
                  <button onClick={active.tuckedAt ? onReturnToPond : onTuckAway}>
                    {active.tuckedAt ? "Return to pond" : "Tuck away"}
                  </button>
                  <button onClick={onDelete}>Delete</button>
                  <button className="w-full sm:w-auto" onClick={() => setActiveId(null)}>
                    Back to stillness
                  </button>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Undo toast */}
        <AnimatePresence>
          {toast && (
            <motion.div className="fixed bottom-5 left-1/2 -translate-x-1/2">
              <button onClick={undoLast}>Undo</button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
