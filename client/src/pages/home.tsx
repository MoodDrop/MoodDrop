// client/src/pages/home.tsx

import React from "react";
import { ShieldCheck, Mic, SunMedium } from "lucide-react";
import moodDropTextLogo from "@/assets/MoodDropText PNG.png";
import dropletIcon from "@/assets/droplet.png";

export default function HomePage() {
  const handleMoodClick = (mood: string) => {
    localStorage.setItem("mooddrop_selected_mood", mood);
    window.location.href = "/drop-it";
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <section className="mb-10 max-w-xl mx-auto text-center">
        <img
          src={moodDropTextLogo}
          alt="MoodDrop Logo"
          className="mx-auto mb-6 w-64 h-auto"
        />

        <p className="text-gray-600">
          A calm corner made for you — let it all out through words or voice,
          unwind with soothing moments, and connect with others in The
          Collective Corner. Totally private, totally you.
        </p>
      </section>

      {/* Benefits Row (no “Why MoodDrop” heading) */}
      <section className="mb-10 max-w-2xl mx-auto">
        <div className="grid gap-8 sm:grid-cols-3 text-center text-sm text-warm-gray-700">
          {/* Safe & Confidential */}
          <div className="flex flex-col items-center gap-2">
            <div className="mb-1 rounded-full bg-amber-50 px-3 py-3 shadow-sm">
              <ShieldCheck className="h-6 w-6 text-amber-500" />
            </div>
            <p className="font-semibold text-stone-800">Safe &amp; Confidential</p>
            <p className="text-xs text-warm-gray-500">
              Your drops stay private and protected.
            </p>
          </div>

          {/* Voice or Text Entries */}
          <div className="flex flex-col items-center gap-2">
            <div className="mb-1 rounded-full bg-amber-50 px-3 py-3 shadow-sm">
              <Mic className="h-6 w-6 text-amber-500" />
            </div>
            <p className="font-semibold text-stone-800">Voice or Text Entries</p>
            <p className="text-xs text-warm-gray-500">
              Speak or type — whatever feels easier.
            </p>
          </div>

          {/* Join The Collective */}
          <div className="flex flex-col items-center gap-2">
            <div className="mb-1 rounded-full bg-amber-50 px-3 py-3 shadow-sm">
              <SunMedium className="h-6 w-6 text-amber-500" />
            </div>
            <p className="font-semibold text-stone-800">Join The Collective</p>
            <p className="text-xs text-warm-gray-500">
              Share anonymously and feel less alone.
            </p>
          </div>
        </div>
      </section>

      {/* Mood Selector + Primary Actions */}
      <section className="mb-10 text-center">
        {/* Mood circles */}
        <p className="text-sm text-warm-gray-600 mb-4">
          Choose your mood to begin…
        </p>

        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {/* Calm */}
          <button
            onClick={() => handleMoodClick("Calm")}
            className="flex flex-col items-center gap-2 group"
          >
            <span className="h-14 w-14 rounded-full bg-[#F8EEDC] shadow-sm group-hover:scale-105 transition-transform" />
            <span className="text-xs font-medium text-stone-800">Calm</span>
          </button>

          {/* Joyful */}
          <button
            onClick={() => handleMoodClick("Joyful")}
            className="flex flex-col items-center gap-2 group"
          >
            <span className="h-14 w-14 rounded-full bg-[#FBD2A8] shadow-sm group-hover:scale-105 transition-transform" />
            <span className="text-xs font-medium text-stone-800">Joyful</span>
          </button>

          {/* CrashOut */}
          <button
            onClick={() => handleMoodClick("CrashOut")}
            className="flex flex-col items-center gap-2 group"
          >
            <span className="h-14 w-14 rounded-full bg-[#F0A25A] shadow-sm group-hover:scale-105 transition-transform" />
            <span className="text-xs font-medium text-stone-800">CrashOut</span>
          </button>

          {/* Tense */}
          <button
            onClick={() => handleMoodClick("Tense")}
            className="flex flex-col items-center gap-2 group"
          >
            <span className="h-14 w-14 rounded-full bg-[#FBEFB0] shadow-sm group-hover:scale-105 transition-transform" />
            <span className="text-xs font-medium text-stone-800">Tense</span>
          </button>

          {/* Overwhelmed */}
          <button
            onClick={() => handleMoodClick("Overwhelmed")}
            className="flex flex-col items-center gap-2 group"
          >
            <span className="h-14 w-14 rounded-full bg-[#E7B6A9] shadow-sm group-hover:scale-105 transition-transform" />
            <span className="text-xs font-medium text-stone-800">
              Overwhelmed
            </span>
          </button>
        </div>

        {/* DROP IT BUTTON — bigger, rounder, with droplet icon */}
        <a
          href="/drop-it"
          className="block mx-auto w-full max-w-md rounded-3xl bg-blush-300 hover:bg-blush-400 text-white py-5 shadow-md hover:shadow-lg transition-all"
        >
          <div className="flex items-center justify-center gap-3">
            <img src={dropletIcon} alt="droplet" className="w-7 h-7" />
            <span className="text-lg font-semibold">Drop It</span>
          </div>
        </a>

        {/* Spacer text */}
        <div className="mt-4 text-center text-xs text-warm-gray-500">
          Let it out — this space is just for you.
        </div>

        {/* View My Drops button */}
        <div className="mt-6 text-center">
          <a
            href="/my-drops"
            className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-5 py-3 shadow-sm hover:bg-rose-50 transition-colors"
          >
            <img src={dropletIcon} alt="" className="w-5 h-5" />
            <span className="text-sm font-medium">View My Drops</span>
          </a>
        </div>
        {/* ⬆️ No extra text block here anymore */}
      </section>

      
    </main>
  );
}

