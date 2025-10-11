import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/TimeBasedThemeProvider";
import { LogOut } from "lucide-react";
import dropletIcon from "@assets/Droplet_1760186315979.png";

export default function Header() {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const theme = useTheme();

  return (
    <header 
      className="px-6 py-4 border-b transition-all duration-1000 ease-in-out"
      style={{
        background: theme.headerGradient,
        borderBottomColor: `${theme.accentPrimary}40`,
      }}
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

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <a
                href="/api/logout"
                className="flex items-center gap-1 text-xs text-warm-gray-600 transition-colors"
                style={{ 
                  color: `${theme.accentPrimary}`,
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                data-testid="button-logout"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </a>
            ) : (
              <a
                href="/api/login"
                className="text-xs text-white px-3 py-1.5 rounded-lg transition-all duration-300 font-medium"
                style={{
                  backgroundColor: theme.accentPrimary,
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.accentSecondary}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.accentPrimary}
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
              className="px-2 sm:px-3 py-1 rounded-lg transition-all duration-300 whitespace-nowrap"
              style={{
                color: location === "/" ? theme.accentPrimary : "#57534e",
                fontWeight: location === "/" ? 500 : 400,
              }}
              onMouseEnter={(e) => {
                if (location !== "/") e.currentTarget.style.color = theme.accentSecondary;
              }}
              onMouseLeave={(e) => {
                if (location !== "/") e.currentTarget.style.color = "#57534e";
              }}
              data-testid="nav-home"
            >
              Home
            </button>
          </Link>
          <span className="text-warm-gray-400">•</span>
          <Link href="/release">
            <button
              className="px-2 sm:px-3 py-1 rounded-lg transition-all duration-300 whitespace-nowrap"
              style={{
                color: location === "/release" ? theme.accentPrimary : "#57534e",
                fontWeight: location === "/release" ? 500 : 400,
              }}
              onMouseEnter={(e) => {
                if (location !== "/release") e.currentTarget.style.color = theme.accentSecondary;
              }}
              onMouseLeave={(e) => {
                if (location !== "/release") e.currentTarget.style.color = "#57534e";
              }}
              data-testid="nav-release"
            >
              Drop What You're Holding
            </button>
          </Link>
          <span className="text-warm-gray-400">•</span>
          <Link href="/garden">
            <button
              className="px-2 sm:px-3 py-1 rounded-lg transition-all duration-300 whitespace-nowrap"
              style={{
                color: location === "/garden" ? theme.accentPrimary : "#57534e",
                fontWeight: location === "/garden" ? 500 : 400,
              }}
              onMouseEnter={(e) => {
                if (location !== "/garden") e.currentTarget.style.color = theme.accentSecondary;
              }}
              onMouseLeave={(e) => {
                if (location !== "/garden") e.currentTarget.style.color = "#57534e";
              }}
              data-testid="nav-garden"
            >
              Mood Garden
            </button>
          </Link>
          <span className="text-warm-gray-400">•</span>
          <Link href="/comfort">
            <button
              className="px-2 sm:px-3 py-1 rounded-lg transition-all duration-300 whitespace-nowrap"
              style={{
                color: location === "/comfort" ? theme.accentPrimary : "#57534e",
                fontWeight: location === "/comfort" ? 500 : 400,
              }}
              onMouseEnter={(e) => {
                if (location !== "/comfort") e.currentTarget.style.color = theme.accentSecondary;
              }}
              onMouseLeave={(e) => {
                if (location !== "/comfort") e.currentTarget.style.color = "#57534e";
              }}
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
