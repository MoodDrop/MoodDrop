import React from "react";
import { Link } from "wouter";

export default function SoftReadsPage() {
  return (
    <div className="min-h-screen bg-[#070812] text-[#F7EFEA]">
      <div className="relative overflow-hidden px-5 py-10">
        {/* Atmosphere */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#7A5CFF]/25 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -left-24 h-72 w-72 rounded-full bg-[#C77DFF]/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#F4B7A8]/10 blur-3xl" />

        <main className="relative mx-auto max-w-5xl">
          {/* Hero */}
          <section className="mb-10 pt-6 text-center">
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Quiet Moments
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#D8CFEA]/75 md:text-base">
              A weekly reflection, a sound, and a small moment to sit with.
            </p>

            <p className="mt-3 text-xs text-[#D8CFEA]/50">
              Updated weekly. No rush here.
            </p>
          </section>

          {/* This Week */}
          <section className="mb-6 rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#B9A7FF]">
                  This Week’s Quiet
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  A softer place to land
                </h2>
              </div>

              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-[#F7EFEA]/70">
                Weekly
              </span>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-[#D8CFEA]/75">
              This space is being shaped into a quiet corner for reflection,
              sound, and stillness — something you can visit when the rest of
              the internet feels too loud.
            </p>
          </section>

          {/* Main Grid */}
          <section className="grid gap-5 md:grid-cols-2">
            {/* Reflection */}
            <Link href="/soft-reads/welcome">
              <a className="group block rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.09]">
                <p className="text-xs uppercase tracking-[0.25em] text-[#F4B7A8]">
                  Reflection of the Week
                </p>

                <h3 className="mt-4 text-xl font-semibold">
                  I Needed a Place That Didn’t Talk Back
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#D8CFEA]/70">
                  A founder note for the days you don’t want advice — you just
                  need somewhere to release.
                </p>

                <div className="mt-5 text-sm text-[#F4B7A8]">
                  Read quietly →
                </div>
              </a>
            </Link>

            {/* Listen */}
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.25em] text-[#B9A7FF]">
                Something to Listen To
              </p>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-[#171A33] via-[#251D3F] to-[#3A2032] text-sm text-[#D8CFEA]/60">
                  This space is being curated 
                </div>

                <h3 className="text-lg font-semibold">
                  
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#D8CFEA]/70">
                 
                </p>

                <button
                  type="button"
                  className="mt-5 rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm text-[#F7EFEA]/80"
                >
                  Coming soon
                </button>
              </div>
            </div>

            {/* Visual */}
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 backdrop-blur-xl md:col-span-2">
              <p className="text-xs uppercase tracking-[0.25em] text-[#B9A7FF]">
                A Quiet Visual
              </p>

              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                <div className="flex min-h-56 items-end bg-[radial-gradient(circle_at_30%_20%,rgba(185,167,255,0.35),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(244,183,168,0.18),transparent_35%),linear-gradient(135deg,#101225,#171A33,#080912)] p-5">
                  <div>
                    <h3 className="text-xl font-semibold">
                      Moonlight, rain, or candlelight
                    </h3>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#D8CFEA]/70">
                      This space is being curated
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Thought */}
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-6 text-center backdrop-blur-xl md:col-span-2">
              <p className="text-xs uppercase tracking-[0.25em] text-[#B9A7FF]">
                A Thought to Sit With
              </p>

              <p className="mx-auto mt-5 max-w-2xl text-xl leading-8 text-[#F7EFEA]">
                “You don’t have to solve tonight all at once.”
              </p>
            </div>
          </section>

          {/* Footer whisper */}
          <div className="mt-12 text-center text-sm italic text-[#D8CFEA]/50">
            Stay as long as you need. The internet can wait.
          </div>
        </main>
      </div>
    </div>
  );
}