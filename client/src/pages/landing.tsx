import dropletIcon from "@assets/Droplet_1760186315979.png";
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="text-center mb-8">
      <img
        src={dropletIcon}
        alt="MoodDrop Logo"
        className="w-32 h-32 mx-auto mb-6 shadow-sm"
      />

      <h2 className="text-2xl font-semibold text-warm-gray-700 mb-4">
        Welcome to MoodDrop
      </h2>
      <p className="text-warm-gray-600 leading-relaxed mb-6">
        A safe, anonymous space to breathe, release, and let it all drop — one mood at a time.
      </p>
      
      <p className="text-warm-gray-600 leading-relaxed mb-8">
        Track your emotional journey, watch your Mood Garden grow, and find comfort when you need it most.
      </p>

      <div className="flex flex-col gap-4 justify-center mb-6">
        <a
          href="/api/login"
          className="bg-blush-300 hover:bg-blush-400 text-white font-medium px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg inline-block"
          data-testid="button-login"
        >
          <span className="mr-2">🌸</span>
          Sign In to Start
        </a>
        <p className="text-xs text-warm-gray-500">
          Free to use • Secure login with Google, GitHub, Apple, or email
        </p>
      </div>

      {/* Privacy Policy Link */}
      <div className="mt-8 pt-6 border-t border-blush-200">
        <p className="text-sm text-warm-gray-600 mb-2">
          "Your words stay with you. Your peace stays yours."
        </p>
        <a
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blush-400 hover:text-blush-500 text-sm font-medium transition-colors underline"
          data-testid="link-privacy-policy"
        >
          View Privacy & Safety Policy
        </a>
      </div>
    </div>
  );
}
