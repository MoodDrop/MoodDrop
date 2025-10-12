import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import ComfortCorner from "@/components/comfort-corner";
import FindYourCalm from "@/components/find-your-calm";

export default function Comfort() {
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
            Find Your Calm
          </h1>
          <p className="text-warm-gray-600 text-sm">
            Take a moment to relax and reset. Watch something uplifting, listen to something soothing, or just breathe.
          </p>
        </div>
      </div>

      {/* Find Your Calm Section - Tabs */}
      <FindYourCalm />

      {/* Comfort Corner */}
      <ComfortCorner />

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
