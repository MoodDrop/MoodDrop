import React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { readFlags } from "@/lib/featureFlags";
import dropletIcon from "../assets/droplet.png";

export default function Header() {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const flags = readFlags();

  return (
    <header className="px-6 py-4 border-b border-blush-200 bg-gradient-to-r from-blush-50 to-cream-100">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center justify-between w-full">
          <Link href="/">
            <div className="flex items-center justify-center hover:opacity-80 transition-opacity">
              <img
                src={dropletIcon}
                alt="MoodDrop"
                className="h-16 w-auto object-contain"
              />
            </div>
          </Link>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
          {/* Home */}
          <Link href="/">
            <button
              className={`px-2 sm:px-3 py-1 rounded-lg transition-colors duration-300 whitespace-nowrap ${
                location === "/"
                  ? "text-blush-400 font-medium"
                  : "text-warm-gray-600 hover:text-blush-300"
              }`}
              data-testid="nav-home"
            >
              Home
            </button>
          </Link>

          <span className="text-warm-gray-400">•</span>

          {/* My Droplets */}
          <Link href="/my-droplets">
            <button
              className={`px-2 sm:px-3 py-1 rounded-lg transition-colors duration-300 whitespace-nowrap ${
                location === "/my-droplets"
                  ? "text-blush-400 font-medium"
                  : "text-warm-gray-600 hover:text-blush-300"
              }`}
              data-testid="nav-vault"
            >
              My Droplets
            </button>
          </Link>

          <span className="text-warm-gray-400">•</span>

          {/* Living Gallery */}
          <Link href="/living-gallery">
            <button
              className={`px-2 sm:px-3 py-1 rounded-lg transition-colors duration-300 whitespace-nowrap ${
                location === "/living-gallery"
                  ? "text-blush-400 font-medium"
                  : "text-warm-gray-600 hover:text-blush-300"
              }`}
              data-testid="nav-living-gallery"
            >
              Living Gallery
            </button>
          </Link>

          <span className="text-warm-gray-400">•</span>

          {/* Harmony */}
          <Link href="/harmony">
            <button
              className={`px-2 sm:px-3 py-1 rounded-lg transition-colors duration-300 whitespace-nowrap ${
                location === "/harmony"
                  ? "text-blush-400 font-medium"
                  : "text-warm-gray-600 hover:text-blush-300"
              }`}
              data-testid="nav-harmony"
            >
              Harmony
            </button>
          </Link>

          <span className="text-warm-gray-400">•</span>

          {/* Calm Studio */}
          <Link href="/calm-studio">
            <button
              className={`px-2 sm:px-3 py-1 rounded-lg transition-colors duration-300 whitespace-nowrap ${
                location === "/calm-studio" || location === "/comfort"
                  ? "text-blush-400 font-medium"
                  : "text-warm-gray-600 hover:text-blush-300"
              }`}
              data-testid="nav-calm-studio"
            >
              Calm Studio
            </button>
          </Link>

          <span className="text-warm-gray-400">•</span>

          {/* Soft Reads */}
          <Link href="/soft-reads">
            <button
              className={`px-2 sm:px-3 py-1 rounded-lg transition-colors duration-300 whitespace-nowrap ${
                location.startsWith("/soft-reads")
                  ? "text-blush-400 font-medium"
                  : "text-warm-gray-600 hover:text-blush-300"
              }`}
              data-testid="nav-soft-reads"
            >
              Soft Reads
            </button>
          </Link>
        </nav>
      </div>
    </header>
  );
}