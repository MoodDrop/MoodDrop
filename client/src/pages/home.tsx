import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Orb } from "../components/Orb";

// Wordmark
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

  useEffect(() => {
    const t = window.setTimeout(() => setShowChoices(true), 900);
    return () => window.clearTimeout(t);
  }, []);

  const goText = () => setLocation("/release/text");
  const goVoice = () => setLocation("/release/voice");

  return (
    <main
      className="relative min-h-screen overflow-hidden font-sans"
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

      {/* Wordmark */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <img
          src={moodDropText}
          alt="MoodDrop"
          className="h-7 w-auto opacity-60"
          style={{
            filter: "drop-shadow(0 10px 22px rgba(210,160,170,0.18))",
          }}
        />
      </div>

      <section className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        {/* Orb */}
        <div className={`${reducedMotion ? "" : "mooddrop-breathe"} mt-6`}>
          <Orb className="h-40 w-40" />
        </div>

        {/* Primary Headline */}
        <h1 className="mt-10 text-[22px] leading-tight tracking-wide text-[rgba(35,28,28,0.9)]">
          A place to release, not perform.
        </h1>

        {/* Permission Whisper (Anchor-style) */}
        <p className="mt-2 text-[13px] italic text-[rgba(35,28,28,0.48)] select-none">
  Nothing is expected of you here.
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

            {/* Secondary Line */}
            <p className="pt-0.5 text-[13px] text-[rgba(35,28,28,0.48)] italic">
              Whenever you’re ready.
            </p>
          </div>
        </div>

        {/* Gentle Anchor */}
        <p className="mt-8 text-[13px] text-[rgba(35,28,28,0.48)] select-none">
          "Your words belong only to you. Always private, always yours."
        </p>
      </section>
    </main>
  );
}
