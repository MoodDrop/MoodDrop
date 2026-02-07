// client/src/pages/ReleaseVoicePage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { saveVoiceEchoLocal } from "@/lib/EchoVaultLocal";
import HeldOverlay from "@/components/HeldOverlay";

const VOICE_MAX_MS = 120_000; // 2 minutes
const HELD_MS = 2600;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;

    const onChange = () => setReduced(mq.matches);
    onChange();

    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  return reduced;
}

function pickMimeType() {
  if (typeof MediaRecorder === "undefined") return "";
  if (MediaRecorder.isTypeSupported("audio/webm")) return "audio/webm";
  if (MediaRecorder.isTypeSupported("audio/ogg")) return "audio/ogg";
  return "";
}

function formatMs(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${String(ss).padStart(2, "0")}`;
}

const MOODS = ["Joy", "Calm", "Grounded", "Tense", "Overwhelmed", "Crash Out"] as const;

export default function ReleaseVoicePage() {
  const [, setLocation] = useLocation();
  const reducedMotion = usePrefersReducedMotion();

  const [mood, setMood] = useState<(typeof MOODS)[number]>("Calm");
  const [note, setNote] = useState("");

  const [permissionError, setPermissionError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  // Preview playback (blob URL)
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // ✅ Keep audio as Blob for saving (your “audioBlob” version)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const [audioMime, setAudioMime] = useState<string>("audio/webm");
  const [audioDurationMs, setAudioDurationMs] = useState<number>(0);

  const [showCopy, setShowCopy] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // Held overlay
  const [showHeld, setShowHeld] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef<number>(0);

  const tickTimerRef = useRef<number | null>(null);
  const hardLimitTimerRef = useRef<number | null>(null);

  // Track whether we “released” (saved + navigated)
  const didReleaseRef = useRef(false);

  const headline = useMemo(() => "Say it out loud.", []);
  const subline = useMemo(() => "You can keep it messy. The pond will hold it.", []);

  useEffect(() => {
    const t1 = window.setTimeout(() => setShowCopy(true), 200);
    const t2 = window.setTimeout(() => setShowActions(true), 900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  const stopAllTracks = () => {
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
  };

  useEffect(() => {
    return () => {
      // If we didn’t release it, cleanup preview blob URL.
      if (!didReleaseRef.current && previewUrl) URL.revokeObjectURL(previewUrl);

      stopAllTracks();
      if (tickTimerRef.current) window.clearInterval(tickTimerRef.current);
      if (hardLimitTimerRef.current) window.clearTimeout(hardLimitTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isRecording) return;

    const tick = () => {
      const now = Date.now();
      setElapsedMs(now - startedAtRef.current);
    };

    tick();
    const id = window.setInterval(tick, 250);
    tickTimerRef.current = id as unknown as number;

    return () => window.clearInterval(id);
  }, [isRecording]);

  const requestMic = async () => {
    try {
      setPermissionError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      return stream;
    } catch (e) {
      setPermissionError(
        "Microphone access was denied. You can still use Text Release, or allow mic access to record."
      );
      throw e;
    }
  };

  const resetAudio = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setAudioBlob(null);
    setAudioDurationMs(0);
  };

  const startRecording = async () => {
    resetAudio();

    const stream = mediaStreamRef.current ?? (await requestMic());
    const mime = pickMimeType();
    setAudioMime(mime || "audio/webm");

    const mr = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    chunksRef.current = [];

    mr.ondataavailable = (evt) => {
      if (evt.data && evt.data.size > 0) chunksRef.current.push(evt.data);
    };

    mr.onstop = () => {
      try {
        const blob = new Blob(chunksRef.current, {
          type: mr.mimeType || mime || "audio/webm",
        });

        // Preview URL
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);

        // ✅ Save Blob for Echo Vault
        setAudioBlob(blob);

        setIsRecording(false);

        const dur = Math.max(0, elapsedMs);
        setAudioDurationMs(dur);

        if (tickTimerRef.current) window.clearInterval(tickTimerRef.current);
        if (hardLimitTimerRef.current) window.clearTimeout(hardLimitTimerRef.current);
        stopAllTracks();
      } catch (err) {
        console.error("[ReleaseVoicePage] Failed to finalize recording:", err);
        setPermissionError("Something went wrong saving your recording. Please try again.");
        setIsRecording(false);
        stopAllTracks();
      }
    };

    mr.start(250);
    mediaRecorderRef.current = mr;

    startedAtRef.current = Date.now();
    setElapsedMs(0);
    setIsRecording(true);

    hardLimitTimerRef.current = window.setTimeout(() => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    }, VOICE_MAX_MS) as unknown as number;
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const discardTake = () => {
    resetAudio();
  };

  const canRelease = !!audioBlob && !isRecording;

  const onRelease = async () => {
    if (!canRelease || !audioBlob) return;

    // Mark as released BEFORE navigation
    didReleaseRef.current = true;

    // ✅ Save to Echo Vault (Blob -> base64 happens inside saveVoiceEchoLocal)
    await saveVoiceEchoLocal({
      mood,
      content: note.trim() ? note.trim() : "Voice echo",
      audioBlob,
      audioMime,
      audioDurationMs,
    });

    // ✅ Held moment (auto-fade) then go to Echo Vault
    setShowHeld(true);
    window.setTimeout(() => {
      setShowHeld(false);
      setLocation("/vault");
    }, HELD_MS);
  };

  const goBack = () => setLocation("/");

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 20% 15%, rgba(255, 240, 235, 0.95), rgba(252, 232, 225, 0.72), rgba(249, 244, 240, 0.98))",
      }}
    >
      <div className="pointer-events-none absolute inset-0 mooddrop-grain opacity-20" />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, rgba(255,255,255,0.0), rgba(0,0,0,0.035))",
        }}
      />

      <section className="relative mx-auto flex min-h-screen max-w-md flex-col px-6 pb-12 pt-10">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            className="h-10 w-10 rounded-full"
            style={{
              background: "rgba(255,255,255,0.50)",
              border: "1px solid rgba(210,160,170,0.18)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
            aria-label="Back"
            title="Back"
          >
            <span style={{ color: "rgba(35,28,28,0.72)" }}>←</span>
          </button>

          <div className="text-center">
            <div
              className="text-[11px] uppercase"
              style={{ letterSpacing: "0.28em", color: "rgba(35,28,28,0.48)" }}
            >
              Voice Release
            </div>
          </div>

          <div className="w-10" />
        </div>

        <div className="mt-10 text-center">
          <h1
            className="text-[30px] italic leading-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "rgba(35,28,28,0.88)",
              opacity: showCopy ? 1 : 0,
              transition: "opacity 900ms ease",
            }}
          >
            {headline}
          </h1>

          <p
            className="mt-3 text-[14px] italic"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "rgba(35,28,28,0.55)",
              opacity: showCopy ? 1 : 0,
              transition: "opacity 900ms ease",
            }}
          >
            {subline}
          </p>
        </div>

        {/* Mood + note */}
        <div
          className="mt-10 rounded-3xl px-5 py-5"
          style={{
            background: "rgba(255,255,255,0.46)",
            border: "1px solid rgba(210,160,170,0.16)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 18px 44px rgba(210,160,170,0.12)",
            opacity: showActions ? 1 : 0,
            transition: "opacity 700ms ease",
          }}
        >
          <div
            className="text-[11px] uppercase"
            style={{ letterSpacing: "0.22em", color: "rgba(35,28,28,0.58)" }}
          >
            Choose a mood
          </div>

          {/* ✅ Updated pill styling (matches your Write it out page) */}
          <div className="mt-3 flex flex-wrap gap-2">
            {MOODS.map((m) => {
              const active = m === mood;

              const pillStyle: React.CSSProperties = {
                background: active ? "rgba(255,255,255,0.74)" : "rgba(255,255,255,0.34)",
                border: active
                  ? "1px solid rgba(210,160,170,0.46)"
                  : "1px solid rgba(210,160,170,0.16)",
                color: active ? "rgba(35,28,28,0.82)" : "rgba(35,28,28,0.60)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                boxShadow: active
                  ? "0 12px 28px rgba(210,160,170,0.20), 0 0 0 1px rgba(255,255,255,0.28) inset"
                  : "none",
                transform: active ? "scale(1.02)" : "scale(1)",
                transition:
                  "transform 200ms ease, box-shadow 250ms ease, background 250ms ease, border-color 250ms ease, color 250ms ease",
              };

              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className="rounded-full px-4 py-2 text-[12px] focus:outline-none focus-visible:ring-2"
                  style={pillStyle}
                  aria-pressed={active}
                >
                  {m}
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <div
              className="text-[11px] uppercase"
              style={{ letterSpacing: "0.22em", color: "rgba(35,28,28,0.52)" }}
            >
              Optional note
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="A title, a feeling, a small context…"
              className="mt-2 w-full rounded-2xl px-4 py-3 text-[14px] leading-relaxed outline-none"
              style={{
                background: "rgba(255,255,255,0.46)",
                border: "1px solid rgba(210,160,170,0.14)",
                color: "rgba(35,28,28,0.72)",
              }}
            />
          </div>
        </div>

        {/* Recorder */}
        <div
          className="mt-6 rounded-3xl px-5 py-6"
          style={{
            background: "rgba(255,255,255,0.46)",
            border: "1px solid rgba(210,160,170,0.16)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 18px 44px rgba(210,160,170,0.10)",
            opacity: showActions ? 1 : 0,
            transition: "opacity 700ms ease",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div
                className="text-[11px] uppercase"
                style={{ letterSpacing: "0.22em", color: "rgba(35,28,28,0.58)" }}
              >
                Recording
              </div>
              <div
                className="mt-1 text-[14px] italic"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "rgba(35,28,28,0.62)",
                }}
              >
                {isRecording ? "Hold the moment." : previewUrl ? "A take is ready." : "Whenever you’re ready."}
              </div>
            </div>

            <div className="text-[12px] tabular-nums" style={{ color: "rgba(35,28,28,0.55)" }}>
              {isRecording ? formatMs(elapsedMs) : audioDurationMs ? formatMs(audioDurationMs) : "0:00"}
            </div>
          </div>

          {permissionError && (
            <div
              className="mt-3 rounded-2xl px-4 py-3 text-[12px]"
              style={{
                background: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(210,160,170,0.14)",
                color: "rgba(110, 64, 72, 0.75)",
              }}
            >
              {permissionError}
            </div>
          )}

          <div className="relative mx-auto mt-6 flex h-52 w-52 items-center justify-center">
            {!reducedMotion && (
              <div
                className="absolute inset-0 rounded-full"
                style={{ border: "1px solid rgba(210,160,170,0.18)" }}
              />
            )}

            <div
              className="h-40 w-40 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.38), rgba(245,215,220,0.20), rgba(255,255,255,0.06))",
                border: "1px solid rgba(210,160,170,0.22)",
                boxShadow: "0 22px 70px rgba(210,160,170,0.18)",
              }}
            />
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="w-full rounded-3xl px-6 py-4 text-[12px] uppercase"
                style={{
                  letterSpacing: "0.28em",
                  background: "rgba(255,255,255,0.70)",
                  border: "1px solid rgba(210,160,170,0.18)",
                  color: "rgba(35,28,28,0.74)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  boxShadow: "0 18px 44px rgba(210,160,170,0.14)",
                }}
              >
                Begin
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="w-full rounded-3xl px-6 py-4 text-[12px] uppercase"
                style={{
                  letterSpacing: "0.28em",
                  background: "rgba(255,255,255,0.56)",
                  border: "1px solid rgba(210,160,170,0.18)",
                  color: "rgba(35,28,28,0.68)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                Finish
              </button>
            )}

            {previewUrl && !isRecording && (
              <div
                className="rounded-3xl px-5 py-4"
                style={{
                  background: "rgba(255,255,255,0.46)",
                  border: "1px solid rgba(210,160,170,0.14)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <audio src={previewUrl} controls className="w-full" preload="auto" />

                <div className="mt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={discardTake}
                    className="flex-1 rounded-2xl px-4 py-3 text-[11px] uppercase"
                    style={{
                      letterSpacing: "0.22em",
                      background: "rgba(255,255,255,0.50)",
                      border: "1px solid rgba(210,160,170,0.14)",
                      color: "rgba(35,28,28,0.58)",
                    }}
                  >
                    Discard
                  </button>

                  <button
                    type="button"
                    onClick={onRelease}
                    disabled={!canRelease}
                    className="flex-1 rounded-2xl px-4 py-3 text-[11px] uppercase disabled:opacity-60"
                    style={{
                      letterSpacing: "0.22em",
                      background: "rgba(255,255,255,0.68)",
                      border: "1px solid rgba(210,160,170,0.18)",
                      color: "rgba(35,28,28,0.70)",
                      boxShadow: "0 18px 44px rgba(210,160,170,0.14)",
                    }}
                  >
                    Release
                  </button>
                </div>
              </div>
            )}

            <p
              className="pt-1 text-center text-[11px] italic"
              style={{
                color: "rgba(35,28,28,0.46)",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              It is held gently.
            </p>
          </div>
        </div>
      </section>

      {/* ✅ Held auto-fade overlay */}
      <HeldOverlay show={showHeld} />
    </main>
  );
}
