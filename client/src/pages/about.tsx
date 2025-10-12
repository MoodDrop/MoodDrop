import { Link } from "wouter";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
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
            About MoodDrop
          </h1>
          <p className="text-warm-gray-600 text-sm">
            Our story and mission
          </p>
        </div>
      </div>

      {/* About Content */}
      <div className="bg-gradient-to-br from-blush-50 to-cream-50 border border-blush-200 rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold text-warm-gray-700 mb-2 flex items-center justify-center gap-2">
            <span>🌸</span> About MoodDrop
          </h2>
        </div>
        
        <div className="space-y-6 text-warm-gray-700 leading-relaxed">
          <p>
            MoodDrop was created with one simple intention — to give you a safe, comforting space to release what's on your mind and reconnect with your peace.
          </p>
          
          <p>
            It started as an idea born from real moments — the days I felt heavy, the nights when my thoughts won't quiet down, and the times I just need somewhere to breathe. MoodDrop was designed to be that space — a gentle corner of the internet where you can release freely, share your emotions without judgment, and rediscover calm at your own pace.
          </p>
          
          <p>
            Every feature — from writing reflections to exploring affirmations and calming content — was built to help you process, release, and realign with yourself. Whether you're expressing gratitude, easing anxiety, or simply dropping off the weight of your day, MoodDrop is here for those quiet, in-between moments we all experience.
          </p>
          
          <div className="text-center mt-8 pt-6 border-t border-blush-200">
            <p className="text-warm-gray-600 flex items-center justify-center gap-2 flex-wrap">
              <Sparkles className="inline-block text-blush-400" size={20} />
              <span className="font-medium">Hope you enjoy MoodDrop as much as I enjoyed creating this space for you.</span>
              <span className="text-xl">💕</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
