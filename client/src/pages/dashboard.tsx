import { useQuery } from "@tanstack/react-query";
import { type Message } from "@shared/schema";
import { type User } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { Loader2, Heart, Sparkles } from "lucide-react";
import StreakDisplay from "@/components/streak-display";
import MoodCalendar from "@/components/mood-calendar";
import InsightsDashboard from "@/components/insights-dashboard";

export default function Dashboard() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ['/api/auth/user'],
    enabled: isAuthenticated,
  });

  const { data: messages, isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ['/api/garden/messages'],
    enabled: isAuthenticated,
  });

  const { data: favorites, isLoading: favoritesLoading } = useQuery<Message[]>({
    queryKey: ['/api/favorites'],
    enabled: isAuthenticated,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blush-50 to-cream-50 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-blush-50 to-cream-50 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-warm-gray-800 mb-2" data-testid="text-dashboard-title">
              Track Your Emotional Journey
            </h1>
            <p className="text-warm-gray-600" data-testid="text-dashboard-subtitle">
              See your mood patterns, streaks, and insights unfold
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <Sparkles className="w-16 h-16 mx-auto text-blush-300 mb-4" />
            <h2 className="text-xl font-semibold text-warm-gray-700 mb-3">
              Sign up to unlock your dashboard
            </h2>
            <p className="text-warm-gray-600 mb-6 max-w-md mx-auto">
              Create an account to track your emotional patterns, build streaks, view insights, and save your favorite moments
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-blush-50 to-cream-50 rounded-xl">
                <div className="text-3xl mb-2">🔥</div>
                <h3 className="font-semibold text-warm-gray-800 mb-1">Streak Tracking</h3>
                <p className="text-sm text-warm-gray-600">Build momentum with daily check-ins</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold text-warm-gray-800 mb-1">Mood Insights</h3>
                <p className="text-sm text-warm-gray-600">Discover patterns in your emotions</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-pink-50 to-red-50 rounded-xl">
                <div className="text-3xl mb-2">🌸</div>
                <h3 className="font-semibold text-warm-gray-800 mb-1">Visual Garden</h3>
                <p className="text-sm text-warm-gray-600">Watch your feelings bloom</p>
              </div>
            </div>

            <a
              href="/api/login"
              className="inline-block bg-blush-300 hover:bg-blush-400 text-white font-medium px-8 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
              data-testid="button-dashboard-signup"
            >
              <span className="mr-2">✨</span>
              Get Started Free
            </a>
            <p className="text-xs text-warm-gray-500 mt-4">
              No credit card required • Takes less than a minute
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isLoading = userLoading || messagesLoading || favoritesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blush-50 to-cream-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blush-400" />
          <p className="mt-4 text-warm-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blush-50 to-cream-50 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-warm-gray-800 mb-2" data-testid="text-dashboard-title">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
          </h1>
          <p className="text-warm-gray-600" data-testid="text-dashboard-subtitle">
            Here's how your emotional journey is unfolding
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Streak Display */}
          <div className="lg:col-span-1">
            <StreakDisplay 
              currentStreak={user?.currentStreak || 0}
              longestStreak={user?.longestStreak || 0}
            />
          </div>

          {/* Mood Calendar */}
          <div className="lg:col-span-2">
            <MoodCalendar messages={messages || []} />
          </div>
        </div>

        {/* Insights */}
        <div className="mb-8">
          <InsightsDashboard messages={messages || []} />
        </div>

        {/* Favorites Section */}
        {favorites && favorites.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-warm-gray-800 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" fill="currentColor" />
                  Favorite Moments
                </h3>
                <span className="text-sm text-warm-gray-500" data-testid="text-favorites-count">
                  {favorites.length} saved
                </span>
              </div>
              <div className="space-y-3">
                {favorites.slice(0, 5).map(msg => (
                  <div 
                    key={msg.id} 
                    className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg"
                    data-testid={`favorite-message-${msg.id}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <span className="inline-block px-2 py-1 bg-white rounded-full text-xs font-medium text-warm-gray-600 mb-2 capitalize">
                          {msg.emotion}
                        </span>
                        <p className="text-sm text-warm-gray-700">
                          {msg.content || `Voice message (${msg.duration}s)`}
                        </p>
                      </div>
                      <span className="text-xs text-warm-gray-500 whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {favorites.length > 5 && (
                <div className="mt-4 text-center">
                  <button className="text-sm text-blush-500 hover:text-blush-600 font-medium">
                    View all {favorites.length} favorites
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/release">
            <button className="w-full bg-gradient-to-r from-blush-300 to-blush-400 hover:from-blush-400 hover:to-blush-500 text-white font-medium px-6 py-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    data-testid="button-share-feelings">
              <Sparkles className="w-5 h-5" />
              Share Your Feelings
            </button>
          </Link>
          <Link href="/garden">
            <button className="w-full bg-gradient-to-r from-green-300 to-blue-300 hover:from-green-400 hover:to-blue-400 text-white font-medium px-6 py-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    data-testid="button-view-garden">
              <span className="text-xl">🌸</span>
              View Your Garden
            </button>
          </Link>
        </div>

        {/* Empty State */}
        {(!messages || messages.length === 0) && (
          <div className="mt-12 text-center py-16 bg-white rounded-2xl">
            <div className="mb-6">
              <Sparkles className="w-16 h-16 mx-auto text-blush-300" />
            </div>
            <h2 className="text-xl font-semibold text-warm-gray-700 mb-2">
              Your journey begins here
            </h2>
            <p className="text-warm-gray-500 mb-6">
              Start sharing your feelings to see your dashboard come to life
            </p>
            <Link href="/release">
              <button className="bg-blush-300 hover:bg-blush-400 text-white font-medium px-8 py-3 rounded-xl transition-all">
                Share Your First Feeling
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
