// client/src/pages/calm-gentle-play.tsx

import React from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

type GentlePlayMode =
  | "light-garden"
  | "glow-trail"
  | "sand-sweep"
  | null;

type LightPoint = {
  id: number;
  x: number;
  y: number;
  size: number;
};

type SandParticle = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
};

export default function CalmGentlePlayPage() {
  const [activeGame, setActiveGame] =
    React.useState<GentlePlayMode>(null);

  const [lights, setLights] =
    React.useState<LightPoint[]>([]);

  const glowCanvasRef =
    React.useRef<HTMLCanvasElement | null>(null);

  const sandCanvasRef =
    React.useRef<HTMLCanvasElement | null>(null);

  const handleLightGardenClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect =
      event.currentTarget.getBoundingClientRect();

    setLights((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        size: 28 + Math.random() * 24,
      },
    ]);
  };

  React.useEffect(() => {
    if (
      activeGame !== "glow-trail" ||
      !glowCanvasRef.current
    )
      return;

    const canvas = glowCanvasRef.current;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let drawing = false;
    let animationFrameId = 0;

    const fade = () => {
      ctx.fillStyle =
        "rgba(76, 54, 95, 0.05)";

      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      animationFrameId =
        requestAnimationFrame(fade);
    };

    const drawGlow = (x: number, y: number) => {
      const gradient =
        ctx.createRadialGradient(
          x,
          y,
          0,
          x,
          y,
          24
        );

      gradient.addColorStop(
        0,
        "rgba(255, 227, 214, 0.86)"
      );

      gradient.addColorStop(
        0.42,
        "rgba(255, 205, 195, 0.4)"
      );

      gradient.addColorStop(
        1,
        "rgba(255, 205, 195, 0)"
      );

      ctx.fillStyle = gradient;

      ctx.beginPath();

      ctx.arc(x, y, 24, 0, Math.PI * 2);

      ctx.fill();
    };

    const getCoords = (e: PointerEvent) => {
      const rect =
        canvas.getBoundingClientRect();

      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleDown = (e: PointerEvent) => {
      drawing = true;

      const { x, y } = getCoords(e);

      drawGlow(x, y);
    };

    const handleMove = (e: PointerEvent) => {
      if (!drawing) return;

      const { x, y } = getCoords(e);

      drawGlow(x, y);
    };

    const handleUp = () => {
      drawing = false;
    };

    fade();

    canvas.addEventListener(
      "pointerdown",
      handleDown
    );

    canvas.addEventListener(
      "pointermove",
      handleMove
    );

    canvas.addEventListener(
      "pointerup",
      handleUp
    );

    canvas.addEventListener(
      "pointerleave",
      handleUp
    );

    canvas.addEventListener(
      "pointercancel",
      handleUp
    );

    return () => {
      cancelAnimationFrame(animationFrameId);

      canvas.removeEventListener(
        "pointerdown",
        handleDown
      );

      canvas.removeEventListener(
        "pointermove",
        handleMove
      );

      canvas.removeEventListener(
        "pointerup",
        handleUp
      );

      canvas.removeEventListener(
        "pointerleave",
        handleUp
      );

      canvas.removeEventListener(
        "pointercancel",
        handleUp
      );
    };
  }, [activeGame]);

  React.useEffect(() => {
    if (
      activeGame !== "sand-sweep" ||
      !sandCanvasRef.current
    )
      return;

    const canvas = sandCanvasRef.current;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: SandParticle[] =
      Array.from({ length: 1400 }).map(() => {
        const x =
          Math.random() * canvas.width;

        const y =
          Math.random() * canvas.height;

        return {
          x,
          y,
          baseX: x,
          baseY: y,
        };
      });

    let mouseX = -9999;
    let mouseY = -9999;
    let animationFrameId = 0;

    const draw = () => {
      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      particles.forEach((p) => {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;

        const dist = Math.sqrt(
          dx * dx + dy * dy
        );

        if (dist < 46) {
          const force =
            (46 - dist) / 46;

          p.x +=
            (dx / (dist || 1)) *
            force *
            7;

          p.y +=
            (dy / (dist || 1)) *
            force *
            7;
        }

        p.x +=
          (p.baseX - p.x) * 0.03;

        p.y +=
          (p.baseY - p.y) * 0.03;

        ctx.fillStyle =
          "rgba(219, 179, 158, 0.72)";

        ctx.fillRect(p.x, p.y, 2, 2);
      });

      animationFrameId =
        requestAnimationFrame(draw);
    };

    const handleMove = (e: PointerEvent) => {
      const rect =
        canvas.getBoundingClientRect();

      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    canvas.addEventListener(
      "pointermove",
      handleMove
    );

    canvas.addEventListener(
      "pointerleave",
      handleLeave
    );

    canvas.addEventListener(
      "pointerup",
      handleLeave
    );

    canvas.addEventListener(
      "pointercancel",
      handleLeave
    );

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);

      canvas.removeEventListener(
        "pointermove",
        handleMove
      );

      canvas.removeEventListener(
        "pointerleave",
        handleLeave
      );

      canvas.removeEventListener(
        "pointerup",
        handleLeave
      );

      canvas.removeEventListener(
        "pointercancel",
        handleLeave
      );
    };
  }, [activeGame]);

  const gameCards = [
    {
      id: "light-garden" as const,
      title: "Light Garden",
      description:
        "Place soft points of light and slowly fill the space with calm.",
    },

    {
      id: "glow-trail" as const,
      title: "Glow Trail",
      description:
        "Draw soft glowing trails that slowly fade away.",
    },

    {
      id: "sand-sweep" as const,
      title: "Sand Sweep",
      description:
        "Move shimmer grains and watch them slowly settle.",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#FFF9F5_0%,#FFF3EE_35%,#F8E0D9_100%)] px-4 py-8 text-[#7f5148]">
      <style>{`
        @keyframes softPulse {
          0%, 100% {
            opacity: .55;
            transform: scale(1);
          }

          50% {
            opacity: 1;
            transform: scale(1.12);
          }
        }

        @keyframes trailDrift {
          0% {
            transform: translateX(-18px);
            opacity: .25;
          }

          50% {
            opacity: .9;
          }

          100% {
            transform: translateX(18px);
            opacity: .25;
          }
        }

        @keyframes sandFloat {
          0%, 100% {
            transform: translateX(0px) translateY(0px);
            opacity: .45;
          }

          50% {
            transform: translateX(10px) translateY(-6px);
            opacity: .85;
          }
        }
      `}</style>

      <section className="mx-auto max-w-5xl">
        {/* Back */}
        <div className="mb-8">
          <Link href="/comfort">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/30 px-4 py-2 text-sm text-[#7f5148] shadow-sm backdrop-blur-md transition hover:bg-white/45"
            >
              <ArrowLeft size={16} />
              Back to Calm Studio
            </button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 flex min-h-[170px] flex-col items-center justify-center rounded-[2rem] border border-white/40 bg-white/35 px-6 py-8 text-center shadow-sm backdrop-blur-md">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#b98b80]">
            Calm Studio
          </p>

          <h1 className="mt-3 font-serif text-4xl text-[#7f5148]">
            Gentle Play
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-[#9b6c63]">
            Choose a quiet interaction for restless moments.
          </p>
        </div>

        {/* Cards */}
        {!activeGame && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {gameCards.map((game) => (
              <button
                key={game.id}
                type="button"
                onClick={() =>
                  setActiveGame(game.id)
                }
                className="group overflow-hidden rounded-[2rem] border border-white/45 bg-white/35 text-left shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/50 hover:shadow-md"
              >
                {/* Preview */}
                <div className="relative h-40 overflow-hidden">
                  {/* Light Garden */}
                  {game.id ===
                    "light-garden" && (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,223,150,.55),transparent_20%),linear-gradient(135deg,#332C59_0%,#4C3F78_55%,#6D557D_100%)]">
                      {[18, 42, 64, 82].map(
                        (left, index) => (
                          <span
                            key={left}
                            className="absolute rounded-full"
                            style={{
                              left: `${left}%`,
                              top: `${
                                28 + index * 11
                              }%`,
                              width: `${
                                10 + index * 3
                              }px`,
                              height: `${
                                10 + index * 3
                              }px`,
                              background:
                                "radial-gradient(circle, rgba(255,244,190,1), rgba(255,213,128,.35), transparent 72%)",
                              boxShadow:
                                "0 0 18px rgba(255,223,140,.7), 0 0 34px rgba(255,223,140,.3)",
                              animation:
                                "softPulse 3.2s ease-in-out infinite",
                              animationDelay: `${
                                index * 0.45
                              }s`,
                            }}
                          />
                        )
                      )}
                    </div>
                  )}

                  {/* Glow Trail */}
                  {game.id ===
                    "glow-trail" && (
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,#F6DEE8_0%,#DCC4DD_48%,#BFA8D6_100%)]">
                      <svg
                        className="absolute inset-0 h-full w-full"
                        viewBox="0 0 100 60"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M8 36 C25 12, 38 48, 52 28 S74 12, 92 34"
                          fill="none"
                          stroke="rgba(255,249,240,.85)"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                          style={{
                            filter:
                              "drop-shadow(0 0 10px rgba(255,235,230,.8))",
                            animation:
                              "trailDrift 4s ease-in-out infinite",
                          }}
                        />
                      </svg>
                    </div>
                  )}

                  {/* Sand Sweep */}
                  {game.id ===
                    "sand-sweep" && (
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,#F1DDCF_0%,#E2C0AD_50%,#D7A994_100%)]">
                      {[12, 22, 34, 48, 61, 73, 85].map(
                        (left, index) => (
                          <span
                            key={left}
                            className="absolute rounded-full blur-[1px]"
                            style={{
                              left: `${left}%`,
                              top: `${
                                32 +
                                (index % 3) * 12
                              }%`,
                              width: "42px",
                              height: "8px",
                              background:
                                "rgba(255,246,225,.55)",
                              animation:
                                "sandFloat 4.4s ease-in-out infinite",
                              animationDelay: `${
                                index * 0.25
                              }s`,
                            }}
                          />
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-[#7f5148]">
                    {game.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#9b6c63]">
                    {game.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Back To Games */}
        {activeGame && (
          <button
            type="button"
            onClick={() =>
              setActiveGame(null)
            }
            className="mb-5 mt-2 inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/30 px-4 py-2 text-sm text-[#7f5148] shadow-sm backdrop-blur-md transition hover:bg-white/45"
          >
            <ArrowLeft size={16} />
            Back to Gentle Play
          </button>
        )}

        {/* Light Garden */}
        {activeGame ===
          "light-garden" && (
          <div
            onClick={
              handleLightGardenClick
            }
            className="relative min-h-[460px] cursor-pointer overflow-hidden rounded-[2rem] border border-white/40 bg-gradient-to-b from-[#231f3f] via-[#30295a] to-[#43346d] shadow-sm"
          >
            <div className="absolute left-1/2 top-5 z-10 -translate-x-1/2 text-xs uppercase tracking-wide text-white/80">
              Tap to place light
            </div>

            {lights.map((light) => (
              <span
                key={light.id}
                className="absolute animate-pulse rounded-full"
                style={{
                  left: light.x,
                  top: light.y,
                  width: `${light.size}px`,
                  height: `${light.size}px`,
                  transform:
                    "translate(-50%, -50%)",
                  background:
                    "radial-gradient(circle, rgba(255,243,176,1) 0%, rgba(255,213,128,0.9) 40%, rgba(255,213,128,0.18) 72%, rgba(255,213,128,0) 100%)",
                  boxShadow:
                    "0 0 16px rgba(255,223,140,0.8), 0 0 34px rgba(255,223,140,0.35)",
                }}
              />
            ))}
          </div>
        )}

        {/* Glow Trail */}
        {activeGame ===
          "glow-trail" && (
          <div
            className="relative min-h-[460px] overflow-hidden rounded-[2rem] border border-white/40 bg-gradient-to-b from-[#4c365f] via-[#573f6e] to-[#6a4a7e] shadow-sm"
            style={{
              touchAction: "none",
            }}
          >
            <div className="absolute left-1/2 top-5 z-10 -translate-x-1/2 text-xs uppercase tracking-wide text-white/80">
              Drag to draw light
            </div>

            <canvas
              ref={glowCanvasRef}
              className="absolute inset-0 h-full w-full"
              style={{
                touchAction: "none",
              }}
            />
          </div>
        )}

        {/* Sand Sweep */}
        {activeGame ===
          "sand-sweep" && (
          <div
            className="relative min-h-[460px] overflow-hidden rounded-[2rem] border border-white/40 bg-gradient-to-b from-[#f0e0d8] via-[#edd9d0] to-[#e8d2c7] shadow-sm"
            style={{
              touchAction: "none",
            }}
          >
            <div className="absolute left-1/2 top-5 z-10 -translate-x-1/2 text-xs uppercase tracking-wide text-[#a67c73]">
              Move to sweep
            </div>

            <canvas
              ref={sandCanvasRef}
              className="absolute inset-0 h-full w-full"
              style={{
                touchAction: "none",
              }}
            />
          </div>
        )}
      </section>
    </main>
  );
}