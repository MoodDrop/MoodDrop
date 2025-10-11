import { Link } from "wouter";
import ComfortCorner from "@/components/comfort-corner";
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

      <ComfortCorner />
    </div>
  );
}
