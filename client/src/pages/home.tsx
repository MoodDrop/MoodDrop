import { Link } from "wouter";
import dropletIcon from "@assets/Droplet_1760186315979.png";

export default function Home() {
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
      <p className="text-warm-gray-600 leading-relaxed mb-8">
        A gentle space to release your thoughts, find calm, and grow through every mood.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <Link href="/release">
          <button 
            className="bg-blush-300 hover:bg-blush-400 text-white font-medium px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg"
            data-testid="button-share-feelings"
          >
            <span className="mr-2">💭</span>
            Let It Flow
          </button>
        </Link>
        <Link href="/comfort">
          <button 
            className="bg-cream-200 hover:bg-cream-300 text-warm-gray-700 font-medium px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg"
            data-testid="button-comfort"
          >
            <span className="mr-2">🤗</span>
            Take A Moment
          </button>
        </Link>
      </div>

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
