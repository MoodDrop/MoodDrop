import { useState } from "react";
import { PlayCircle, Gamepad2, Lock, Music2 } from "lucide-react";
import relaxingIllustration from "@assets/relaxing-illustration.png";
import BubblePop from "./BubblePop";
import MemoryMatch from "./MemoryMatch";

type TabType = "videos" | "sounds" | "games";

export default function FindYourCalm() {
  const [activeTab, setActiveTab] = useState<TabType | null>(null);
  const [selectedGame, setSelectedGame] = useState<"bubble" | "memory" | null>(
    "bubble"
  );

  const handleTabClick = (tab: TabType) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  // ✅ Rename the tab label here (change anytime)
  const videoTabLabel = "Soft Visuals"; // was "Watch & Smile"

  return (
    <div className="mb-6">
      {/* Tab Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {/* Videos Tab (now clickable like Sounds) */}
        <button
          onClick={() => handleTabClick("videos")}
          className={`px-6 py-3 rounded-xl font-medium transition-all shadow-sm ${
            activeTab === "videos"
              ? "bg-blush-300 text-white shadow-md"
              : "bg-cream-100 text-warm-gray-700 hover:bg-cream-200"
          }`}
          data-testid="tab-watch-smile"
        >
          <PlayCircle className="inline-block mr-2" size={18} />
          {videoTabLabel}
        </button>

        {/* Soothing Sounds */}
        <button
          onClick={() => handleTabClick("sounds")}
          className={`px-6 py-3 rounded-xl font-medium transition-all shadow-sm ${
            activeTab === "sounds"
              ? "bg-blush-300 text-white shadow-md"
              : "bg-cream-100 text-warm-gray-700 hover:bg-cream-200"
          }`}
          data-testid="tab-sounds"
        >
          <Music2 className="inline-block mr-2" size={18} />
          Soothing Sounds
        </button>

        {/* Games */}
        <button
          onClick={() => handleTabClick("games")}
          className={`px-6 py-3 rounded-xl font-medium transition-all shadow-sm ${
            activeTab === "games"
              ? "bg-blush-300 text-white shadow-md"
              : "bg-cream-100 text-warm-gray-700 hover:bg-cream-200"
          }`}
          data-testid="tab-games"
        >
          <Gamepad2 className="inline-block mr-2" size={18} />
          Games
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {/* Videos Tab (Coming Soon style) */}
        {activeTab === "videos" && (
          <div className="animate-in fade-in duration-500" data-testid="content-videos">
            <div className="flex items-center justify-center py-16">
              <div className="text-center max-w-sm">
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blush-100 to-cream-100 rounded-full flex items-center justify-center">
                    <PlayCircle className="text-blush-400" size={36} />
                  </div>
                </div>

                <h3 className="text-2xl font-semibold text-warm-gray-700 mb-3">
                  Coming Soon
                </h3>

                <p className="text-warm-gray-600 leading-relaxed">
                  The room is still taking shape.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Soothing Sounds Tab */}
        {activeTab === "sounds" && (
          <div className="animate-in fade-in duration-500" data-testid="content-sounds">
            <div className="flex items-center justify-center py-16">
              <div className="text-center max-w-sm">
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blush-100 to-cream-100 rounded-full flex items-center justify-center">
                    <Music2 className="text-blush-400" size={36} />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-warm-gray-700 mb-3">
                  Coming Soon
                </h3>
                <p className="text-warm-gray-600 leading-relaxed">
                  Soothing sounds to help you find your calm will be available soon.
                  Stay tuned for nature sounds, ambient music, and more.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Games Tab */}
        {activeTab === "games" && (
          <div className="animate-in fade-in duration-500" data-testid="content-games">
            {/* Game Selection */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedGame("bubble")}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedGame === "bubble"
                    ? "bg-blush-300 text-white"
                    : "bg-cream-100 text-warm-gray-700 hover:bg-cream-200"
                }`}
                data-testid="select-bubble-pop"
              >
                🫧 Bubble Pop
              </button>
              <button
                onClick={() => setSelectedGame("memory")}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedGame === "memory"
                    ? "bg-blush-300 text-white"
                    : "bg-cream-100 text-warm-gray-700 hover:bg-cream-200"
                }`}
                data-testid="select-memory-match"
              >
                🎴 Memory Match
              </button>
              <button
                className="px-4 py-2 rounded-lg whitespace-nowrap bg-gray-100 text-gray-400 cursor-not-allowed flex items-center gap-2"
                disabled
                data-testid="locked-game-3"
              >
                <Lock size={14} />
                Color Drift
              </button>
              <button
                className="px-4 py-2 rounded-lg whitespace-nowrap bg-gray-100 text-gray-400 cursor-not-allowed flex items-center gap-2"
                disabled
                data-testid="locked-game-4"
              >
                <Lock size={14} />
                Zen Garden
              </button>
            </div>

            {/* Active Game */}
            {selectedGame === "bubble" && <BubblePop />}
            {selectedGame === "memory" && <MemoryMatch />}
          </div>
        )}

        {/* Initial State - No Tab Selected */}
        {!activeTab && (
          <div className="text-center py-6 animate-in fade-in duration-500">
            <div className="flex justify-center mb-10">
              <img
                src={relaxingIllustration}
                alt="Woman relaxing on chair"
                className="w-44 h-auto rounded-2xl shadow-xl shadow-blush-200/40"
                data-testid="illustration-relaxing"
              />
            </div>
            <p className="text-warm-gray-600">
              Choose an activity above to begin your journey to calm
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
