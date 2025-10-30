import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import dropletIcon from "@assets/Droplet_1760186315979.png";

export default function Header() {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();

  return (
    <header 
      className="px-6 py-4 border-b border-blush-200 bg-gradient-to-r from-blush-50 to-cream-100"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center justify-between w-full">
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

          {/* Auth buttons removed - anonymous by default */}
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
          <Link href="/">
            <button
              className={`px-2 sm:px-3 py-1 rounded-lg transition-colors duration-300 whitespace-nowrap ${
                location === "/" ? "text-blush-400 font-medium" : "text-warm-gray-600 hover:text-blush-300"
              }`}
              data-testid="nav-home"
            >
              Home
            </button>
          </Link>
          <span className="text-warm-gray-400">•</span>
          <Link href="/release">
            <button
              className={`px-2 sm:px-3 py-1 rounded-lg transition-colors duration-300 whitespace-nowrap ${
                location === "/release" || location === "/breathe" ? "text-blush-400 font-medium" : "text-warm-gray-600 hover:text-blush-300"
              }`}
              data-testid="nav-breathe"
            >
              Take a Breath
            </button>
          </Link>
          <span className="text-warm-gray-400">•</span>
          <Link href="/garden">
            <button
              className={`px-2 sm:px-3 py-1 rounded-lg transition-colors duration-300 whitespace-nowrap ${
                location === "/garden" ? "text-blush-400 font-medium" : "text-warm-gray-600 hover:text-blush-300"
              }`}
              data-testid="nav-garden"
            >
              Mood Garden
            </button>
          </Link>
          <span className="text-warm-gray-400">•</span>
          <Link href="/calm-studio">
            <button
              className={`px-2 sm:px-3 py-1 rounded-lg transition-colors duration-300 whitespace-nowrap ${
                location === "/calm-studio" ? "text-blush-400 font-medium" : "text-warm-gray-600 hover:text-blush-300"
              }`}
              data-testid="nav-calm-studio"
            >
              Calm Studio
            </button>
          </Link>
          <span className="text-warm-gray-400">•</span>
          <Link href="/about">
            <button
              className={`px-2 sm:px-3 py-1 rounded-lg transition-colors duration-300 whitespace-nowrap ${
                location === "/about" ? "text-blush-400 font-medium" : "text-warm-gray-600 hover:text-blush-300"
              }`}
              data-testid="nav-about"
            >
              About MoodDrop
            </button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
