"use client";

import { useState, useRef, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { moods, type MoodKey } from "@lib/moods";
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
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [affirmation, setAffirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const affirmationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const mood = selectedMood ? moods[selectedMood] : null;

  useEffect(() => {
    return () => {
      if (affirmationTimerRef.current) clearTimeout(affirmationTimerRef.current);
    };
  }, []);

  const handleAffirmation = () => {
    const quote = getAffirmation();
    setAffirmation(quote);
    setShowAffirmation(true);
    affirmationTimerRef.current = setTimeout(() => setShowAffirmation(false), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftText.trim()) return;

    setIsSubmitting(true);
    try {
      const existingDrops = JSON.parse(localStorage.getItem("moodDrops") || "[]");
      const newDrop = {
        id: Date.now(),
        mood: selectedMood,
        text: draftText.trim(),
        date: new Date().toISOString(),
      };
      localStorage.setItem("moodDrops", JSON.stringify([newDrop, ...existingDrops]));

      onTextChange("");
      handleAffirmation();
    } catch (error) {
      console.error("Error saving drop:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mood Card */}
      {mood && (
        <div className="rounded-2xl border border-blush-100 bg-cream-50 p-4">
          <div className="flex items-center gap-3">
            <span
              className="h-9 w-9 rounded-full ring-2 ring-white"
              style={{ backgroundColor: mood.color }}
              aria-hidden
            />
            <div>
              <div className="font-medium text-warm-gray-900">{mood.label}</div>
              <div className="text-sm text-warm-gray-600">
                {mood.summary || mood.description}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          value={draftText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Let it all drop here — one mood at a time!"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-warm-gray-400"
          rows={5}
        />

        {/* Buttons Row */}
        <div className="flex justify-between items-center mt-2">
          {/* Reset Button */}
          <button
            type="button"
            onClick={onResetMood}
            className="inline-flex items-center text-sm text-warm-gray-500 hover:text-warm-gray-700"
          >
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </button>

          {/* Drop It Button */}
          <button
            type="submit"
            disabled={isSubmitting || !draftText.trim()}
            className={`px-4 py-2 rounded-md text-sm font-medium transition
              ${
                draftText.trim()
                  ? "bg-warm-gray-700 text-white hover:bg-warm-gray-800"
                  : "bg-warm-gray-200 text-warm-gray-500 cursor-not-allowed"
              }`}
          >
            {isSubmitting ? "Saving..." : "Drop It"}
          </button>
        </div>
      </form>

      {/* Privacy Line */}
      <p className="text-xs text-warm-gray-500 mt-2">
        Your words stay on your device — private, safe, and yours.
      </p>

      {/* View My Drops Button */}
      <div className="mt-4 flex justify-center">
        <a
          href="/my-drops"
          className="inline-flex items-center justify-center rounded-2xl border border-zinc-200
                     px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-white/90 hover:bg-gray-50 transition"
        >
          View My Drops
        </a>
      </div>

      {/* Affirmation */}
      {showAffirmation && (
        <div className="text-center text-sm text-warm-gray-600 italic mt-3">
          {affirmation}
        </div>
      )}
    </div>
  );
}


  



