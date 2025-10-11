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
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const animationRef = useRef<number>();
  const bubbleIdRef = useRef(0);

  const colors = ['#F9A8D4', '#FBCFE8', '#FDE68A', '#93C5FD', '#C4B5FD', '#FCA5A5'];

  useEffect(() => {
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
    const createBubble = () => {
      const radius = 20 + Math.random() * 30;
      return {
        id: bubbleIdRef.current++,
        x: radius + Math.random() * (canvas.width - radius * 2),
        y: canvas.height + radius,
        radius,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: -1 - Math.random() * 2
      };
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new bubbles periodically
      if (Math.random() < 0.03 && bubbles.length < 15) {
        setBubbles(prev => [...prev, createBubble()]);
      }

      // Update and draw bubbles
      setBubbles(prevBubbles => {
        const updatedBubbles = prevBubbles
          .map(bubble => ({
            ...bubble,
            y: bubble.y + bubble.speedY
          }))
          .filter(bubble => bubble.y + bubble.radius > 0); // Remove bubbles that went off screen

        updatedBubbles.forEach(bubble => {
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

        return updatedBubbles;
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
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setBubbles(prevBubbles => {
      let popped = false;
      const remaining = prevBubbles.filter(bubble => {
        const distance = Math.sqrt((x - bubble.x) ** 2 + (y - bubble.y) ** 2);
        if (distance <= bubble.radius && !popped) {
          popped = true;
          setScore(s => s + 1);
          return false;
        }
        return true;
      });
      return remaining;
    });
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-purple-50 rounded-2xl p-6" data-testid="game-bubble-pop">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold text-warm-gray-800">Bubble Pop</h3>
          <p className="text-sm text-warm-gray-600">Tap the bubbles to relieve stress</p>
        </div>
        <div className="bg-white rounded-xl px-4 py-2 shadow-sm">
          <div className="text-xs text-warm-gray-600">Score</div>
          <div className="text-2xl font-bold text-blush-400" data-testid="bubble-score">{score}</div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        className="w-full h-80 bg-gradient-to-b from-sky-100 to-indigo-100 rounded-xl cursor-pointer shadow-inner"
        data-testid="bubble-canvas"
      />
      <p className="text-xs text-center text-warm-gray-500 mt-3">
        💡 Tip: Click the floating bubbles as they rise
      </p>
    </div>
  );
}
