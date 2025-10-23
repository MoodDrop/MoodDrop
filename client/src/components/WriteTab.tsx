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
      // Save locally for now
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
      <form onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          value={draftText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Drop your thoughts here..."
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-warm-gray-400"
          rows={5}
        />
        <div className="flex justify-between items-center mt-2">
          <button
            type="button"
            onClick={onResetMood}
            className="inline-flex items-center text-sm text-warm-gray-500 hover:text-warm-gray-700"
          >
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-warm-gray-700 text-white text-sm rounded-md hover:bg-warm-gray-800 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Drop It"}
          </button>
        </div>
      </form>

           {showAffirmation && (
        <div className="text-center text-sm text-warm-gray-600 italic mt-3">
          {affirmation}
        </div>
      )}

      {/* View My Drops button (anchor styled as a button) */}
      <div className="mt-4 text-center">
        <a
          href="/my-drops"
          role="button"
          className="
            inline-flex items-center justify-center
            rounded-md border border-warm-gray-200
            bg-white/70 text-warm-gray-700
            px-3 py-2 text-sm
            hover:bg-white hover:shadow-md hover:-translate-y-0.5
            transition-transform duration-200
            sm:px-4 sm:py-2.5 sm:text-base
          "
        >
          View My Drops
        </a>
      </div>
    </div>
  );
}



