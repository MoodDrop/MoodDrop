// client/src/pages/CalmStudioPage.tsx

import React from "react";
import { useLocation } from "wouter";

export default function CalmStudioPage() {
  const [, navigate] = useLocation();

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#FFF9F5_0%,#FFF3EE_35%,#F8E0D9_100%)] px-4 py-8 text-[#7f5148]">
      <style>{`
        @keyframes softPulse {
          0%, 100% {
            opacity: .55;
            transform: scale(1);
          }

          50% {
            opacity: 1;
            transform: scale(1.12);
          }
        }
      `}</style>

      <section className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10 flex min-h-[180px] flex-col items-center justify-center rounded-[2rem] border border-white/40 bg-white/35 px-6 py-8 text-center shadow-sm backdrop-blur-md">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#b98b80]">
            MoodDrop
          </p>

          <h1 className="mt-4 font-serif text-5xl text-[#7f5148]">
            Calm Studio
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#9b6c63]">
            A quieter space to settle, breathe, listen, or gently play when
            your mind needs somewhere soft to land.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Take a Breath */}
          <button
            type="button"
            onClick={() => navigate("/comfort/breath")}
            className="group overflow-hidden rounded-[2rem] border border-white/45 bg-white/35 text-left shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/50 hover:shadow-md"
          >
            <div className="relative h-32 overflow-hidden bg-[radial-gradient(circle_at_center,#FFE8DD_0%,#F7C6B8_35%,#E9B7AB_65%,#E5D4CD_100%)]">
              {/* Orb */}
              <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 blur-[2px]" />

              <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 animate-pulse" />

              <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#FFF6F2_0%,#F5C5B6_60%,#E9B4A7_100%)] shadow-[0_0_30px_rgba(255,245,240,0.8)]" />
            </div>

            <div className="p-5">
              <h2 className="text-xl font-semibold text-[#7f5148]">
                Take a Breath
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#9b6c63]">
                Pause for a moment and let your breathing soften.
              </p>
            </div>
          </button>

          {/* Soothing Sounds */}
          <button
            type="button"
            className="group overflow-hidden rounded-[2rem] border border-white/45 bg-white/35 text-left shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/50 hover:shadow-md"
          >
            <div className="relative h-32 overflow-hidden bg-[linear-gradient(135deg,#F4DED8_0%,#E8D3D9_50%,#D7C6D8_100%)]">
              {/* Sound Waves */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="space-y-3">
                  <div className="h-[3px] w-28 rounded-full bg-white/70 animate-pulse" />

                  <div className="h-[3px] w-20 rounded-full bg-white/50 animate-pulse delay-150" />

                  <div className="h-[3px] w-32 rounded-full bg-white/70 animate-pulse delay-300" />
                </div>
              </div>
            </div>

            <div className="p-5">
              <h2 className="text-xl font-semibold text-[#7f5148]">
  Soothing Sounds
</h2>

<p className="mt-1 text-xs italic text-[#b98b80]">
  On the way
</p>

<p className="mt-3 text-sm leading-6 text-[#9b6c63]">
  Let the room soften around you.
</p>
            </div>
          </button>

          {/* Soft Visuals */}
          <button
            type="button"
            className="group overflow-hidden rounded-[2rem] border border-white/45 bg-white/35 text-left shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/50 hover:shadow-md"
          >
            <div className="relative h-32 overflow-hidden bg-[linear-gradient(135deg,#FFF4EE_0%,#F2E1D9_50%,#E9D8D2_100%)]">
              {/* Floating haze */}
              <div className="absolute left-10 top-8 h-20 w-20 rounded-full bg-white/30 blur-2xl" />

              <div className="absolute bottom-4 right-10 h-16 w-16 rounded-full bg-[#F7D7CB]/40 blur-2xl" />
            </div>

            <div className="p-5">
              <h2 className="text-xl font-semibold text-[#7f5148]">
  Soft Visuals
</h2>

<p className="mt-1 text-xs italic text-[#b98b80]">
  On the way
</p>

<p className="mt-3 text-sm leading-6 text-[#9b6c63]">
  Gentle moments for when your mind needs less noise.
</p>
            </div>
          </button>

          {/* Gentle Play */}
          <button
            type="button"
            onClick={() => navigate("/comfort/play")}
            className="group overflow-hidden rounded-[2rem] border border-white/45 bg-white/35 text-left shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/50 hover:shadow-md"
          >
            <div className="relative h-32 overflow-hidden bg-[radial-gradient(circle_at_30%_20%,rgba(255,223,150,.55),transparent_20%),linear-gradient(135deg,#332C59_0%,#4C3F78_55%,#6D557D_100%)]">
              {[18, 42, 64, 82].map((left, index) => (
                <span
                  key={left}
                  className="absolute rounded-full"
                  style={{
                    left: `${left}%`,
                    top: `${28 + index * 11}%`,
                    width: `${10 + index * 3}px`,
                    height: `${10 + index * 3}px`,
                    background:
                      "radial-gradient(circle, rgba(255,244,190,1), rgba(255,213,128,.35), transparent 72%)",
                    boxShadow:
                      "0 0 18px rgba(255,223,140,.7), 0 0 34px rgba(255,223,140,.3)",
                    animation:
                      "softPulse 3.2s ease-in-out infinite",
                    animationDelay: `${index * 0.45}s`,
                  }}
                />
              ))}
            </div>

            <div className="p-5">
              <h2 className="text-xl font-semibold text-[#7f5148]">
                Gentle Play
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#9b6c63]">
                Quiet interactions for restless moments.
              </p>
            </div>
          </button>
        </div>
      </section>
    </main>
  );
}