import { Link } from "wouter";
import { ArrowLeft, Shield } from "lucide-react";

export default function Privacy() {
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
            Privacy & Safety Policy
          </h1>
          <p className="text-warm-gray-600 text-sm">
            Your comfort comes first
          </p>
        </div>
      </div>

      {/* Privacy Policy Content */}
      <div className="bg-gradient-to-br from-blush-50 to-cream-50 border border-blush-200 rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold text-warm-gray-700 mb-2 flex items-center justify-center gap-2">
            <span>🌸</span> MoodDrop Privacy & Safety Policy
          </h2>
          <p className="text-blush-500 font-medium">Your Comfort Comes First</p>
        </div>
        
        <div className="space-y-8 text-warm-gray-700 leading-relaxed">
          <p>
            MoodDrop was created as a calm, judgment-free space where you can express how you feel — freely and anonymously. We value your trust and protect your privacy at every step.
          </p>
          
          {/* What We Collect */}
          <div>
            <h3 className="text-xl font-semibold text-warm-gray-700 mb-3 flex items-center gap-2">
              <span>💧</span> What We Collect
            </h3>
            <div className="space-y-3 pl-8">
              <p>We only collect the minimum information needed to help MoodDrop run smoothly.</p>
              <ul className="list-disc list-inside space-y-2 text-warm-gray-600">
                <li>Your voice notes, entries, and messages are private.</li>
                <li>No names, emails, or identifying details are required to use the release or journaling features unless you choose to share them.</li>
              </ul>
            </div>
          </div>

          {/* Your Privacy */}
          <div>
            <h3 className="text-xl font-semibold text-warm-gray-700 mb-3 flex items-center gap-2">
              <span>🔒</span> Your Privacy
            </h3>
            <div className="space-y-3 pl-8">
              <ul className="list-disc list-inside space-y-2 text-warm-gray-600">
                <li>Your submissions are completely anonymous.</li>
                <li>We do not sell, share, or distribute your data to any third-party apps or services.</li>
                <li>Voice notes and written entries are stored securely and never used for marketing or analytics.</li>
                <li>You can delete your entries or notes at any time.</li>
              </ul>
            </div>
          </div>

          {/* Safe Space Promise */}
          <div>
            <h3 className="text-xl font-semibold text-warm-gray-700 mb-3 flex items-center gap-2">
              <span>🌿</span> Safe Space Promise
            </h3>
            <div className="space-y-3 pl-8">
              <p className="text-warm-gray-600">
                MoodDrop is a space for reflection, healing, and release. Please avoid sharing personal contact details or sensitive information about others. Respect and kindness are at the heart of our community.
              </p>
            </div>
          </div>

          {/* Transparency */}
          <div>
            <h3 className="text-xl font-semibold text-warm-gray-700 mb-3 flex items-center gap-2">
              <span>💛</span> Transparency
            </h3>
            <div className="space-y-3 pl-8">
              <p className="text-warm-gray-600">
                We're always improving MoodDrop to make it safer and more supportive. If we make any updates to this policy, we'll notify you clearly on the site.
              </p>
            </div>
          </div>

          {/* Closing Message */}
          <div className="text-center mt-8 pt-6 border-t border-blush-200">
            <p className="text-lg font-medium text-warm-gray-700 mb-3 flex items-center justify-center gap-2">
              <Shield className="inline-block text-blush-400" size={22} />
              <span>In short:</span>
            </p>
            <p className="text-blush-500 font-semibold text-lg mb-2">
              "Your words stay with you. Your peace stays yours."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
