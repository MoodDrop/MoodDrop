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
        A safe, anonymous space to breathe, release, and let it all drop — one mood at a time.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <Link href="/release">
          <button 
            className="bg-blush-300 hover:bg-blush-400 text-white font-medium px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg"
            data-testid="button-share-feelings"
          >
            <span className="mr-2">💭</span>
            Share Your Feelings
          </button>
        </Link>
        <Link href="/comfort">
          <button 
            className="bg-cream-200 hover:bg-cream-300 text-warm-gray-700 font-medium px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg"
            data-testid="button-comfort"
          >
            <span className="mr-2">🤗</span>
            Need Comfort?
          </button>
        </Link>
      </div>
    </div>
  );
}
