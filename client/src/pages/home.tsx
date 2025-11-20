// client/src/pages/home.tsx

import React from "react";
import moodDropTextLogo from "@/assets/MoodDropText PNG.png";
import dropletIcon from "@/assets/droplet.png";

export default function HomePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <section className="mb-10 max-w-xl mx-auto">
        <div className="text-center mb-6">
          <img
            src={moodDropTextLogo}
            alt="MoodDrop Logo"
            className="mx-auto mb-4 w-64 h-auto"
          />
        </div>

        <p className="text-center text-gray-600 max-w-xl mx-auto">
          A calm corner made for you — let it all out through words or voice,
          unwind with soothing moments, and connect with others in The
          Collective Corner. Totally private, totally you.
        </p>
      </section>

      {/* Mood Dots + Actions */}
      <section className="mb-10 text-center">
        <p className="text-sm text-warm-gray-600 mb-3">
          Choose your mood to begin…
        </p>

        {/* Mood dots – set mood + go to /drop-it */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => {
              localStorage.setItem("mooddrop_selected_mood", "Calm");
              window.location.href = "/drop-it";
            }}
            className="h-7 w-7 rounded-full bg-[#9EC5FF] hover:scale-110 transition"
          />
          <button
            onClick={() => {
              localStorage.setItem("mooddrop_selected_mood", "Tender");
              window.location.href = "/drop-it";
            }}
            className="h-7 w-7 rounded-full bg-[#A9E3C2] hover:scale-110 transition"
          />
          <button
            onClick={() => {
              localStorage.setItem("mooddrop_selected_mood", "Reflective");
              window.location.href = "/drop-it";
            }}
            className="h-7 w-7 rounded-full bg-[#FFE3A3] hover:scale-110 transition"
          />
          <button
            onClick={() => {
              localStorage.setItem("mooddrop_selected_mood", "Grounded");
              window.location.href = "/drop-it";
            }}
            className="h-7 w-7 rounded-full bg-[#FFCACF] hover:scale-110 transition"
          />
          <button
            onClick={() => {
              localStorage.setItem("mooddrop_selected_mood", "CrashOut");
              window.location.href = "/drop-it";
            }}
            className="h-7 w-7 rounded-full bg-[#E5C8FF] hover:scale-110 transition"
          />
        </div>

        {/* DROP IT BUTTON — bigger, rounder, bigger icon */}
        <a
          href="/drop-it"
          className="block mx-auto w-full max-w-md rounded-3xl bg-blush-300 hover:bg-blush-400 text-white py-5 shadow-md hover:shadow-lg transition-all"
        >
          <div className="flex items-center justify-center gap-3">
            <img
              src={dropletIcon}
              alt="Drop It"
              className="w-7 h-7"
            />
            <span className="text-lg font-semibold">Drop It</span>
          </div>
        </a>

        {/* Spacer text */}
        <div className="mt-6 text-center text-xs text-warm-gray-500">
          Let it out — this space is just for you.
        </div>

        {/* View My Drops only (Calm Studio removed) */}
        <div className="mt-6 text-center">
          <a
            href="/my-drops"
            className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-5 py-3 shadow-sm hover:bg-rose-50 transition-colors"
          >
            <img
              src={dropletIcon}
              alt=""
              className="w-5 h-5"
            />
            <span className="text-sm font-medium">View My Drops</span>
          </a>
        </div>
      </section>
    </main>
  );
}
