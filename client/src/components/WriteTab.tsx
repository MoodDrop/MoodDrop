"use client";

import { useState, useRef, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { moods, type MoodKey } from "@/lib/moods";
import { getAffirmation } from "@/lib/affirmations";
import Link from "next/link";

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
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [affirmation, setAffirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const affirmationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    return () => {
      if (affirmationTimerRef.current) clearTimeout(affirmationTimerRef.current);
    };
  }, []);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!draftText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const emotion = selectedMood ? moods[selectedMood].key : "Calm";

    // Save to localStorage so it feels personal but private
    try {
      const saved = JSON.parse(localStorage.getItem("mooddrop_messages") || "[]");
      saved.push({
        id: Date.now(),
        content: draftText.trim(),
        emotion,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("mooddrop_messages", JSON.stringify(saved));
    } catch {
      console.warn("LocalStorage unavailable, continuing anyway");
    }

    const encouragingMessage = getAffirmation(draftText.trim(), emotion);
    if (affirmationTimerRef.current) clearTimeout(affirmationTimerRef.current);
    setAffirmation(encouragingMessage);
    setShowAffirmation(true);
    onTextChange("");
    setIsSubmitting(false);

    affirmationTimerRef.current = setTimeout(() => {
      setShowAffirmation(false);
      setAffirmation("");
      affirmationTimerRef.current = null;
    }, 8000);
  };

  const mood = selectedMood ? moods[selectedMood] : null;

  return (
    <div className="animate-in fade-in duration-500">
      {mood && (
        <div className="flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-blush-50 to-cream-50 rounded-xl border border-blush-100">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
              style={{ backgroundColor: mood.color }}
            />
            <div>
              <p className="font-medium text-warm-gray-800">{mood.key}</p>
              <p className="text-sm text-warm-gray-600">{mood.meaning}</p>
            </div>
          </div>
          <button
            onClick={onResetMood}
            className="flex items-center gap-2 text-sm text-warm-gray-600 hover:text-warm-gray-800 transition"
            aria-label="Reset mood"
            type="button"
            data-testid="button-reset-mood"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      )}

      {/* Main form */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="write-textarea" className="sr-only">
          Write it out
        </label>
        <textarea
          id="write-textarea"
          ref={textareaRef}
          value={draftText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Let it all drop here — one mood at a time!"
          className="w-full rounded-2xl border border-zinc-200/70 bg-white/80 p-4 outline-none shadow-sm focus:ring-2 focus:ring-rose-200 min-h-[140px]"
        />

        <button
          type="submit"
          disabled={!draftText.trim() || isSubmitting}
          className="mt-3 w-full bg-blush-300 hover:bg-blush-400 disabled:bg-warm-gray-200 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
          data-testid="button-submit-write"
        >
          {isSubmitting ? "Dropping..." : "Drop It"}
        </button>
        {/* Secondary: View My Drops */}
<div className="mt-2">
  <Link
    href="/my-drops"
    className="inline-flex w-full items-center justify-center rounded-xl border border-blush-200 bg-white/90 py-3 text-warm-gray-800 shadow-sm transition hover:bg-cream-50"
  >
    View My Drops
  </Link>
</div>


        {showAffirmation && affirmation && (
          <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-800">
            {affirmation}
          </div>
        )}

        <p className="mt-2 text-xs text-zinc-400">
          Your words stay on your device — private, safe, and yours.
        </p>
      </form>
    </div>
  );
}

