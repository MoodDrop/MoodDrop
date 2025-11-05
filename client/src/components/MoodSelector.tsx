import { MOODS_ARRAY, type MoodKey } from "@/lib/moods";

interface MoodSelectorProps {
  selectedMood: MoodKey | null;
  onSelectMood: (mood: MoodKey) => void;
}

export default function MoodSelector({ selectedMood, onSelectMood }: MoodSelectorProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-xl font-medium text-warm-gray-700 text-center mb-6">
        What type of mood are you feeling today?
      </h3>

      <div className="grid grid-cols-3 gap-4 sm:gap-6">
        {MOODS_ARRAY.map((mood) => {
          const isSelected = selectedMood === mood.key;
          
          return (
            <button
              key={mood.key}
              onClick={() => onSelectMood(mood.key)}
              aria-label={`${mood.key} — ${mood.shape}`}
              aria-selected={isSelected}
              className={`
                relative aspect-square rounded-2xl transition-all duration-200 ease-out
                focus:outline-none focus:ring-2 focus:ring-blush-400 focus:ring-offset-2
                ${isSelected 
                  ? 'scale-105 shadow-lg' 
                  : 'hover:scale-102 shadow-md hover:shadow-lg'
                }
              `}
              style={{ backgroundColor: mood.color }}
              data-testid={`mood-${mood.key.toLowerCase()}`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl sm:text-6xl" aria-hidden="true">
                  {mood.icon}
                </span>
              </div>
              
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blush-400 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
              
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <span className="text-xs sm:text-sm font-medium text-warm-gray-800 drop-shadow-sm">
                  {mood.key}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
