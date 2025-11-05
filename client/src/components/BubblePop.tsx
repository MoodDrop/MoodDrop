import { useEffect, useRef, useState } from 'react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  speedY: number;
}

export default function BubblePop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('bubblePop-highScore');
    return saved ? parseInt(saved) : 0;
  });
  const bubblesRef = useRef<Bubble[]>([]);
  const animationRef = useRef<number>();
  const bubbleIdRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout>();
  const popSoundRef = useRef<HTMLAudioElement | null>(null);

  const colors = ['#F9A8D4', '#FBCFE8', '#FDE68A', '#93C5FD', '#C4B5FD', '#FCA5A5'];

  // Initialize pop sound
  useEffect(() => {
    const audio = new Audio('/sounds/pop.mp3');
    audio.volume = 0.3;
    popSoundRef.current = audio;
  }, []);

  // Timer effect - uses refs to avoid dependency issues
  const scoreRef = useRef(score);
  const highScoreRef = useRef(highScore);
  
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  
  useEffect(() => {
    highScoreRef.current = highScore;
  }, [highScore]);

  useEffect(() => {
    if (gameOver) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          if (scoreRef.current > highScoreRef.current) {
            setHighScore(scoreRef.current);
            localStorage.setItem('bubblePop-highScore', scoreRef.current.toString());
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create initial bubbles
    const createBubble = (): Bubble => {
      const radius = 20 + Math.random() * 30;
      return {
        id: bubbleIdRef.current++,
        x: radius + Math.random() * (canvas.width - radius * 2),
        y: canvas.height + radius,
        radius,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: -0.8 - Math.random() * 1.2 // Slower and more manageable: -0.8 to -2.0
      };
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new bubbles periodically (balanced spawn rate)
      if (Math.random() < 0.03 && bubblesRef.current.length < 15) {
        bubblesRef.current.push(createBubble());
      }

      // Update and draw bubbles
      bubblesRef.current = bubblesRef.current
        .map(bubble => ({
          ...bubble,
          y: bubble.y + bubble.speedY
        }))
        .filter(bubble => bubble.y + bubble.radius > 0); // Remove bubbles that went off screen

      bubblesRef.current.forEach(bubble => {
        // Draw bubble
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.fill();
        
        // Add shine effect
        ctx.beginPath();
        ctx.arc(bubble.x - bubble.radius / 3, bubble.y - bubble.radius / 3, bubble.radius / 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameOver]);

  const handlePointerEvent = (clientX: number, clientY: number) => {
    if (gameOver) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    let popped = false;
    bubblesRef.current = bubblesRef.current.filter(bubble => {
      const distance = Math.sqrt((x - bubble.x) ** 2 + (y - bubble.y) ** 2);
      if (distance <= bubble.radius && !popped) {
        popped = true;
        setScore(s => s + 1);
        
        // Play pop sound
        if (popSoundRef.current) {
          popSoundRef.current.currentTime = 0;
          popSoundRef.current.play().catch(() => {
            // Ignore errors if sound fails to play
          });
        }
        
        return false;
      }
      return true;
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handlePointerEvent(e.clientX, e.clientY);
  };

  const handleTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handlePointerEvent(touch.clientX, touch.clientY);
    }
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    bubblesRef.current = [];
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-purple-50 rounded-2xl p-6" data-testid="game-bubble-pop">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold text-warm-gray-800">Bubble Pop</h3>
          <p className="text-sm text-warm-gray-600">Tap the bubbles to relieve stress</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white rounded-xl px-4 py-2 shadow-sm">
            <div className="text-xs text-warm-gray-600">Time</div>
            <div className="text-2xl font-bold text-blush-400" data-testid="bubble-timer">{timeLeft}s</div>
          </div>
          <div className="bg-white rounded-xl px-4 py-2 shadow-sm">
            <div className="text-xs text-warm-gray-600">Score</div>
            <div className="text-2xl font-bold text-blush-400" data-testid="bubble-score">{score}</div>
          </div>
        </div>
      </div>
      
      {gameOver ? (
        <div className="w-full h-80 bg-gradient-to-b from-sky-100 to-indigo-100 rounded-xl flex flex-col items-center justify-center" data-testid="bubble-game-over">
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
            data-testid="button-play-again"
          >
            Play Again
          </button>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          onClick={handleClick}
          onTouchStart={handleTouch}
          className="w-full h-80 bg-gradient-to-b from-sky-100 to-indigo-100 rounded-xl cursor-pointer shadow-inner touch-none"
          data-testid="bubble-canvas"
        />
      )}
      
      <p className="text-xs text-center text-warm-gray-500 mt-3">
        💡 Tip: Pop as many bubbles as you can in 30 seconds!
      </p>
    </div>
  );
}
