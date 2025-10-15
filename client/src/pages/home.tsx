import { useState } from "react";
import { Link } from "wouter";
import dropletIcon from "@assets/Droplet_1760186315979.png";
import MoodSelector from "@/components/MoodSelector";
import MoodComposer from "@/components/MoodComposer";
import type { MoodKey } from "@/lib/moods";

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);
  const [draftText, setDraftText] = useState("");

  const handleResetMood = () => {
    setSelectedMood(null);
  };

  const handleClearText = () => {
    setDraftText("");
  };

  return (
    <div className="mb-8">
      <div className="text-center mb-8">
        <img
          src={dropletIcon}
          alt="MoodDrop Logo"
          className="w-32 h-32 mx-auto mb-6 shadow-sm"
        />

        <h2 className="text-2xl font-semibold text-warm-gray-700 mb-4">
          Welcome to MoodDrop
        </h2>
        <p className="text-warm-gray-600 leading-relaxed mb-8">
          A gentle space to release your thoughts, find calm, and grow through every mood.
        </p>
      </div>

      {/* Mood Selector */}
      {!selectedMood && (
        <MoodSelector 
          selectedMood={selectedMood} 
          onSelectMood={setSelectedMood}
        />
      )}

      {/* Mood Composer */}
      {selectedMood && (
        <MoodComposer
          selectedMood={selectedMood}
          onResetMood={handleResetMood}
          draftText={draftText}
          onTextChange={setDraftText}
          onClearText={handleClearText}
        />
      )}

      {/* Quick Access Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
        <Link href="/comfort">
          <button 
            className="bg-cream-200 hover:bg-cream-300 text-warm-gray-700 font-medium px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg"
            data-testid="button-comfort"
          >
            <span className="mr-2">🤗</span>
            Find Your Calm
          </button>
        </Link>
      </div>
    </div>
  );
}
