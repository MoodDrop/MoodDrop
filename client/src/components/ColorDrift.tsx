import { useState, useEffect, useRef } from 'react';

interface ColorOrb {
  id: number;
  color: string;
  name: string;
}

const COLORS = [
  { color: '#F9A8D4', name: 'Blush Pink' },
  { color: '#FBCFE8', name: 'Soft Pink' },
  { color: '#FDE68A', name: 'Warm Yellow' },
  { color: '#93C5FD', name: 'Sky Blue' },
  { color: '#C4B5FD', name: 'Lavender' },
  { color: '#86EFAC', name: 'Sage Green' }
];

export default function ColorDrift() {
  const [targetColor, setTargetColor] = useState(COLORS[0]);
  const [orbs, setOrbs] = useState<ColorOrb[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('colorDrift-highScore');
    return saved ? parseInt(saved) : 0;
  });
  const timerRef = useRef<NodeJS.Timeout>();

  // Timer effect
  useEffect(() => {
    if (gameOver) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('colorDrift-highScore', score.toString());
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameOver, score, highScore]);

  useEffect(() => {
    if (!gameOver) {
      generateNewRound();
    }
  }, [gameOver]);

  const generateNewRound = () => {
    const target = COLORS[Math.floor(Math.random() * COLORS.length)];
    setTargetColor(target);

    // Generate 3 random orbs including the target
    const shuffledColors = [...COLORS].sort(() => Math.random() - 0.5).slice(0, 3);
    if (!shuffledColors.find(c => c.color === target.color)) {
      shuffledColors[0] = target;
    }
    
    setOrbs(
      shuffledColors
        .sort(() => Math.random() - 0.5)
        .map((color, i) => ({ id: i, ...color }))
    );
    setFeedback('');
  };

  const handleOrbClick = (orb: ColorOrb) => {
    if (gameOver) return;
    
    if (orb.color === targetColor.color) {
      setScore(s => s + 1);
      setFeedback('✨ Perfect match!');
      setTimeout(() => {
        if (!gameOver) {
          generateNewRound();
        }
      }, 800);
    } else {
      setFeedback('💫 Try again');
      setTimeout(() => setFeedback(''), 1000);
    }
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setFeedback('');
    generateNewRound();
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6" data-testid="game-color-drift">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-warm-gray-800">Color Drift</h3>
          <p className="text-sm text-warm-gray-600">Match the colors to find calm</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white rounded-xl px-4 py-2 shadow-sm">
            <div className="text-xs text-warm-gray-600">Time</div>
            <div className="text-2xl font-bold text-blush-400" data-testid="color-timer">{timeLeft}s</div>
          </div>
          <div className="bg-white rounded-xl px-4 py-2 shadow-sm">
            <div className="text-xs text-warm-gray-600">Score</div>
            <div className="text-2xl font-bold text-blush-400" data-testid="color-score">{score}</div>
          </div>
        </div>
      </div>

      {gameOver ? (
        <div className="bg-white rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px]" data-testid="color-game-over">
          <div className="text-6xl mb-4">🎉</div>
          <h4 className="text-2xl font-bold text-warm-gray-800 mb-2">Time's Up!</h4>
          <p className="text-3xl font-bold text-blush-400 mb-2">Score: {score}</p>
          {score > 0 && score === highScore && (
            <p className="text-sm text-green-600 font-semibold mb-4">🏆 New High Score!</p>
          )}
          <p className="text-sm text-warm-gray-600 mb-6">High Score: {highScore}</p>
          <button
            onClick={restartGame}
            className="px-6 py-3 bg-blush-400 hover:bg-blush-500 text-white rounded-xl font-medium transition-colors"
            data-testid="button-color-play-again"
          >
            Play Again
          </button>
        </div>
      ) : (
        <>
          {/* Target Color */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <p className="text-sm text-warm-gray-600 mb-3 text-center">Find this color:</p>
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-24 h-24 rounded-full shadow-lg transition-transform hover:scale-105"
                style={{ backgroundColor: targetColor.color }}
                data-testid="target-color"
              />
              <p className="text-lg font-semibold text-warm-gray-700">{targetColor.name}</p>
            </div>
          </div>

          {/* Color Orbs */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {orbs.map((orb) => (
              <button
                key={orb.id}
                onClick={() => handleOrbClick(orb)}
                className="group relative"
                data-testid={`orb-${orb.id}`}
              >
                <div
                  className="w-full aspect-square rounded-2xl shadow-md transition-all group-hover:shadow-xl group-hover:scale-105"
                  style={{ backgroundColor: orb.color }}
                />
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>

          {/* Feedback */}
          <div className="h-8 flex items-center justify-center">
            {feedback && (
              <p className={`text-sm font-medium animate-in fade-in zoom-in duration-300 ${
                feedback.includes('Perfect') ? 'text-green-600' : 'text-blush-500'
              }`} data-testid="color-feedback">
                {feedback}
              </p>
            )}
          </div>
        </>
      )}

      <p className="text-xs text-center text-warm-gray-500 mt-2">
        💡 Tip: Match as many colors as you can in 30 seconds!
      </p>
    </div>
  );
}
