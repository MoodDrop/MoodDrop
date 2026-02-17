import React, { useMemo } from "react";

type Particle = {
  left: string;
  top: string;
  size: number; // px
  blur: number; // px
  opacity: number;
  duration: number; // s
  delay: number; // s
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function SoftReadsAtmosphere({
  density = 10,
}: {
  density?: number;
}) {
  const particles = useMemo<Particle[]>(() => {
    // deterministic-ish per session without tracking: seed from current day
    const seed = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    let x = seed % 2147483647;

    const rand = () => {
      // simple LCG
      x = (x * 48271) % 2147483647;
      return x / 2147483647;
    };

    return Array.from({ length: clamp(density, 6, 14) }).map(() => {
      const size = 18 + rand() * 46; // 18–64px
      return {
        left: `${Math.floor(rand() * 90) + 5}%`,
        top: `${Math.floor(rand() * 90) + 5}%`,
        size,
        blur: 6 + rand() * 14, // 6–20px
        opacity: 0.08 + rand() * 0.12, // 0.08–0.20
        duration: 14 + rand() * 22, // 14–36s
        delay: rand() * 8, // 0–8s
      };
    });
  }, [density]);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Warm reading-room base wash (subtle, not a new theme) */}
      <div className="absolute inset-0 opacity-90 bg-[radial-gradient(circle_at_35%_18%,rgba(255,236,228,0.85),transparent_60%),radial-gradient(circle_at_70%_30%,rgba(255,220,232,0.55),transparent_55%),radial-gradient(circle_at_50%_85%,rgba(255,235,245,0.45),transparent_60%)]" />

      {/* Soft vignette (adds warmth + intimacy) */}
      <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_50%_50%,transparent_55%,rgba(255,230,236,0.45)_100%)]" />

      {/* Floating glow particles */}
      {particles.map((p, idx) => (
        <div
          key={idx}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            filter: `blur(${p.blur}px)`,
            opacity: p.opacity,
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(255,230,238,0.55), rgba(255,230,238,0.0) 70%)",
            animation: `mdSoftReadsFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* Keyframes (scoped via unique name) */}
      <style>{`
        @keyframes mdSoftReadsFloat {
          0%   { transform: translate3d(0, 0, 0) scale(1); }
          50%  { transform: translate3d(10px, -18px, 0) scale(1.03); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }
      `}</style>
    </div>
  );
}
