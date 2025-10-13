import { useEffect, useState } from 'react';

// Floating Petal Component
function FloatingPetal({ delay, left, size }: { delay: number; left: string; size: number }) {
  return (
    <div
      className="absolute animate-float opacity-60"
      style={{
        left,
        animationDelay: `${delay}s`,
        animationDuration: `${8 + Math.random() * 4}s`, // 8-12 seconds
        bottom: '-20px',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 3C12 3 8 6 8 10C8 12.2091 9.79086 14 12 14C14.2091 14 16 12.2091 16 10C16 6 12 3 12 3Z"
          fill="#F9A8D4"
          opacity="0.7"
        />
        <path
          d="M12 14C12 14 9 16 9 19C9 20.6569 10.3431 22 12 22C13.6569 22 15 20.6569 15 19C15 16 12 14 12 14Z"
          fill="#FBCFE8"
          opacity="0.7"
        />
        <path
          d="M12 14C12 14 15 11 19 11C20.6569 11 22 12.3431 22 14C22 15.6569 20.6569 17 19 17C15 17 12 14 12 14Z"
          fill="#E8C5C9"
          opacity="0.7"
        />
        <path
          d="M12 14C12 14 9 11 5 11C3.34315 11 2 12.3431 2 14C2 15.6569 3.34315 17 5 17C9 17 12 14 12 14Z"
          fill="#F0D9D7"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}

export default function Footer() {
  const [petals, setPetals] = useState<Array<{ id: number; left: string; delay: number; size: number }>>([]);

  useEffect(() => {
    // Generate random petals
    const newPetals = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 90 + 5}%`, // 5-95% from left
      delay: Math.random() * 5, // 0-5 seconds delay
      size: 20 + Math.random() * 15, // 20-35px
    }));
    setPetals(newPetals);
  }, []);

  return (
    <footer className="bg-blush-50 px-6 py-12 mt-auto relative overflow-hidden">
      {/* Floating Petals Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {petals.map((petal) => (
          <FloatingPetal
            key={petal.id}
            delay={petal.delay}
            left={petal.left}
            size={petal.size}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Tagline */}
        <div className="text-center space-y-2">
          <p className="text-sm font-semibold text-warm-gray-700">
            💧 MoodDrop
          </p>
          <p className="text-sm text-warm-gray-600">
            A quiet space to breathe, release, and reset.
          </p>
          <p className="text-sm text-warm-gray-600">
            Your words are safe — always private, always anonymous.
          </p>
          <p className="text-xs text-warm-gray-500 pt-2">
            © 2025 MoodDrop 🌸
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100vh) rotate(180deg);
            opacity: 0;
          }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </footer>
  );
}
