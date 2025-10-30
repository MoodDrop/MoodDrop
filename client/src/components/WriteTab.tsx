"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import { moods, type MoodKey } from "@/lib/moods";
import { getAffirmation } from "@/lib/affirmations";

interface WriteTabProps {
  selectedMood: MoodKey | null;
  onResetMood: () => void;
  draftText: string;
  onTextChange: (text: string) => void;
}

export default function WriteTab({
  selectedMood,
  onResetMood,
  draftText,
  onTextChange,
}: WriteTabProps) {
  const [showAffirmation, setShowAffirmation] = React.useState(false);
  const [affirmation, setAffirmation] = React.useState("");
  const [isClicked, setIsClicked] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const mood = selectedMood ? (moods as any)[selectedMood] : null;

  const handleAffirmation = () => {
    const quote = getAffirmation();
    setAffirmation(quote);
    setShowAffirmation(true);
    timerRef.current = setTimeout(() => setShowAffirmation(false), 5000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftText.trim()) return;

    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600); // pulse animation duration

    const STORAGE_KEY = "mooddrop_messages";
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const newDrop = {
      id: Date.now(),
      content: draftText.trim(),
      emotion: selectedMood || "Unknown",
      moodColor: mood?.color,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newDrop, ...existing]));
    onTextChange("");
    handleAffirmation();
  };

  return (
    <div className="space-y-4">
      {/* Mood summary with color + reset */}
      <div className="rounded-2xl border border-blush-100 bg-white/80 p-4 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span
            className="h-9 w-9 rounded-full ring-1 ring-black/5"
            style={{
              backgroundColor:
                (mood?.color as string) ||
                (mood?.bgColor as string) ||
                (mood?.hex as string) ||
                "#A3A3A3",
            }}
            aria-hidden
          />
          <div>
            <div className="text-warm-gray-900 font-medium">
              {selectedMood
                ? String(selectedMood).charAt(0).toUpperCase() +
                  String(selectedMood).slice(1)
                : "Select a mood"}
            </div>
            <div className="text-sm text-warm-gray-600">
              {mood?.meaning || "Stable, reflective, grateful."}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onResetMood}
          className="inline-flex items-center text-sm text-warm-gray-600 hover:text-warm-gray-800"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </button>
      </div>

      {/* Input box and Drop It */}
      <form onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          value={draftText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Drop your thoughts here..."
          rows={5}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-warm-gray-400"
        />

        {/* Always enabled Drop It button with pulse */}
        <button
          type="submit"
          className={`mt-3 w-full rounded-xl py-3 text-white font-medium transition transform active:scale-[0.98]
            ${
              isClicked
                ? "bg-[#E6C3B2] animate-[pulseGlow_0.6s_ease-in-out]"
                : "bg-[#E6C3B2] hover:bg-[#dcb2a0]"
            }`}
        >
          Drop It
        </button>

        {/* reassurance line */}
        <p className="mt-2 text-xs text-warm-gray-500 text-center">
          Your words stay on your device — private, safe, and yours.
        </p>
      </form>

      {/* affirmation popup */}
      {showAffirmation && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-amber-900 text-sm text-center">
          {affirmation}
        </div>
      )}

      {/* View My Drops */}
      <div className="mt-3 flex justify-center">
        <a
          href="/my-drops"
          className="inline-flex items-center gap-2 rounded-2xl border border-blush-100 bg-cream-50 px-4 py-2 text-warm-gray-800 shadow-sm hover:bg-cream-100 transition"
        >
          <span className="text-sky-500">💧</span>
          <span className="font-medium">View My Drops</span>
        </a>
      </div>

      {/* pulse animation keyframes */}
      <style>{`
        @keyframes pulseGlow {
          0% {
            box-shadow: 0 0 0 0 rgba(230, 195, 178, 0.6);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(230, 195, 178, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(230, 195, 178, 0);
          }
        }
      `}</style>
    </div>
  );
}

  



