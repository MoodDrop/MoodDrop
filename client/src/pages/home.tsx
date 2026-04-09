import React from "react";
import { useLocation } from "wouter";
import moodDropText from "../assets/mooddrop-text.png";
import typeIcon from "../assets/icons/type.png";
import micIcon from "../assets/icons/mic.png";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(250,240,243,1) 0%, rgba(247,236,239,1) 45%, rgba(244,232,234,1) 100%)",
      }}
    >
      <style>{`
        @keyframes orbBreath {
          0%, 100% {
            transform: scale(1);
            opacity: 0.96;
          }
          50% {
            transform: scale(1.04);
            opacity: 1;
          }
        }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 18%, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0) 28%),
            radial-gradient(circle at 50% 34%, rgba(245,191,215,0.16) 0%, rgba(245,191,215,0.06) 22%, rgba(255,255,255,0) 52%)
          `,
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 18% 42%, rgba(255,255,255,0.75) 0px, rgba(255,255,255,0) 7px),
            radial-gradient(circle at 78% 68%, rgba(255,255,255,0.7) 0px, rgba(255,255,255,0) 9px),
            radial-gradient(circle at 70% 70%, rgba(255,255,255,0.45) 0px, rgba(255,255,255,0) 18px),
            radial-gradient(circle at 24% 74%, rgba(255,255,255,0.35) 0px, rgba(255,255,255,0) 14px)
          `,
        }}
      />

      <section className="relative mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-6 pb-16 pt-10 text-center">
        <img
          src={moodDropText}
          alt="MoodDrop"
          className="h-12 w-auto opacity-90"
          style={{
            filter: "drop-shadow(0 8px 20px rgba(216,170,184,0.18))",
          }}
        />

        <div className="relative mt-6 flex items-center justify-center sm:mt-8">
          <div
            className="absolute rounded-full"
            style={{
              width: "min(300px, 70vw)",
              height: "min(300px, 70vw)",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(246,205,220,0.10) 42%, rgba(255,255,255,0) 72%)",
              filter: "blur(18px)",
            }}
          />

          <div
            className="relative rounded-full"
            style={{
              width: "min(240px, 55vw)",
              height: "min(240px, 55vw)",
              animation: "orbBreath 6.5s ease-in-out infinite",
              background:
                "radial-gradient(circle at 38% 28%, rgba(255,255,255,0.88) 0%, rgba(252,233,243,0.98) 24%, rgba(244,196,221,0.94) 72%, rgba(235,171,207,0.96) 100%)",
              boxShadow:
                "0 24px 60px rgba(212, 160, 184, 0.20), inset 0 10px 30px rgba(255,255,255,0.30)",
            }}
          />
        </div>

        <h1
          className="mt-8 text-[28px] leading-tight text-[rgba(66,50,56,0.92)] sm:mt-12 sm:text-[34px]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          You can release it here
        </h1>

        <p className="mt-4 max-w-[620px] text-[16px] leading-[1.6] text-[rgba(99,79,87,0.72)] sm:mt-5 sm:text-[18px]">
          MoodDrop is a quiet space to release what you’re feeling — through
          words or voice, without pressure or judgment.
        </p>

        <div className="mt-10 flex w-full max-w-[540px] flex-col gap-5">
          <button
            type="button"
            onClick={() => setLocation("/release/text")}
            className="flex items-center justify-center rounded-full px-8 py-5 text-[18px] text-[rgba(79,62,68,0.94)] transition active:scale-[0.99]"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.78) 0%, rgba(255,244,248,0.72) 58%, rgba(246,214,228,0.44) 100%)",
              border: "1px solid rgba(255,255,255,0.72)",
              boxShadow:
                "0 18px 35px rgba(201,168,181,0.18), inset 0 1px 0 rgba(255,255,255,0.72)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center justify-center gap-4">
              <img
                src={typeIcon}
                alt="Type"
                className="h-12 w-12 object-contain opacity-90"
              />
              <span>Type it out</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setLocation("/release/voice")}
            className="flex items-center justify-center rounded-full px-8 py-5 text-[18px] text-[rgba(79,62,68,0.94)] transition active:scale-[0.99]"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.78) 0%, rgba(255,244,248,0.72) 58%, rgba(246,214,228,0.44) 100%)",
              border: "1px solid rgba(255,255,255,0.72)",
              boxShadow:
                "0 18px 35px rgba(201,168,181,0.18), inset 0 1px 0 rgba(255,255,255,0.72)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center justify-center gap-4">
              <img
                src={micIcon}
                alt="Voice"
                className="h-12 w-12 object-contain opacity-90"
              />
              <span>Voice it out</span>
            </div>
          </button>
        </div>

        <div className="mt-16 flex w-full max-w-[640px] items-center gap-5">
          <div className="h-px flex-1 bg-[rgba(170,140,150,0.18)]" />
          <p
            className="text-[18px] text-[rgba(79,62,68,0.9)]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Inside your space
          </p>
          <div className="h-px flex-1 bg-[rgba(170,140,150,0.18)]" />
        </div>

        <div className="mt-8 grid w-full grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setLocation("/my-droplets")}
            className="rounded-[28px] px-6 py-6 text-left transition hover:translate-y-[-1px]"
            style={{
              background: "rgba(255,255,255,0.48)",
              border: "1px solid rgba(255,255,255,0.58)",
              boxShadow:
                "0 12px 28px rgba(201,168,181,0.12), inset 0 1px 0 rgba(255,255,255,0.62)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              className="text-[18px] text-[rgba(77,61,68,0.95)]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              My Droplets
            </div>
            <div className="mt-2 text-[13px] italic text-[rgba(110,89,96,0.7)]">
              Your private space
            </div>
          </button>

          <button
            type="button"
            onClick={() => setLocation("/living-gallery")}
            className="rounded-[28px] px-6 py-6 text-left transition hover:translate-y-[-1px]"
            style={{
              background: "rgba(255,255,255,0.48)",
              border: "1px solid rgba(255,255,255,0.58)",
              boxShadow:
                "0 12px 28px rgba(201,168,181,0.12), inset 0 1px 0 rgba(255,255,255,0.62)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              className="text-[18px] text-[rgba(77,61,68,0.95)]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Gallery
            </div>
            <div className="mt-2 text-[13px] italic text-[rgba(110,89,96,0.7)]">
              Shared moments
            </div>
          </button>

          <button
            type="button"
            onClick={() => setLocation("/comfort")}
            className="rounded-[28px] px-6 py-6 text-left transition hover:translate-y-[-1px]"
            style={{
              background: "rgba(255,255,255,0.48)",
              border: "1px solid rgba(255,255,255,0.58)",
              boxShadow:
                "0 12px 28px rgba(201,168,181,0.12), inset 0 1px 0 rgba(255,255,255,0.62)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              className="text-[18px] text-[rgba(77,61,68,0.95)]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Rest
            </div>
            <div className="mt-2 text-[13px] italic text-[rgba(110,89,96,0.7)]">
              Pause & unwind
            </div>
          </button>

          <button
            type="button"
            onClick={() => setLocation("/soft-reads")}
            className="rounded-[28px] px-6 py-6 text-left transition hover:translate-y-[-1px]"
            style={{
              background: "rgba(255,255,255,0.48)",
              border: "1px solid rgba(255,255,255,0.58)",
              boxShadow:
                "0 12px 28px rgba(201,168,181,0.12), inset 0 1px 0 rgba(255,255,255,0.62)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              className="text-[18px] text-[rgba(77,61,68,0.95)]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Quiet Reads
            </div>
            <div className="mt-2 text-[13px] italic text-[rgba(110,89,96,0.7)]">
              Take a moment
            </div>
          </button>

          <button
            type="button"
            onClick={() => setLocation("/harmony")}
            className="col-span-2 rounded-[28px] px-6 py-6 text-left transition hover:translate-y-[-1px]"
            style={{
              background: "rgba(255,255,255,0.48)",
              border: "1px solid rgba(255,255,255,0.58)",
              boxShadow:
                "0 12px 28px rgba(201,168,181,0.12), inset 0 1px 0 rgba(255,255,255,0.62)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              className="text-[18px] text-[rgba(77,61,68,0.95)]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Harmony
            </div>
            <div className="mt-2 text-[13px] italic text-[rgba(110,89,96,0.7)]">
              A song shaped into a melody
            </div>
          </button>
        </div>

        <p className="mt-10 max-w-[420px] text-[14px] leading-7 text-[rgba(120,92,101,0.78)]">
          Your words belong only to you. Always private, always yours.
        </p>
      </section>
    </div>
  );
}