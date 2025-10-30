import { Link, useLocation } from "wouter";
import { PlayCircle, Music2, Gamepad2, ChevronLeft } from "lucide-react";

export default function CalmStudio() {
  const [, navigate] = useLocation();

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        aria-label="Back to home"
        className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-cream-50 border border-blush-100 hover:bg-cream-100 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-blush-300 focus-visible:outline-none"
        data-testid="button-back-home"
      >
        <ChevronLeft className="h-5 w-5 text-warm-gray-700" />
      </button>

      {/* Title & Subtitle */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-warm-gray-900">
        Calm Studio
      </h1>
      <p className="mt-2 text-sm text-warm-gray-600">
        Take a moment to relax and reset. Watch something uplifting, listen to something soothing, or just breathe.
      </p>

      {/* Three Pill Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Link 
          href="/calm/watch"
          className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-cream-50 border border-blush-100 hover:bg-cream-100 shadow-sm transition-all text-warm-gray-700 focus-visible:ring-2 focus-visible:ring-blush-300 focus-visible:outline-none"
          data-testid="link-watch-smile"
        >
          <PlayCircle className="h-5 w-5" />
          <span>Watch &amp; Smile</span>
        </Link>
        <Link 
          href="/calm/sounds"
          className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-cream-50 border border-blush-100 hover:bg-cream-100 shadow-sm transition-all text-warm-gray-700 focus-visible:ring-2 focus-visible:ring-blush-300 focus-visible:outline-none"
          data-testid="link-soothing-sounds"
        >
          <Music2 className="h-5 w-5" />
          <span>Soothing Sounds</span>
        </Link>
        <Link 
          href="/calm/games"
          className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-cream-50 border border-blush-100 hover:bg-cream-100 shadow-sm transition-all text-warm-gray-700 focus-visible:ring-2 focus-visible:ring-blush-300 focus-visible:outline-none"
          data-testid="link-games"
        >
          <Gamepad2 className="h-5 w-5" />
          <span>Games</span>
        </Link>
      </div>

      {/* Optional Preview Block */}
      <div className="mt-6 rounded-2xl border border-zinc-200/70 bg-white/80 p-5 shadow-sm">
        <div className="flex items-center justify-center h-40 bg-gradient-to-br from-cream-50 to-blush-50 rounded-xl">
          <p className="text-warm-gray-400 text-sm">Preview coming soon</p>
        </div>
      </div>

      {/* Helper Text */}
      <p className="mt-6 text-center text-sm text-warm-gray-500">
        Choose an activity above to begin your journey to calm
      </p>
    </main>
  );
}
