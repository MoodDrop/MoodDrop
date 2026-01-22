// client/src/pages/ReleaseTextPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { saveTextEchoLocal } from "@/lib/EchoVaultLocal";
import HeldOverlay from "@/components/HeldOverlay";

const HELD_MS = 2600;

const MOODS = ["Joy", "Calm", "Grounded", "Tense", "Overwhelmed", "Crash Out"] as const;

export default function ReleaseTextPage() {
  const [, setLocation] = useLocation();

  const [mood, setMood] = useState<(typeof MOODS)[number]>("Calm");
  const [text, setText] = useState("");

  const [showCopy, setShowCopy] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const [showHeld, setShowHeld] = useState(false);

  const headline = useMemo(() => "Let it spill.", []);
  const subline = useMemo(() => "No performance. No replies. Just release.", []);

  useEffect(() => {
    const t1 = window.setTimeout(() => setShowCopy(true), 200);
    const t2 = window.setTimeout(() => setShowActions(true), 900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  const goBack = () => setLocation("/");

  const canRelease = text.trim().length >= 2;

  const onRelease = () => {
    if (!canRelease) return;

    saveTextEchoLocal({
      mood,
      content: text.trim(),
    });

    setShowHeld(true);

    window.setTimeout(() => {
      setShowHeld(false);
      setLocation("/vault");
    }, HELD_MS);
  };

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
              Text Release
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

          <div className="mt-3 flex flex-wrap gap-2">
            {MOODS.map((m) => {
              const selected = m === mood;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className="rounded-full px-4 py-2 text-[11px] uppercase"
                  style={{
                    letterSpacing: "0.20em",
                    background: selected ? "rgba(255,255,255,0.70)" : "rgba(255,255,255,0.44)",
                    border: selected
                      ? "1px solid rgba(210,160,170,0.28)"
                      : "1px solid rgba(210,160,170,0.14)",
                    color: selected ? "rgba(35,28,28,0.72)" : "rgba(35,28,28,0.55)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                  }}
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
              Your release
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              placeholder="Let it pour out here…"
              className="mt-2 w-full rounded-2xl px-4 py-4 text-[14px] leading-relaxed outline-none"
              style={{
                background: "rgba(255,255,255,0.46)",
                border: "1px solid rgba(210,160,170,0.14)",
                color: "rgba(35,28,28,0.72)",
              }}
            />

            <div className="mt-4">
              <button
                type="button"
                onClick={onRelease}
                disabled={!canRelease}
                className="w-full rounded-3xl px-6 py-4 text-[12px] uppercase disabled:opacity-60"
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
                Release
              </button>

              <p
                className="mt-3 text-center text-[11px] italic"
                style={{
                  color: "rgba(35,28,28,0.46)",
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Nothing here needs to be fixed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Held auto-fade overlay */}
      <HeldOverlay show={showHeld} />
    </main>
  );
}
