import { useState, useEffect, useRef } from 'react';

interface ColorOrb {
  id: number;
  color: string;
  name: string;
  shape: 'circle' | 'square' | 'triangle' | 'star';
}

const COLORS = [
  { color: '#F9A8D4', name: 'Blush Pink' },
  { color: '#FBCFE8', name: 'Soft Pink' },
  { color: '#FDE68A', name: 'Warm Yellow' },
  { color: '#93C5FD', name: 'Sky Blue' },
  { color: '#C4B5FD', name: 'Lavender' },
  { color: '#86EFAC', name: 'Sage Green' }
];

const SHAPES: Array<'circle' | 'square' | 'triangle' | 'star'> = ['circle', 'square', 'triangle', 'star'];

// Shape Component
function Shape({ color, shape, size = 'w-full h-full' }: { color: string; shape: string; size?: string }) {
  if (shape === 'circle') {
    return (
      <div
        className={`${size} rounded-full`}
        style={{ backgroundColor: color }}
      />
    );
  }
  
  if (shape === 'square') {
    return (
      <div
        className={`${size} rounded-lg`}
        style={{ backgroundColor: color }}
      />
    );
  }
  
  if (shape === 'triangle') {
    return (
      <div className={`${size} flex items-center justify-center`}>
        <div
          className="w-0 h-0"
          style={{
            borderLeft: '50px solid transparent',
            borderRight: '50px solid transparent',
            borderBottom: `86px solid ${color}`,
          }}
        />
      </div>
    );
  }
  
  if (shape === 'star') {
    return (
      <div className={`${size} flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon
            points="50,10 61,35 88,35 67,52 77,77 50,60 23,77 33,52 12,35 39,35"
            fill={color}
          />
        </svg>
      </div>
    );
  }
  
  return null;
}

export default function ColorDrift() {
  const [targetOrb, setTargetOrb] = useState<ColorOrb>({ id: 0, ...COLORS[0], shape: 'circle' });
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
    // Create target with random color and shape
    const targetColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const targetShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const target: ColorOrb = { id: 0, ...targetColor, shape: targetShape };
    setTargetOrb(target);

    // Generate 3 orbs including the target
    const newOrbs: ColorOrb[] = [target];
    
    // Add 2 more random orbs (different from target)
    while (newOrbs.length < 3) {
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const newOrb: ColorOrb = { 
        id: newOrbs.length, 
        ...randomColor, 
        shape: randomShape 
      };
      
      // Make sure it's different from target (either color or shape must be different)
      if (newOrb.color !== target.color || newOrb.shape !== target.shape) {
        newOrbs.push(newOrb);
      }
    }
    
    // Shuffle orbs and update IDs
    const shuffled = newOrbs
      .sort(() => Math.random() - 0.5)
      .map((orb, i) => ({ ...orb, id: i }));
    
    setOrbs(shuffled);
    setFeedback('');
  };

  const handleOrbClick = (orb: ColorOrb) => {
    if (gameOver) return;
    
    if (orb.color === targetOrb.color && orb.shape === targetOrb.shape) {
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

  const getShapeName = (shape: string) => {
    return shape.charAt(0).toUpperCase() + shape.slice(1);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6" data-testid="game-color-drift">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-warm-gray-800">Color Drift</h3>
          <p className="text-sm text-warm-gray-600">Match the color and shape to find calm</p>
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
          {/* Target Shape & Color */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <p className="text-sm text-warm-gray-600 mb-3 text-center">Find this color and shape:</p>
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24">
                <Shape color={targetOrb.color} shape={targetOrb.shape} />
              </div>
              <p className="text-lg font-semibold text-warm-gray-700">
                {targetOrb.name} {getShapeName(targetOrb.shape)}
              </p>
            </div>
          </div>

          {/* Shape Orbs */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {orbs.map((orb) => (
              <button
                key={orb.id}
                onClick={() => handleOrbClick(orb)}
                className="group relative p-4 bg-white rounded-2xl shadow-md transition-all hover:shadow-xl hover:scale-105"
                data-testid={`orb-${orb.id}`}
              >
                <div className="w-full aspect-square">
                  <Shape color={orb.color} shape={orb.shape} />
                </div>
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
        💡 Tip: Match both color AND shape in 30 seconds!
      </p>
    </div>
  );
}
