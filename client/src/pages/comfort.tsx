import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, PlayCircle, Sparkles, Laugh, Heart } from "lucide-react";
import ComfortCorner from "@/components/comfort-corner";

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
    title: "Wholesome Stories That Will Make Your Day",
    platform: "youtube",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: ["uplifting", "storytimes"],
    description: "Heartwarming stories that remind us of the good in the world"
  },
  {
    id: "2",
    title: "Funny Moments Compilation",
    platform: "youtube",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: ["funny"],
    description: "Guaranteed to make you laugh out loud"
  },
  {
    id: "3",
    title: "Inspiring Life Stories",
    platform: "youtube",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: ["uplifting", "storytimes"],
    description: "Real stories of triumph and perseverance"
  }
];

export default function Comfort() {
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory>("all");

  const filteredVideos = selectedCategory === "all" 
    ? VIDEOS 
    : VIDEOS.filter(video => video.category.includes(selectedCategory));

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <button
            className="w-10 h-10 bg-blush-100 rounded-full flex items-center justify-center hover:bg-blush-200 transition-colors"
            data-testid="button-back-home"
          >
            <ArrowLeft className="text-blush-600" size={18} />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-warm-gray-700">
            Need Comfort
          </h1>
          <p className="text-warm-gray-600 text-sm">
            Take a moment to relax and reset. Watch something uplifting, listen to something soothing, or just breathe.
          </p>
        </div>
      </div>

      {/* Comfort Corner */}
      <ComfortCorner />

      {/* Video Section */}
      <div className="mt-8 mb-6">
        <h2 className="text-xl font-semibold text-warm-gray-700 mb-4">
          Watch & Smile
        </h2>
        
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

      {/* Additional Wellbeing Tips */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-blush-100 mb-6">
        <h3 className="text-lg font-semibold text-warm-gray-700 mb-4 flex items-center gap-2">
          🌿 Daily Wellbeing Tips
        </h3>
        <div className="grid gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800 mb-2">
              🌅 Morning Routine
            </h4>
            <p className="text-green-700 text-sm">
              Start your day with intention. Take 5 minutes to breathe, stretch,
              or set a positive intention for the day ahead.
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">💧 Stay Hydrated</h4>
            <p className="text-blue-700 text-sm">
              Drink water regularly throughout the day. Dehydration can affect
              your mood and energy levels.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-800 mb-2">
              😴 Quality Sleep
            </h4>
            <p className="text-purple-700 text-sm">
              Aim for 7-9 hours of sleep. Create a bedtime routine that helps
              you wind down and relax.
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h4 className="font-medium text-orange-800 mb-2">
              🤗 Connect with Others
            </h4>
            <p className="text-orange-700 text-sm">
              Reach out to friends, family, or support groups. Human connection
              is vital for mental health.
            </p>
          </div>
        </div>
      </div>

      {/* Professional Help Reminder */}
      <div className="bg-gradient-to-r from-blush-100 to-cream-100 rounded-2xl p-6 border border-blush-200">
        <h3 className="text-lg font-semibold text-warm-gray-700 mb-3 flex items-center gap-2">
          🩺 Professional Support
        </h3>
        <p className="text-warm-gray-600 text-sm leading-relaxed mb-4">
          While MoodDrop provides a safe space for expression and these
          resources offer comfort, they are not substitutes for professional
          mental health care. If you're experiencing persistent difficulties,
          please consider reaching out to a qualified mental health
          professional.
        </p>
        <div className="bg-white rounded-lg p-4 border border-blush-200">
          <h4 className="font-medium text-warm-gray-700 mb-2">
            Ways to Find Professional Help:
          </h4>
          <ul className="text-warm-gray-600 text-sm space-y-1">
            <li>• Contact your primary care physician for referrals</li>
            <li>• Use online directories like Psychology Today</li>
            <li>• Check with your insurance provider for covered therapists</li>
            <li>
              • Contact local mental health centers or community organizations
            </li>
            <li>• Ask trusted friends or family for recommendations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
