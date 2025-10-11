import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import dropletIcon from "@assets/Droplet_1760186315979.png";

export default function Header() {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="bg-gradient-to-r from-blush-100 to-cream-100 px-6 py-4 border-b border-blush-200">
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

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <a
                href="/api/logout"
                className="flex items-center gap-1 text-xs text-warm-gray-600 hover:text-blush-500 transition-colors"
                data-testid="button-logout"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </a>
            ) : (
              <a
                href="/api/login"
                className="text-xs bg-blush-300 hover:bg-blush-400 text-white px-3 py-1.5 rounded-lg transition-colors font-medium"
                data-testid="button-signup"
              >
                Sign Up
              </a>
            )}
          </div>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
          <Link href="/">
            <button
              className={`px-2 sm:px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                location === "/"
                  ? "text-blush-600 font-medium"
                  : "text-warm-gray-600 hover:text-blush-500"
              }`}
              data-testid="nav-home"
            >
              Home
            </button>
          </Link>
          <span className="text-warm-gray-400">•</span>
          <Link href="/release">
            <button
              className={`px-2 sm:px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                location === "/release"
                  ? "text-blush-600 font-medium"
                  : "text-warm-gray-600 hover:text-blush-500"
              }`}
              data-testid="nav-release"
            >
              Drop What You're Holding
            </button>
          </Link>
          <span className="text-warm-gray-400">•</span>
          <Link href="/garden">
            <button
              className={`px-2 sm:px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                location === "/garden"
                  ? "text-blush-600 font-medium"
                  : "text-warm-gray-600 hover:text-blush-500"
              }`}
              data-testid="nav-garden"
            >
              Mood Garden
            </button>
          </Link>
          <span className="text-warm-gray-400">•</span>
          <Link href="/comfort">
            <button
              className={`px-2 sm:px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                location === "/comfort"
                  ? "text-blush-600 font-medium"
                  : "text-warm-gray-600 hover:text-blush-500"
              }`}
              data-testid="nav-comfort"
            >
              Find Your Calm
            </button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
