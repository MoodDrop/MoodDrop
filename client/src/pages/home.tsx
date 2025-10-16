import { useState } from "react";
import { Link } from "wouter";
import { PenLine, Mic } from "lucide-react";
import dropletIcon from "@assets/Droplet_1760186315979.png";
import { moods, type MoodKey } from "@/lib/moods";
import WriteTab from "@/components/WriteTab";
import VoiceTab from "@/components/VoiceTab";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"write" | "voice">("write");
  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);
  const [hoveredMood, setHoveredMood] = useState<MoodKey | null>(null);
  const [draftText, setDraftText] = useState("");

  const handleTabClick = (tab: "write" | "voice") => {
    setActiveTab(tab);
  };

  const handleMoodSelect = (moodKey: MoodKey) => {
    setSelectedMood(moodKey === selectedMood ? null : moodKey);
  };

  const handleResetMood = () => {
    setSelectedMood(null);
  };

  return (
    <div className="mb-8">
      {/* Hero Section */}
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

      {/* Mood Selector Row */}
      <div className="text-center mb-6">
        <p className="text-warm-gray-600 font-medium mb-2">
          What type of mood are you feeling today?
        </p>
        
        <p className="text-xs text-warm-gray-500 mb-4">
          No account needed — everything here is anonymous.
        </p>

        {/* Animated Hint Text - Only show when no mood is selected */}
        {!selectedMood && (
          <p className="text-sm text-zinc-500 mb-3 animate-pulse-gentle">
            ✨ Choose a mood to begin…
          </p>
        )}

        {/* Horizontal Mood Circles */}
        <div className="flex justify-center items-center gap-2 sm:gap-3 mb-2">
          {Object.entries(moods).map(([key, mood]) => (
            <button
              key={key}
              onClick={() => handleMoodSelect(key as MoodKey)}
              onMouseEnter={() => setHoveredMood(key as MoodKey)}
              onMouseLeave={() => setHoveredMood(null)}
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full transition-all duration-200 ${
                selectedMood === key
                  ? "ring-2 ring-offset-2 ring-warm-gray-400 scale-110"
                  : "hover:scale-110 animate-glow-pulse"
              }`}
              style={{
                backgroundColor: mood.color,
                '--glow-color': mood.color,
              } as React.CSSProperties}
              aria-label={`${mood.key}: ${mood.meaning}`}
              title={`${mood.key}: ${mood.meaning}`}
              data-testid={`mood-circle-${key.toLowerCase()}`}
            />
          ))}
        </div>

        {/* Tooltip - Show on hover or selection */}
        {(hoveredMood || selectedMood) && (
          <div className="mt-2 text-sm text-warm-gray-600 animate-in fade-in duration-200">
            <span className="font-medium">
              {moods[hoveredMood || selectedMood!].key}
            </span>
            {" · "}
            <span>
              {moods[hoveredMood || selectedMood!].meaning}
            </span>
          </div>
        )}
      </div>

      {/* Tabs - Only show when mood is selected */}
      {selectedMood && (
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <button
            onClick={() => handleTabClick("write")}
            className={`px-6 py-3 rounded-xl font-medium transition-all shadow-sm ${
              activeTab === "write"
                ? "bg-blush-300 text-white shadow-md"
                : "bg-cream-100 text-warm-gray-700 hover:bg-cream-200"
            }`}
            data-testid="tab-let-it-flow"
          >
            <PenLine className="inline-block mr-2" size={18} />
            Let It Flow
          </button>
          <button
            onClick={() => handleTabClick("voice")}
            className={`px-6 py-3 rounded-xl font-medium transition-all shadow-sm ${
              activeTab === "voice"
                ? "bg-blush-300 text-white shadow-md"
                : "bg-cream-100 text-warm-gray-700 hover:bg-cream-200"
            }`}
            data-testid="tab-take-a-moment"
          >
            <Mic className="inline-block mr-2" size={18} />
            Take a Moment
          </button>
        </div>
      )}

      {/* Tab Content - Only show when mood is selected */}
      {selectedMood && (
        <div 
          className="max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4 duration-200"
          aria-expanded={!!selectedMood}
        >
          {activeTab === "write" && (
            <WriteTab 
              selectedMood={selectedMood} 
              onResetMood={handleResetMood}
              draftText={draftText}
              onTextChange={setDraftText}
            />
          )}
          {activeTab === "voice" && (
            <VoiceTab 
              selectedMood={selectedMood}
              onResetMood={handleResetMood}
            />
          )}
        </div>
      )}

      {/* Quick Access Button */}
      <div className="flex justify-center mt-12">
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
