import { useState } from "react";
import { PlayCircle, Sparkles, Gamepad2, Lock, Laugh, Heart, Music2 } from "lucide-react";
import relaxingIllustration from "@assets/relaxing-illustration.png";
import BubblePop from "./BubblePop";
import MemoryMatch from "./MemoryMatch";
import { useAuth } from "@/hooks/useAuth";

type TabType = "videos" | "sounds" | "games";
type VideoCategory = "all" | "funny" | "uplifting" | "storytimes";

interface Video {
  id: string;
  title: string;
  platform: "youtube" | "tiktok";
  embedUrl: string;
  category: VideoCategory[];
  description: string;
}

const VIDEOS: Video[] = [
  {
    id: "1",
    title: "\"Money Made Me Do It\"",
    platform: "youtube",
    embedUrl: "https://www.youtube.com/embed/AdO-QzGxZW0",
    category: ["storytimes"],
    description: "Creator: YO DJ Star"
  },
  {
    id: "2",
    title: "Teachers dressed as students day",
    platform: "youtube",
    embedUrl: "https://www.youtube.com/embed/LpLM6rxijSc",
    category: ["funny"],
    description: "Creator: RomanasKatun"
  },
  {
    id: "3",
    title: "\"The Power of Hope\"",
    platform: "youtube",
    embedUrl: "https://www.youtube.com/embed/ZwcaFhdjRY4",
    category: ["uplifting"],
    description: "Creator: motivationalresource"
  }
];

export default function FindYourCalm() {
  const [activeTab, setActiveTab] = useState<TabType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory>("all");
  const [selectedGame, setSelectedGame] = useState<'bubble' | 'memory' | null>('bubble');
  const { isAuthenticated } = useAuth();

  const filteredVideos = selectedCategory === "all" 
    ? VIDEOS 
    : VIDEOS.filter(video => video.category.includes(selectedCategory));

  const handleTabClick = (tab: TabType) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  return (
    <div className="mb-6">
      {/* Tab Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
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
          Watch & Smile
        </button>
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
        {/* Watch & Smile Tab */}
        {activeTab === "videos" && (
          <div className="animate-in fade-in duration-500" data-testid="content-videos">
            {/* Support Message */}
            <div className="bg-blush-50 border border-blush-100 rounded-xl p-4 mb-6 text-center">
              <p className="text-warm-gray-700 text-sm flex items-center justify-center gap-2 flex-wrap">
                <span>Follow and support these amazing creators</span>
                <Sparkles className="inline-block text-blush-400" size={16} />
                <span>for more heartfelt, funny, and relatable storytimes that remind us we're all human.</span>
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === "all"
                    ? "bg-blush-300 text-white"
                    : "bg-cream-100 text-warm-gray-700 hover:bg-cream-200"
                }`}
                data-testid="filter-all"
              >
                <PlayCircle className="inline-block mr-1" size={16} />
                All Videos
              </button>
              <button
                onClick={() => setSelectedCategory("funny")}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === "funny"
                    ? "bg-blush-300 text-white"
                    : "bg-cream-100 text-warm-gray-700 hover:bg-cream-200"
                }`}
                data-testid="filter-funny"
              >
                <Laugh className="inline-block mr-1" size={16} />
                Funny
              </button>
              <button
                onClick={() => setSelectedCategory("uplifting")}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === "uplifting"
                    ? "bg-blush-300 text-white"
                    : "bg-cream-100 text-warm-gray-700 hover:bg-cream-200"
                }`}
                data-testid="filter-uplifting"
              >
                <Heart className="inline-block mr-1" size={16} />
                Uplifting
              </button>
              <button
                onClick={() => setSelectedCategory("storytimes")}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === "storytimes"
                    ? "bg-blush-300 text-white"
                    : "bg-cream-100 text-warm-gray-700 hover:bg-cream-200"
                }`}
                data-testid="filter-storytimes"
              >
                <Sparkles className="inline-block mr-1" size={16} />
                Story Times
              </button>
            </div>

            {/* Videos Grid */}
            <div className="space-y-6">
              {filteredVideos.length === 0 ? (
                <div className="text-center py-12 text-warm-gray-500">
                  No videos in this category yet. Check back soon! 🎥
                </div>
              ) : (
                filteredVideos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    data-testid={`video-card-${video.id}`}
                  >
                    {/* Responsive 16:9 wrapper */}
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        src={video.embedUrl}
                        title={video.title}
                        className="absolute top-0 left-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        data-testid={`video-iframe-${video.id}`}
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          video.platform === "youtube"
                            ? "bg-red-100 text-red-700"
                            : "bg-pink-100 text-pink-700"
                        }`}>
                          {video.platform === "youtube" ? "YouTube" : "TikTok"}
                        </span>
                        {video.category.map((cat) => (
                          <span
                            key={cat}
                            className="px-2 py-1 rounded text-xs bg-blush-100 text-blush-700"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-lg font-semibold text-warm-gray-800 mb-2">
                        {video.title}
                      </h3>
                      <p className="text-sm text-warm-gray-600">{video.description}</p>
                    </div>
                  </div>
                ))
              )}
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
                onClick={() => setSelectedGame('bubble')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedGame === 'bubble'
                    ? "bg-blush-300 text-white"
                    : "bg-cream-100 text-warm-gray-700 hover:bg-cream-200"
                }`}
                data-testid="select-bubble-pop"
              >
                🫧 Bubble Pop
              </button>
              <button
                onClick={() => setSelectedGame('memory')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedGame === 'memory'
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
                {!isAuthenticated && <span className="text-xs">(Sign up)</span>}
              </button>
              <button
                className="px-4 py-2 rounded-lg whitespace-nowrap bg-gray-100 text-gray-400 cursor-not-allowed flex items-center gap-2"
                disabled
                data-testid="locked-game-4"
              >
                <Lock size={14} />
                Zen Garden
                {!isAuthenticated && <span className="text-xs">(Sign up)</span>}
              </button>
            </div>

            {/* Active Game */}
            {selectedGame === 'bubble' && <BubblePop />}
            {selectedGame === 'memory' && <MemoryMatch />}
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
