import { Flame, Trophy } from "lucide-react";

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
}

export default function StreakDisplay({ currentStreak, longestStreak }: StreakDisplayProps) {
  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Start your journey today!";
    if (streak === 1) return "Great start! Keep it going!";
    if (streak < 7) return "You're building momentum!";
    if (streak < 30) return "Amazing consistency!";
    if (streak < 100) return "You're on fire!";
    return "Legendary dedication!";
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 shadow-lg" data-testid="streak-display">
      <h3 className="text-lg font-semibold text-warm-gray-800 mb-4">Your Streak</h3>
      
      <div className="flex items-center justify-around gap-6 mb-4">
        {/* Current Streak */}
        <div className="text-center">
          <div className="relative inline-block">
            <Flame 
              className={`w-16 h-16 ${currentStreak > 0 ? 'text-orange-500' : 'text-gray-300'}`} 
              fill={currentStreak > 0 ? 'currentColor' : 'none'}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white drop-shadow-lg" data-testid="text-current-streak">
                {currentStreak}
              </span>
            </div>
          </div>
          <p className="text-sm text-warm-gray-600 mt-2">Current</p>
        </div>

        {/* Longest Streak */}
        <div className="text-center">
          <div className="relative inline-block">
            <Trophy 
              className={`w-16 h-16 ${longestStreak > 0 ? 'text-amber-500' : 'text-gray-300'}`}
              fill={longestStreak > 0 ? 'currentColor' : 'none'}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white drop-shadow-lg" data-testid="text-longest-streak">
                {longestStreak}
              </span>
            </div>
          </div>
          <p className="text-sm text-warm-gray-600 mt-2">Best</p>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="text-center">
        <p className="text-sm font-medium text-warm-gray-700" data-testid="text-streak-message">
          {getStreakMessage(currentStreak)}
        </p>
      </div>

      {/* Streak Info */}
      {currentStreak > 0 && (
        <div className="mt-4 pt-4 border-t border-orange-200">
          <p className="text-xs text-warm-gray-500 text-center">
            {currentStreak === 1 
              ? "Share again tomorrow to keep your streak alive!"
              : `You've shared for ${currentStreak} day${currentStreak !== 1 ? 's' : ''} in a row!`
            }
          </p>
        </div>
      )}
    </div>
  );
}
