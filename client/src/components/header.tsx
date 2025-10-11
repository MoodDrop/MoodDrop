import { Link, useLocation } from "wouter";
import { Heart, Home } from "lucide-react";
import dropletIcon from "@assets/Droplet_1760186315979.png";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="bg-gradient-to-r from-blush-100 to-cream-100 px-6 py-4 border-b border-blush-200">
      <div className="flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src={dropletIcon} alt="Droplet" className="w-8 h-8" />
            </div>
            <span className="text-lg font-semibold text-warm-gray-700">
              MoodDrop
            </span>
          </div>
        </Link>

        {location !== "/" && location !== "/comfort" && (
          <nav className="flex items-center gap-3">
            <Link href="/">
              <button
                className="flex items-center gap-1 px-3 py-2 text-sm text-warm-gray-600 hover:text-blush-400 hover:bg-blush-50 rounded-lg transition-colors"
                data-testid="nav-home"
              >
                <Home size={14} />
                Home
              </button>
            </Link>
            <Link href="/comfort">
              <button
                className="flex items-center gap-1 px-3 py-2 text-sm text-warm-gray-600 hover:text-blush-400 hover:bg-blush-50 rounded-lg transition-colors"
                data-testid="nav-comfort"
              >
                <Heart size={14} />
                Comfort
              </button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
