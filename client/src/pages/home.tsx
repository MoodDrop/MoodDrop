import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Sparkles } from "lucide-react";
import dropletIcon from "../assets/droplet.png";


import { moods, type MoodKey } from "@/lib/moods";

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);
  const [hoveredMood, setHoveredMood] = useState<MoodKey | null>(null);
  const [, setLocation] = useLocation();

  const handleMoodSelect = (moodKey: MoodKey) => {
    setSelectedMood(moodKey);
  };

  const handleDropIt = () => {
    if (selectedMood) {
      // Store selected mood in localStorage for DropItPage
      localStorage.setItem("mooddrop_selected_mood", selectedMood);
      setLocation("/drop-it");
    }
  };

  return (
    <div className="mb-8 max-w-xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <img
          src={dropletIcon}
          alt="MoodDrop Logo"
          className="w-32 h-32 mx-auto mb-6 shadow-sm"
        />

        <h2 className="text-2xl font-semibold text-warm-gray-700 mb-3">
          Welcome to MoodDrop
        </h2>
        
        <p className="text-center text-gray-600 max-w-xl mx-auto mt-3 px-4 leading-relaxed sm:text-base text-sm">
  A calm corner made for you — let it all out through words or voice, unwind with soothing moments, 
  and connect with others in The Collective Corner. 
  Totally private, totally you.
</p>



      </div>

      {/* Mood Selector */}
      <div className="text-center mb-6">
        <p className="text-sm text-warm-gray-600 mb-4">
          Choose your mood to begin…
        </p>

        {/* Mood Circles */}
        <div className="flex justify-center items-center gap-3 mb-3">
          {Object.entries(moods).map(([key, mood]) => (
            <button
              key={key}
              onClick={() => handleMoodSelect(key as MoodKey)}
              onMouseEnter={() => setHoveredMood(key as MoodKey)}
              onMouseLeave={() => setHoveredMood(null)}
              className={`w-8 h-8 rounded-full transition-all duration-200 ${
                selectedMood === key
                  ? "ring-2 ring-offset-2 ring-warm-gray-400 scale-110"
                  : "hover:scale-110"
              }`}
              style={{
                backgroundColor: mood.color,
              }}
              aria-label={`${mood.key}: ${mood.meaning}`}
              title={`${mood.key}: ${mood.meaning}`}
              data-testid={`mood-circle-${key.toLowerCase()}`}
            />
          ))}
        </div>

        {/* Tooltip - Show on hover or selection */}
        {(hoveredMood || selectedMood) && (
          <div className="mb-6 text-sm text-warm-gray-600 animate-in fade-in duration-200">
            <span className="font-medium">
              {moods[hoveredMood || selectedMood!].key}
            </span>
            {" · "}
            <span>
              {moods[hoveredMood || selectedMood!].meaning}
            </span>
          </div>
        )}

        {/* Drop It Button */}
        {selectedMood && (
          <div className="mt-6 mb-6 animate-in fade-in slide-in-from-top-4 duration-200">
            <button
              onClick={handleDropIt}
              className="w-full max-w-md mx-auto px-8 py-3.5 bg-[#F6C1B4] hover:bg-[#f0b5a5] text-warm-gray-900 rounded-2xl font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
              data-testid="button-drop-it"
            >
              <span className="text-lg">💧</span>
              <span>Drop It</span>
            </button>
            <p className="mt-2 text-center text-sm text-warm-gray-500">
              Let it out — this space is just for you.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Links */}
      <div className="flex items-center justify-center gap-4 text-sm text-warm-gray-600">
        <Link 
          href="/calm-studio"
          className="inline-flex items-center gap-1 hover:text-blush-400 transition-colors"
          data-testid="link-calm-studio"
        >
          <Sparkles className="w-4 h-4" />
          <span>Open Calm Studio</span>
        </Link>
        <span className="text-warm-gray-400">|</span>
        <Link 
          href="/my-drops"
          className="inline-flex items-center gap-1 hover:text-blush-400 transition-colors"
          data-testid="link-my-drops"
        >
          <img src={dropletIcon} alt="" className="w-4 h-4" />
          <span>View My Drops</span>
        </Link>
      </div>
    </div>
  );
}
