export default function GardenIllustration() {
  return (
    <div className="relative w-32 h-32 mx-auto mb-6">
      {/* Circle background with arrow */}
      <svg className="w-32 h-32 absolute inset-0 text-warm-gray-300" fill="currentColor" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" opacity="0.2" />
        <path d="M50 20 L50 45 M35 35 L50 45 L65 35" stroke="currentColor" strokeWidth="3" fill="none" />
      </svg>

      {/* Animated Flowers - positioned inside the circle */}
      <svg className="w-32 h-32 absolute inset-0" viewBox="0 0 100 100">
        {/* Left Flower - Blush Pink */}
        <g className="animate-flower-grow" style={{ transformOrigin: '30px 65px', animationDelay: '0.2s' }}>
          <path d="M30 65 Q30 55 30 50" stroke="#86EFAC" strokeWidth="2" fill="none" />
          <circle cx="30" cy="50" r="4" fill="#F9A8D4" opacity="0.9" />
          <circle cx="26" cy="52" r="3.5" fill="#FBCFE8" opacity="0.8" />
          <circle cx="34" cy="52" r="3.5" fill="#FBCFE8" opacity="0.8" />
          <circle cx="30" cy="56" r="3.5" fill="#FBCFE8" opacity="0.8" />
          <circle cx="30" cy="51" r="2" fill="#FEF3C7" opacity="0.9" />
        </g>

        {/* Center Flower - Cream/Peach */}
        <g className="animate-flower-grow" style={{ transformOrigin: '50px 70px', animationDelay: '0s' }}>
          <path d="M50 70 Q50 62 50 58" stroke="#86EFAC" strokeWidth="2.5" fill="none" />
          <circle cx="50" cy="58" r="5" fill="#FBBF24" opacity="0.9" />
          <circle cx="45" cy="60" r="4" fill="#FDE68A" opacity="0.8" />
          <circle cx="55" cy="60" r="4" fill="#FDE68A" opacity="0.8" />
          <circle cx="50" cy="64" r="4" fill="#FDE68A" opacity="0.8" />
          <circle cx="50" cy="59" r="2.5" fill="#FEF3C7" opacity="0.95" />
        </g>

        {/* Right Flower - Soft Nude/Rose */}
        <g className="animate-flower-grow" style={{ transformOrigin: '70px 62px', animationDelay: '0.4s' }}>
          <path d="M70 62 Q70 54 70 50" stroke="#86EFAC" strokeWidth="2" fill="none" />
          <circle cx="70" cy="50" r="4" fill="#FDA4AF" opacity="0.9" />
          <circle cx="66" cy="52" r="3.5" fill="#FECDD3" opacity="0.8" />
          <circle cx="74" cy="52" r="3.5" fill="#FECDD3" opacity="0.8" />
          <circle cx="70" cy="56" r="3.5" fill="#FECDD3" opacity="0.8" />
          <circle cx="70" cy="51" r="2" fill="#FEF3C7" opacity="0.9" />
        </g>

        {/* Small buds for extra detail */}
        <g className="animate-flower-grow" style={{ transformOrigin: '40px 68px', animationDelay: '0.6s' }}>
          <circle cx="40" cy="68" r="2.5" fill="#D4F1F4" opacity="0.7" />
        </g>
        <g className="animate-flower-grow" style={{ transformOrigin: '60px 68px', animationDelay: '0.7s' }}>
          <circle cx="60" cy="68" r="2.5" fill="#D4F1F4" opacity="0.7" />
        </g>

        {/* Leaves - Sage Green */}
        <g className="animate-leaf-sway" style={{ transformOrigin: '35px 62px' }}>
          <ellipse cx="35" cy="62" rx="6" ry="3" fill="#86EFAC" opacity="0.6" transform="rotate(-30 35 62)" />
        </g>
        <g className="animate-leaf-sway" style={{ transformOrigin: '65px 65px', animationDelay: '0.3s' }}>
          <ellipse cx="65" cy="65" rx="6" ry="3" fill="#86EFAC" opacity="0.6" transform="rotate(30 65 65)" />
        </g>
      </svg>

      <style>{`
        @keyframes flower-grow {
          0% {
            opacity: 0;
            transform: scale(0) translateY(10px);
          }
          60% {
            transform: scale(1.1) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes leaf-sway {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }

        .animate-flower-grow {
          animation: flower-grow 1.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        .animate-leaf-sway {
          animation: leaf-sway 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
