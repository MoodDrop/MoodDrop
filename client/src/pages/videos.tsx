import { useState } from "react";
import { Link } from "wouter";
import { PlayCircle, Sparkles, Laugh, Heart } from "lucide-react";

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

export default function Videos() {
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory>("all");

  const filteredVideos = selectedCategory === "all" 
    ? VIDEOS 
    : VIDEOS.filter(video => video.category.includes(selectedCategory));

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/">
          <span className="text-sm text-warm-gray-500 hover:text-warm-gray-700 transition cursor-pointer" data-testid="link-back-home">
            ← Back home
          </span>
        </Link>
        <h1 className="text-2xl font-semibold text-warm-gray-800">Watch & Smile</h1>
      </div>

      <p className="text-center text-warm-gray-600 mb-8">
        Enjoy uplifting videos, funny moments, and heartwarming stories to brighten your day 🎬
      </p>

      {/* Category Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
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
              <div className="aspect-video bg-gray-100">
                <iframe
                  src={video.embedUrl}
                  title={video.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
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

      {/* Help Text */}
      <div className="mt-8 p-4 bg-blush-50 rounded-lg text-center">
        <p className="text-sm text-warm-gray-600">
          💡 <strong>Pro tip:</strong> You can customize this list by adding your favorite YouTube or TikTok videos!
        </p>
      </div>
    </div>
  );
}
