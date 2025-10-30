import { Link } from "wouter";
import { ChevronLeft, PlayCircle } from "lucide-react";

export default function WatchPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/calm-studio"
        className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-cream-50 border border-blush-100 hover:bg-cream-100 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-blush-300 focus-visible:outline-none"
        data-testid="button-back-calm"
      >
        <ChevronLeft className="h-5 w-5 text-warm-gray-700" />
      </Link>

      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cream-100 mb-4">
          <PlayCircle className="w-8 h-8 text-warm-gray-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-warm-gray-900">
          Watch &amp; Smile
        </h1>
        <p className="mt-2 text-sm text-warm-gray-600">
          Curated uplifting videos to brighten your day
        </p>
      </div>

      {/* Coming Soon Message */}
      <div className="rounded-2xl border border-blush-100 bg-white/80 p-8 shadow-sm text-center">
        <p className="text-warm-gray-500">
          Coming soon - We're curating a collection of feel-good videos just for you
        </p>
      </div>
    </main>
  );
}
