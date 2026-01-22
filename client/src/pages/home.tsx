// client/src/pages/home.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Orb } from "../components/Orb";

// ✅ Wordmark (rename file to avoid spaces)
import moodDropText from "../assets/mooddrop-text.png";

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

export default function HomePage() {
  const [, setLocation] = useLocation();
  const reducedMotion = usePrefersReducedMotion();

  const [showChoices, setShowChoices] = useState(false);
  const [showSecondary, setShowSecondary] = useState(false);

  const secondaryLine = useMemo(() => {
    return "You don't have to figure it out right now.";
  }, []);

  useEffect(() => {
    const t1 = window.setTimeout(() => setShowSecondary(true), 350);
    const t2 = window.setTimeout(() => setShowChoices(true), 1650);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  const goText = () => setLocation("/release/text");
  const goVoice = () => setLocation("/release/voice");

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 20% 15%, rgba(255, 240, 235, 0.95), rgba(252, 232, 225, 0.72), rgba(249, 244, 240, 0.98))",
      }}
    >
      {/* Grain */}
      <div className="pointer-events-none absolute inset-0 mooddrop-grain" />

      {/* Soft vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, rgba(255,255,255,0.0), rgba(0,0,0,0.035))",
        }}
      />

      {/* ✅ Wordmark (subtle arrival) */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <img
          src={moodDropText}
          alt="MoodDrop"
          className="h-7 w-auto opacity-50"
          style={{
            filter: "drop-shadow(0 10px 22px rgba(210,160,170,0.18))",
          }}
        />
      </div>

      <section className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        {/* Orb */}
        <div className={reducedMotion ? "" : "mooddrop-breathe"}>
          <Orb className="h-40 w-40" />
        </div>

        {/* Copy */}
        <h1 className="mt-10 text-[26px] leading-tight tracking-wide text-[rgba(35,28,28,0.92)]">
          You’re here.
        </h1>

        <p
          className={[
            "mt-3 max-w-xs text-[15px] leading-relaxed",
            "text-[rgba(35,28,28,0.62)] transition-opacity duration-700",
            showSecondary ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          {secondaryLine}
        </p>

        {/* Choices */}
        <div
          className={[
            "mt-10 w-full max-w-xs transition-opacity duration-700",
            showChoices ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          <div className="flex flex-col items-center gap-5">
            <button
              type="button"
              onClick={goText}
              className="w-full rounded-2xl px-6 py-4 text-[16px] tracking-wide text-[rgba(35,28,28,0.86)] shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
              style={{
                background: "rgba(255,255,255,0.62)",
                border: "1px solid rgba(210, 160, 170, 0.18)",
                backdropFilter: "blur(10px)",
              }}
            >
              Write it out
            </button>

            <button
              type="button"
              onClick={goVoice}
              className="w-full rounded-2xl px-6 py-4 text-[16px] tracking-wide text-[rgba(35,28,28,0.86)] shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
              style={{
                background: "rgba(255,255,255,0.62)",
                border: "1px solid rgba(210, 160, 170, 0.18)",
                backdropFilter: "blur(10px)",
              }}
            >
              Say it out loud
            </button>

            <p className="pt-1 text-[13px] text-[rgba(35,28,28,0.48)] italic">
              Whenever you’re ready.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
