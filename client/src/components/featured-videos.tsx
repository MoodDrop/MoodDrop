import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import type { FeaturedVideo } from "@shared/schema";

export default function FeaturedVideos() {
  const { data: videos, isLoading } = useQuery<FeaturedVideo[]>({
    queryKey: ['/api/featured-videos'],
  });

  // Helper function to convert video URL to embed URL
  const getEmbedUrl = (url: string, platform: string) => {
    if (platform === 'youtube') {
      // Extract video ID from various YouTube URL formats
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = url.match(youtubeRegex);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    } else if (platform === 'tiktok') {
      // Extract TikTok video ID
      const tiktokRegex = /tiktok\.com\/.*\/video\/(\d+)/;
      const match = url.match(tiktokRegex);
      if (match && match[1]) {
        return `https://www.tiktok.com/embed/v2/${match[1]}`;
      }
    }
    return url;
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blush-400 mx-auto"></div>
        <p className="text-warm-gray-600 mt-2">Loading videos...</p>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return null; // Don't show section if no videos
  }

  return (
    <div className="mb-12" data-testid="featured-videos-section">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-blush-400" size={24} />
        <h3 className="text-2xl font-semibold text-warm-gray-800">Featured for You</h3>
      </div>
      <p className="text-warm-gray-600 mb-6">Curated uplifting content to brighten your day</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="group bg-gradient-to-br from-cream-50 to-blush-50 rounded-2xl p-4 border border-warm-gray-100 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            data-testid={`featured-video-${video.id}`}
          >
            <div className="relative aspect-video rounded-xl overflow-hidden mb-3 shadow-md">
              <iframe
                src={getEmbedUrl(video.url, video.platform)}
                title={video.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                data-testid={`iframe-${video.id}`}
              />
            </div>
            <h4 className="text-lg font-semibold text-warm-gray-800 group-hover:text-blush-500 transition-colors">
              {video.title}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
}
