import { useState, useEffect, useRef } from "react";
import { Sparkles, Timer } from "lucide-react";

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJIS = ["🌸", "🌺", "🌼", "🌻", "🌷", "🌹", "🪷", "🏵️"];
const TIMER_DURATION = 20; // seconds

export default function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeGame();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (matches === EMOJIS.length && !gameOver) {
      setGameWon(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [matches, gameOver]);

  useEffect(() => {
    if (gameOver || gameWon) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [cards, gameOver, gameWon]);

  const initializeGame = () => {
    const shuffledCards = [...EMOJIS, ...EMOJIS]
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
    setGameOver(false);
    setIsChecking(false);
    setTimeLeft(TIMER_DURATION);
  };

  const handleCardClick = (index: number) => {
    if (
      isChecking ||
      gameOver ||
      gameWon ||
      cards[index].isFlipped ||
      cards[index].isMatched ||
      flippedIndices.length >= 2
    ) {
      return;
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      setIsChecking(true);

      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].isMatched = true;
          matchedCards[second].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          setMatches(matches + 1);
          setIsChecking(false);
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto" data-testid="game-memory-match">
      {/* Game Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-warm-gray-700">
            Memory Match
          </h3>
          {/* Timer */}
          <div 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              timeLeft <= 5 && !gameOver && !gameWon
                ? "bg-red-100 text-red-700 animate-pulse"
                : "bg-cream-100 text-warm-gray-700"
            }`}
            data-testid="memory-timer"
          >
            <Timer size={18} />
            <span>{timeLeft}s</span>
          </div>
        </div>
        <div className="flex justify-center gap-6 text-sm text-warm-gray-600">
          <span data-testid="memory-moves">Moves: {moves}</span>
          <span data-testid="memory-matches">Matches: {matches}/{EMOJIS.length}</span>
        </div>
      </div>

      {/* Win Message */}
      {gameWon && (
        <div className="mb-6 p-6 bg-gradient-to-br from-blush-50 to-cream-50 border-2 border-blush-200 rounded-2xl text-center animate-in fade-in duration-500">
          <Sparkles className="inline-block text-blush-400 mb-2" size={32} />
          <h4 className="text-lg font-semibold text-warm-gray-700 mb-2">
            Wonderful! 🎉
          </h4>
          <p className="text-warm-gray-600 mb-4">
            You completed the game in {moves} moves with {timeLeft} seconds remaining!
          </p>
          <button
            onClick={initializeGame}
            className="bg-blush-300 hover:bg-blush-400 text-white px-6 py-2 rounded-xl transition"
            data-testid="button-play-again"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Game Over Message */}
      {gameOver && (
        <div className="mb-6 p-6 bg-gradient-to-br from-cream-50 to-blush-50 border-2 border-cream-200 rounded-2xl text-center animate-in fade-in duration-500">
          <div className="text-4xl mb-3">⏳</div>
          <h4 className="text-lg font-semibold text-warm-gray-700 mb-2">
            Time's up — want to try again?
          </h4>
          <p className="text-warm-gray-600 mb-4">
            You matched {matches} out of {EMOJIS.length} pairs!
          </p>
          <button
            onClick={initializeGame}
            className="bg-blush-300 hover:bg-blush-400 text-white px-6 py-2 rounded-xl transition"
            data-testid="button-restart-memory"
          >
            Restart
          </button>
        </div>
      )}

      {/* Game Grid */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-6">
        {cards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(index)}
            disabled={card.isMatched || card.isFlipped || isChecking || gameOver || gameWon}
            className={`
              aspect-square rounded-xl transition-all duration-300 transform
              ${
                card.isFlipped || card.isMatched
                  ? "bg-gradient-to-br from-blush-100 to-cream-100 scale-105"
                  : "bg-cream-200 hover:bg-cream-300 hover:scale-105"
              }
              ${card.isMatched ? "opacity-60" : ""}
              ${gameOver ? "opacity-50 cursor-not-allowed" : ""}
              disabled:cursor-not-allowed
              shadow-md hover:shadow-lg
              flex items-center justify-center
            `}
            data-testid={`memory-card-${index}`}
          >
            <span className={`text-4xl transition-opacity duration-300 ${
              card.isFlipped || card.isMatched ? "opacity-100" : "opacity-0"
            }`}>
              {card.emoji}
            </span>
            <span className={`text-2xl absolute transition-opacity duration-300 ${
              card.isFlipped || card.isMatched ? "opacity-0" : "opacity-100"
            }`}>
              ❓
            </span>
          </button>
        ))}
      </div>

      {/* Reset Button */}
      <div className="text-center">
        <button
          onClick={initializeGame}
          className="text-sm text-warm-gray-600 hover:text-warm-gray-800 transition underline"
          data-testid="button-reset-memory"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}
