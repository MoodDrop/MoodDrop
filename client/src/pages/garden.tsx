import { useQuery } from "@tanstack/react-query";
import { type Message } from "@shared/schema";
import { getEmotionColor } from "@/lib/gardenColors";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import GardenIllustration from "@/components/GardenIllustration";

function Droplet({ color, size = 60, delay = 0 }: { color: { primary: string; secondary: string; shadow: string }; size?: number; delay?: number }) {
  return (
    <div 
      className="relative animate-in fade-in zoom-in duration-700"
      style={{ 
        animationDelay: `${delay}ms`,
        width: size,
        height: size * 1.2,
      }}
    >
      <svg viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M30 2C30 2 8 25 8 42C8 54.1503 17.8497 64 30 64C42.1503 64 52 54.1503 52 42C52 25 30 2 30 2Z"
          fill={color.primary}
          stroke={color.shadow}
          strokeWidth="2"
        />
        <ellipse
          cx="22"
          cy="30"
          rx="8"
          ry="12"
          fill={color.secondary}
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

function Flower({ color, size = 70, delay = 0 }: { color: { primary: string; secondary: string; shadow: string }; size?: number; delay?: number }) {
  return (
    <div 
      className="relative animate-in fade-in zoom-in duration-700"
      style={{ 
        animationDelay: `${delay}ms`,
        width: size,
        height: size,
      }}
    >
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Petals */}
        <circle cx="40" cy="20" r="12" fill={color.primary} />
        <circle cx="60" cy="40" r="12" fill={color.primary} />
        <circle cx="40" cy="60" r="12" fill={color.primary} />
        <circle cx="20" cy="40" r="12" fill={color.primary} />
        
        {/* Center */}
        <circle cx="40" cy="40" r="10" fill={color.secondary} stroke={color.shadow} strokeWidth="2" />
        
        {/* Stem */}
        <rect x="38" y="48" width="4" height="25" fill="#86EFAC" />
      </svg>
    </div>
  );
}

function Tree({ color, size = 90, delay = 0 }: { color: { primary: string; secondary: string; shadow: string }; size?: number; delay?: number }) {
  return (
    <div 
      className="relative animate-in fade-in zoom-in duration-700"
      style={{ 
        animationDelay: `${delay}ms`,
        width: size,
        height: size,
      }}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Trunk */}
        <rect x="44" y="55" width="12" height="35" fill="#92400E" rx="2" />
        
        {/* Foliage - three layers */}
        <ellipse cx="50" cy="50" rx="30" ry="20" fill={color.primary} />
        <ellipse cx="50" cy="35" rx="25" ry="18" fill={color.secondary} />
        <ellipse cx="50" cy="22" rx="18" ry="14" fill={color.shadow} />
      </svg>
    </div>
  );
}

function GardenElement({ message, index }: { message: Message; index: number }) {
  const color = getEmotionColor(message.emotion);
  const delay = index * 100;
  
  // Choose element type based on message type or emotion intensity
  const elementType = index % 3;
  
  if (elementType === 0) {
    return <Droplet color={color} delay={delay} />;
  } else if (elementType === 1) {
    return <Flower color={color} delay={delay} />;
  } else {
    return <Tree color={color} delay={delay} />;
  }
}

export default function Garden() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: messages, isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ['/api/garden/messages'],
    enabled: isAuthenticated,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blush-400" />
          <p className="mt-4 text-warm-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show soft prompt for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-warm-gray-800 mb-2" data-testid="text-garden-title">
              Your Mood Garden
            </h1>
            <p className="text-warm-gray-600" data-testid="text-garden-subtitle">
              Watch your emotional journey bloom into something beautiful
            </p>
          </div>

          <div className="text-center py-16">
            <GardenIllustration />
            <h2 className="text-xl font-semibold text-warm-gray-700 mb-3" data-testid="text-garden-signin-title">
              Sign up to grow your garden
            </h2>
            <p className="text-warm-gray-600 mb-6 max-w-md mx-auto" data-testid="text-garden-signin-message">
              Create an account to track your emotional journey and watch your feelings bloom into a beautiful visual garden
            </p>
            <a
              href="/api/login"
              className="inline-block bg-blush-300 hover:bg-blush-400 text-white font-medium px-8 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
              data-testid="button-garden-signup"
            >
              <span className="mr-2">🌸</span>
              Sign Up Free
            </a>
            <p className="text-xs text-warm-gray-500 mt-4">
              No credit card required • Takes less than a minute
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (messagesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blush-400" />
          <p className="mt-4 text-warm-gray-600">Growing your garden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-warm-gray-800 mb-2" data-testid="text-garden-title">
            Your Mood Garden
          </h1>
          <p className="text-warm-gray-600" data-testid="text-garden-subtitle">
            Each feeling you've shared has blossomed into something beautiful
          </p>
          {messages && messages.length > 0 && (
            <p className="text-sm text-warm-gray-500 mt-2" data-testid="text-garden-count">
              {messages.length} {messages.length === 1 ? 'bloom' : 'blooms'} in your garden
            </p>
          )}
        </div>

        {!messages || messages.length === 0 ? (
          <div className="text-center py-16">
            <GardenIllustration />
            <h2 className="text-xl font-semibold text-warm-gray-700 mb-2" data-testid="text-garden-empty-title">
              Your garden is waiting to bloom
            </h2>
            <p className="text-warm-gray-500" data-testid="text-garden-empty-message">
              Share your feelings to watch your garden grow with beautiful colors and life
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-6 items-end justify-items-center">
            {messages.map((message, index) => (
              <div 
                key={message.id} 
                className="cursor-pointer hover:scale-110 transition-transform duration-200"
                title={`${message.emotion} - ${new Date(message.createdAt).toLocaleDateString()}`}
                data-testid={`garden-element-${message.id}`}
              >
                <GardenElement message={message} index={index} />
              </div>
            ))}
          </div>
        )}

        {/* Legend */}
        {messages && messages.length > 0 && (
          <div className="mt-12 p-6 bg-white/80 backdrop-blur rounded-2xl shadow-lg" data-testid="garden-legend">
            <h3 className="text-lg font-semibold text-warm-gray-800 mb-4">Garden Colors</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#60A5FA' }} />
                <span className="text-warm-gray-700">Calm</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#F9A8D4' }} />
                <span className="text-warm-gray-700">Hopeful</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#FCD34D' }} />
                <span className="text-warm-gray-700">Proud</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#D1D5DB' }} />
                <span className="text-warm-gray-700">Gentle</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#FB923C' }} />
                <span className="text-warm-gray-700">Alert</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
