import { RotateCcw } from "lucide-react";
import { moods, type MoodKey } from "@/lib/moods";

interface VoiceTabProps {
  selectedMood: MoodKey | null;
  onResetMood: () => void;
}

export default function VoiceTab({ selectedMood, onResetMood }: VoiceTabProps) {
  const mood = selectedMood ? moods[selectedMood] : null;

  return (
    <div className="animate-in fade-in duration-500">
      {/* Selected Mood Display */}
      {mood && (
        <div className="flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-blush-50 to-cream-50 rounded-xl border border-blush-100">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
              style={{ backgroundColor: mood.color }}
            />
            <div>
              <p className="font-medium text-warm-gray-800">{mood.key}</p>
              <p className="text-sm text-warm-gray-600">{mood.meaning}</p>
            </div>
          </div>
          <button
            onClick={onResetMood}
            className="flex items-center gap-2 text-sm text-warm-gray-600 hover:text-warm-gray-800 transition"
            data-testid="button-reset-mood-voice"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      )}

      {/* Voice Note - Coming Soon */}
      <div className="rounded-lg border border-blush-100 bg-blush-50 p-8 text-center">
        <div className="text-5xl mb-4">🎤</div>
        <h3 className="text-lg font-semibold text-warm-gray-700 mb-2">
          Voice Notes Coming Soon
        </h3>
        <p className="text-sm text-warm-gray-600 leading-relaxed">
          Soon you'll be able to share your feelings with voice recordings.
        </p>
      </div>
    </div>
  );
}
