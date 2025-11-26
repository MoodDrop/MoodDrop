import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

// Floating Petal Component
function FloatingPetal({
  delay,
  left,
  size,
}: {
  delay: number;
  left: string;
  size: number;
}) {
  return (
    <div
      className="absolute animate-float opacity-60"
      style={{
        left,
        animationDelay: `${delay}s`,
        animationDuration: `${8 + Math.random() * 4}s`,
        bottom: "-20px",
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
  const [location] = useLocation();
  const [petals, setPetals] = useState<
    Array<{ id: number; left: string; delay: number; size: number }>
  >([]);
  const isHomePage = location === "/";

  useEffect(() => {
    const newPetals = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 90 + 5}%`,
      delay: Math.random() * 5,
      size: 20 + Math.random() * 15,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <footer className="bg-gradient-to-br from-blush-100 to-[#E8D5C4] px-6 py-12 mt-auto relative overflow-hidden">
      {/* Floating petals */}
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

      <div className="max-w-4xl mx-auto relative z-10 text-center space-y-4 footer-content">
        {/* Shared tagline */}
        <p className="text-sm text-[#8B7355] leading-relaxed">
          A quiet space to breathe, release, and reset.
        </p>

        {isHomePage ? (
          <>
            {/* Home: short reassurance */}
            <p className="text-sm text-[#8B7355] leading-relaxed">
              Your words are safe — always private, always anonymous.
            </p>
          </>
        ) : (
          <>
            {/* Other pages: disclaimer + numbers */}
            <div className="space-y-4 mt-2">
              <div>
                <h3 className="text-base font-semibold text-[#8B7355] mb-2">
                  Disclaimer
                </h3>
                <p className="text-sm text-[#8B7355] leading-relaxed">
                  MoodDrop is designed for emotional release and calm reflection.
                  It is not a substitute for professional mental health support.
                  If you are in crisis, please reach out for help immediately.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-[#8B7355] mb-2">
                  Important Numbers
                </h3>
                <div className="text-sm text-[#8B7355] leading-relaxed space-y-1">
                  <p>
                    📞 National Suicide &amp; Crisis Lifeline (US):{" "}
                    <strong>988</strong>
                  </p>
                  <p>
                    🌍 International helplines:{" "}
                    <a
                      href="https://findahelpline.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D4AF37] hover:text-[#F9A8D4] transition-colors underline"
                    >
                      findahelpline.com
                    </a>
                  </p>
                  <p>
                    💬 Crisis Text Line (US/Canada): text{" "}
                    <strong>HELLO</strong> to <strong>741741</strong>.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Centered brand + year */}
        <div className="pt-2">
          <p className="text-xs font-medium text-[#8B7355]">
            MoodDrop © 2025
          </p>
        </div>

        {/* Horizontal nav row like your sketch */}
        <nav className="flex flex-wrap items-center justify-center gap-2 text-sm text-[#8B7355]">
          <Link
            href="/about"
            className="hover:text-[#F9A8D4] transition-colors duration-300 cursor-pointer"
          >
            About MoodDrop
          </Link>

          <span className="mx-1 text-[#A08B73]">|</span>

          <Link
            href="/qa"
            className="hover:text-[#F9A8D4] transition-colors duration-300 cursor-pointer"
          >
            Q&amp;A
          </Link>

          <span className="mx-1 text-[#A08B73]">|</span>

          <Link
            href="/privacy"
            className="hover:text-[#F9A8D4] transition-colors duration-300 cursor-pointer"
          >
            Privacy
          </Link>

          <span className="mx-1 text-[#A08B73]">|</span>

          <Link
            href="/contact"
            className="hover:text-[#F9A8D4] transition-colors duration-300 cursor-pointer"
          >
            Contact
          </Link>
        </nav>
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

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .footer-content {
          animation: fadeInUp 0.8s ease-out 150ms both;
        }

        @media (prefers-reduced-motion: reduce) {
          .footer-content {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </footer>
  );
}
