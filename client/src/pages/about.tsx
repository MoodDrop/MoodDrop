import React from "react";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="mx-auto w-full max-w-lg px-6 py-10 text-gray-700">
      <h1 className="mb-6 text-center text-2xl font-semibold text-gray-900">
        About MoodDrop
      </h1>

      <p className="mb-4">
        MoodDrop was created with one simple intention — to give you a safe,
        comforting space to release what’s on your mind and reconnect with your
        peace.
      </p>

      <p className="mb-4">
        It started as an idea born from real moments — the days I felt heavy, the
        nights when my thoughts wouldn’t quiet down, and the times I just needed
        somewhere to breathe. MoodDrop was designed to be that space — a gentle
        corner of the internet where you can place your thoughts, express your
        emotions without judgment, and then step away when you’re ready.
      </p>

      <p className="mb-4">
        While it may look like journaling, MoodDrop isn’t about analyzing your
        thoughts or finding the right words. It’s about release — putting
        something down so you don’t have to keep carrying it.
      </p>

      <p className="mb-6">
        Every feature — from writing reflections to exploring affirmations and
        calming content — was built to support that release and help you realign
        with yourself at your own pace. Whether you’re expressing gratitude,
        easing anxiety, or simply dropping off the weight of your day, MoodDrop
        is here for those quiet, in-between moments we all experience.
      </p>

      {/* 🌱 Soft guidance block */}
      <div className="rounded-xl border border-blush-200 bg-white/60 p-5 text-center">
        <p className="text-sm font-medium text-gray-800">
          Type it or voice it — release it, and walk away.
        </p>

        <p className="mt-2 text-xs text-muted-foreground">
          MoodDrop isn’t about fixing your thoughts or doing this “the right
          way.” It’s a space to place what you’re carrying, without pressure or
          judgment.
        </p>

        <div className="mt-6 flex justify-center">
          <Link href="/drop-it">
            <button
              className="rounded-full border border-blush-200 bg-white/70 px-6 py-2 text-sm font-medium text-gray-700 transition hover:bg-white hover:border-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-200"
              type="button"
            >
              Drop It
            </button>
          </Link>
        </div>
      </div>

      <p className="mt-8 text-right font-medium text-gray-800">~ Charae 💕</p>
    </div>
  );
}
