// client/src/pages/CalmStudioPage.tsx
import React from "react";

type GentlePlayMode =
  | "light-garden"
  | "bubble-drift"
  | "glow-trail"
  | "sand-sweep"
  | null;

type LightPoint = {
  id: number;
  x: number;
  y: number;
  size: number;
};

type BubbleInstance = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
};

type SandParticle = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
};

export default function CalmStudioPage() {
  const [activeSection, setActiveSection] = React.useState<string | null>(null);
  const [activeGame, setActiveGame] = React.useState<GentlePlayMode>(null);

  const [showEntry, setShowEntry] = React.useState(false);
  const [entryReady, setEntryReady] = React.useState(false);
  const [isEntering, setIsEntering] = React.useState(false);
  const [showStudio, setShowStudio] = React.useState(false);

  React.useEffect(() => {
    const hasEntered = sessionStorage.getItem("calmStudioEntered") === "true";

    if (hasEntered) {
      setShowStudio(true);
      setShowEntry(false);
    } else {
      setShowEntry(true);
      setEntryReady(true);
    }
  }, []);

  const handleEnterCalmStudio = () => {
    if (isEntering) return;

    setIsEntering(true);

    window.setTimeout(() => {
      setShowStudio(true);
    }, 760);

    window.setTimeout(() => {
      setShowEntry(false);
      sessionStorage.setItem("calmStudioEntered", "true");
    }, 1180);
  };

  // Light Garden
  const [lights, setLights] = React.useState<LightPoint[]>([]);

  const handleLightGardenClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newLight: LightPoint = {
      id: Date.now() + Math.random(),
      x,
      y,
      size: 28 + Math.random() * 24,
    };

    setLights((prev) => [...prev, newLight]);
  };

  // Bubble Drift
  const bubblePalette = React.useMemo(
    () => [
      "rgba(255, 199, 210, 0.88)",
      "rgba(255, 214, 222, 0.86)",
      "rgba(255, 228, 206, 0.86)",
      "rgba(255, 243, 224, 0.82)",
      "rgba(255, 230, 238, 0.86)",
      "rgba(255, 238, 214, 0.84)",
    ],
    []
  );

  const createBubble = React.useCallback(
    (id: number): BubbleInstance => ({
      id,
      left: 8 + Math.random() * 82,
      size: 24 + Math.random() * 24,
      duration: 6.6 + Math.random() * 2.8,
      delay: Math.random() * 1.6,
      color: bubblePalette[Math.floor(Math.random() * bubblePalette.length)],
    }),
    [bubblePalette]
  );

  const [bubbles, setBubbles] = React.useState<BubbleInstance[]>(
    Array.from({ length: 14 }, (_, i) => createBubble(i + 1))
  );
  const [poppedBubbles, setPoppedBubbles] = React.useState<number[]>([]);

  const handleBubblePop = (id: number) => {
    if (poppedBubbles.includes(id)) return;

    setPoppedBubbles((prev) => [...prev, id]);

    window.setTimeout(() => {
      setBubbles((prev) =>
        prev.map((bubble) => (bubble.id === id ? createBubble(id) : bubble))
      );
      setPoppedBubbles((prev) => prev.filter((bubbleId) => bubbleId !== id));
    }, 520);
  };

  // Glow Trail
  const glowCanvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (activeGame !== "glow-trail" || !glowCanvasRef.current) return;

    const canvas = glowCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let drawing = false;
    let animationFrameId = 0;

    const fade = () => {
      ctx.fillStyle = "rgba(76, 54, 95, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      animationFrameId = requestAnimationFrame(fade);
    };

    fade();

    const drawGlow = (x: number, y: number) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 24);
      gradient.addColorStop(0, "rgba(255, 227, 214, 0.86)");
      gradient.addColorStop(0.42, "rgba(255, 205, 195, 0.4)");
      gradient.addColorStop(1, "rgba(255, 205, 195, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI * 2);
      ctx.fill();
    };

    const getCoords = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
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

    canvas.addEventListener("pointerdown", handleDown);
    canvas.addEventListener("pointermove", handleMove);
    canvas.addEventListener("pointerup", handleUp);
    canvas.addEventListener("pointerleave", handleUp);
    canvas.addEventListener("pointercancel", handleUp);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("pointerdown", handleDown);
      canvas.removeEventListener("pointermove", handleMove);
      canvas.removeEventListener("pointerup", handleUp);
      canvas.removeEventListener("pointerleave", handleUp);
      canvas.removeEventListener("pointercancel", handleUp);
    };
  }, [activeGame]);

  // Sand Sweep
  const sandCanvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (activeGame !== "sand-sweep" || !sandCanvasRef.current) return;

    const canvas = sandCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particleCount = 1400;
    const particles: SandParticle[] = Array.from({ length: particleCount }).map(
      () => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        return { x, y, baseX: x, baseY: y };
      }
    );

    let mouseX = -9999;
    let mouseY = -9999;
    let animationFrameId = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 46) {
          const force = (46 - dist) / 46;
          p.x += (dx / (dist || 1)) * force * 7;
          p.y += (dy / (dist || 1)) * force * 7;
        }

        p.x += (p.baseX - p.x) * 0.03;
        p.y += (p.baseY - p.y) * 0.03;

        ctx.fillStyle = "rgba(219, 179, 158, 0.72)";
        ctx.fillRect(p.x, p.y, 2, 2);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    canvas.addEventListener("pointermove", handleMove);
    canvas.addEventListener("pointerleave", handleLeave);
    canvas.addEventListener("pointerup", handleLeave);
    canvas.addEventListener("pointercancel", handleLeave);

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("pointermove", handleMove);
      canvas.removeEventListener("pointerleave", handleLeave);
      canvas.removeEventListener("pointerup", handleLeave);
      canvas.removeEventListener("pointercancel", handleLeave);
    };
  }, [activeGame]);

  const openSection = (section: string) => {
    setActiveSection(section);
    if (section !== "gentle-play") {
      setActiveGame(null);
    }
  };

  return (
    <>
      <style>{`
        @keyframes bubbleRise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.78;
          }
          70% {
            opacity: 0.72;
          }
          100% {
            transform: translateY(-270px) scale(1.08);
            opacity: 0;
          }
        }

        @keyframes previewLightPulse {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.12);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
        }

        @keyframes previewBubbleFloat {
          0% {
            transform: translateY(0px);
            opacity: 0.58;
          }
          50% {
            transform: translateY(-10px);
            opacity: 0.82;
          }
          100% {
            transform: translateY(0px);
            opacity: 0.58;
          }
        }

        @keyframes previewTrailGlow {
          0% {
            opacity: 0.45;
          }
          50% {
            opacity: 0.86;
          }
          100% {
            opacity: 0.45;
          }
        }

        @keyframes previewSandShift {
          0% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(6px);
          }
          100% {
            transform: translateX(0px);
          }
        }

        @keyframes focusedGameIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cardGridFadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes dropletBreathe {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.04);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes dropletFall {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          20% {
            transform: translateY(10px) scale(0.97, 1.03);
            opacity: 1;
          }
          100% {
            transform: translateY(165px) scale(0.82);
            opacity: 0.96;
          }
        }

        @keyframes rippleExpand {
          0% {
            transform: translate(-50%, -50%) scale(0.35);
            opacity: 0.55;
          }
          100% {
            transform: translate(-50%, -50%) scale(7.5);
            opacity: 0;
          }
        }

        @keyframes studioRevealSoft {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.995);
            filter: blur(3px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }

        @keyframes floatParticleA {
          0% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.18;
          }
          50% {
            transform: translateY(-14px) translateX(6px);
            opacity: 0.34;
          }
          100% {
            transform: translateY(-28px) translateX(-4px);
            opacity: 0.14;
          }
        }

        @keyframes floatParticleB {
          0% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.14;
          }
          50% {
            transform: translateY(-10px) translateX(-6px);
            opacity: 0.28;
          }
          100% {
            transform: translateY(-22px) translateX(4px);
            opacity: 0.1;
          }
        }

        .focused-game-enter {
          animation: focusedGameIn 240ms ease-out;
        }

        .game-card-grid-enter {
          animation: cardGridFadeIn 200ms ease-out;
        }

        .studio-reveal {
          animation: studioRevealSoft 760ms ease-out;
        }
      `}</style>

      {showEntry && entryReady && (
        <div className="min-h-[68vh] sm:min-h-[78vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none">
            {[
              { top: "18%", left: "20%", size: 8, anim: "floatParticleA 10s ease-in-out infinite" },
              { top: "26%", left: "68%", size: 10, anim: "floatParticleB 12s ease-in-out infinite" },
              { top: "34%", left: "38%", size: 6, anim: "floatParticleA 9s ease-in-out infinite" },
              { top: "48%", left: "76%", size: 7, anim: "floatParticleB 11s ease-in-out infinite" },
              { top: "58%", left: "24%", size: 9, anim: "floatParticleA 13s ease-in-out infinite" },
              { top: "66%", left: "58%", size: 6, anim: "floatParticleB 10s ease-in-out infinite" },
              { top: "72%", left: "82%", size: 8, anim: "floatParticleA 12s ease-in-out infinite" },
              { top: "24%", left: "84%", size: 5, anim: "floatParticleB 9s ease-in-out infinite" },
            ].map((particle, index) => (
              <span
                key={index}
                className="absolute rounded-full"
                style={{
                  top: particle.top,
                  left: particle.left,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  background: "rgba(255, 255, 255, 0.92)",
                  opacity: 0.7,
                  animation: particle.anim,
                }}
              />
            ))}
          </div>

          <div className="relative flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={handleEnterCalmStudio}
              className="relative flex items-center justify-center focus:outline-none"
              aria-label="Enter Calm Studio"
            >
              <div
                className="relative"
                style={{
                  animation: isEntering
                    ? "dropletFall 320ms ease-in forwards"
                    : "dropletBreathe 5.6s ease-in-out infinite",
                }}
              >
                <div
                  style={{
                    width: "84px",
                    height: "84px",
                    background:
                      "radial-gradient(circle at 35% 28%, rgba(255,255,255,0.92) 0%, rgba(255,224,228,0.88) 26%, rgba(247,196,205,0.96) 64%, rgba(231,173,184,0.98) 100%)",
                    clipPath:
                      "path('M42 4 C28 24 14 38 14 56 C14 73 26 84 42 84 C58 84 70 73 70 56 C70 38 56 24 42 4 Z')",
                  }}
                />
              </div>

              {isEntering && (
                <span
                  className="absolute rounded-full pointer-events-none border border-white/80"
                  style={{
                    left: "50%",
                    top: "94%",
                    width: "34px",
                    height: "34px",
                    transform: "translate(-50%, -50%)",
                    animation: "rippleExpand 900ms ease-out forwards",
                  }}
                />
              )}
            </button>

            <p className="mt-8 text-warm-gray-700 text-base sm:text-lg font-medium">
              Tap the droplet to enter
            </p>
          </div>
        </div>
      )}

      {showStudio && (
        <div className="studio-reveal max-w-5xl mx-auto px-4 pb-10">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-blush-100 mb-8">
            <p className="text-warm-gray-700 font-semibold text-lg">
              Calm Studio is gently coming to life.
            </p>
            <p className="text-warm-gray-600 text-sm leading-6 mt-2">
              New calming experiences will appear here as they are completed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => openSection("breath")}
              className={`rounded-2xl border p-5 shadow-sm text-left transition-all ${
                activeSection === "breath"
                  ? "border-blush-200 bg-white shadow-md"
                  : "border-blush-100 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base sm:text-lg font-semibold text-warm-gray-700">
                  Take a Breath
                </h2>
                <span className="text-xs rounded-full bg-blush-50 px-2.5 py-1 text-warm-gray-500 border border-blush-100">
                  Coming Soon
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-warm-gray-600">
                A small pause for your body and mind.
              </p>
            </button>

            <button
              type="button"
              onClick={() => openSection("visuals")}
              className={`rounded-2xl border p-5 shadow-sm text-left transition-all ${
                activeSection === "visuals"
                  ? "border-blush-200 bg-white shadow-md"
                  : "border-blush-100 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base sm:text-lg font-semibold text-warm-gray-700">
                  Soft Visuals
                </h2>
                <span className="text-xs rounded-full bg-blush-50 px-2.5 py-1 text-warm-gray-500 border border-blush-100">
                  Coming Soon
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-warm-gray-600">
                Gentle moments for when your mind needs less noise.
              </p>
            </button>

            <button
              type="button"
              onClick={() => openSection("sounds")}
              className={`rounded-2xl border p-5 shadow-sm text-left transition-all ${
                activeSection === "sounds"
                  ? "border-blush-200 bg-white shadow-md"
                  : "border-blush-100 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base sm:text-lg font-semibold text-warm-gray-700">
                  Soothing Sounds
                </h2>
                <span className="text-xs rounded-full bg-blush-50 px-2.5 py-1 text-warm-gray-500 border border-blush-100">
                  Coming Soon
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-warm-gray-600">
                Let the room soften around you.
              </p>
            </button>

            <button
              type="button"
              onClick={() => openSection("gentle-play")}
              className={`rounded-2xl border p-5 shadow-sm text-left transition-all ${
                activeSection === "gentle-play"
                  ? "border-blush-200 bg-white shadow-md"
                  : "border-blush-100 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base sm:text-lg font-semibold text-warm-gray-700">
                  Gentle Play
                </h2>
                <span className="text-xs rounded-full bg-blush-50 px-2.5 py-1 text-warm-gray-700 border border-blush-100">
                  Playable
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-warm-gray-600">
                Quiet interaction for restless moments.
              </p>
            </button>
          </div>

          {activeSection === "breath" && (
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-blush-100 mb-8">
              <h3 className="text-lg font-semibold text-warm-gray-700 mb-2">
                Take a Breath
              </h3>
              <p className="text-warm-gray-600 text-sm leading-6">
                A breathing orb will live here next.
              </p>
            </section>
          )}

          {activeSection === "visuals" && (
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-blush-100 mb-8">
              <h3 className="text-lg font-semibold text-warm-gray-700 mb-2">
                Soft Visuals
              </h3>
              <p className="text-warm-gray-600 text-sm leading-6">
                Gentle calming visuals will live here next.
              </p>
            </section>
          )}

          {activeSection === "sounds" && (
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-blush-100 mb-8">
              <h3 className="text-lg font-semibold text-warm-gray-700 mb-2">
                Soothing Sounds
              </h3>
              <p className="text-warm-gray-600 text-sm leading-6">
                Ambient sound experiences will live here next.
              </p>
            </section>
          )}

          {activeSection === "gentle-play" && (
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-blush-100 mb-10">
              {!activeGame && (
                <div className="game-card-grid-enter">
                  <h3 className="text-lg font-semibold text-warm-gray-700 mb-2">
                    Gentle Play
                  </h3>
                  <p className="text-warm-gray-600 text-sm leading-6 max-w-2xl mb-5">
                    Quiet interactions for restless moments.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveGame("light-garden")}
                      className="rounded-2xl border border-blush-100 overflow-hidden text-left bg-white shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="relative h-28 bg-gradient-to-b from-[#2c2550] via-[#362e63] to-[#453a76] overflow-hidden">
                        {[
                          { top: "30%", left: "24%", size: 20, delay: "0s" },
                          { top: "47%", left: "56%", size: 15, delay: "0.8s" },
                          { top: "63%", left: "76%", size: 18, delay: "1.2s" },
                        ].map((dot, index) => (
                          <span
                            key={index}
                            className="absolute rounded-full"
                            style={{
                              top: dot.top,
                              left: dot.left,
                              width: `${dot.size}px`,
                              height: `${dot.size}px`,
                              background:
                                "radial-gradient(circle, rgba(255,242,174,1) 0%, rgba(255,213,128,0.9) 45%, rgba(255,213,128,0.15) 72%, rgba(255,213,128,0) 100%)",
                              boxShadow:
                                "0 0 14px rgba(255,223,140,0.7), 0 0 28px rgba(255,223,140,0.35)",
                              animation: `previewLightPulse 3s ease-in-out infinite`,
                              animationDelay: dot.delay,
                            }}
                          />
                        ))}
                      </div>
                      <div className="p-4">
                        <h4 className="text-sm sm:text-base font-semibold text-warm-gray-700">
                          Light Garden
                        </h4>
                        <p className="mt-1 text-sm leading-6 text-warm-gray-600">
                          Place soft points of light and slowly fill the space with calm.
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveGame("bubble-drift")}
                      className="rounded-2xl border border-blush-100 overflow-hidden text-left bg-white shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="relative h-28 bg-gradient-to-b from-[#f6e5e9] via-[#f7eeeb] to-[#f6e2d7] overflow-hidden">
                        {[
                          { left: "18%", bottom: "22%", size: 18, delay: "0s", color: "rgba(255, 199, 210, 0.88)" },
                          { left: "44%", bottom: "16%", size: 24, delay: "0.8s", color: "rgba(255, 228, 206, 0.84)" },
                          { left: "72%", bottom: "26%", size: 20, delay: "1.2s", color: "rgba(255, 214, 222, 0.86)" },
                        ].map((bubble, index) => (
                          <span
                            key={index}
                            className="absolute rounded-full border border-white/80"
                            style={{
                              left: bubble.left,
                              bottom: bubble.bottom,
                              width: `${bubble.size}px`,
                              height: `${bubble.size}px`,
                              background: bubble.color,
                              boxShadow:
                                "inset 0 0 12px rgba(255,255,255,0.45), 0 0 10px rgba(255,225,220,0.32)",
                              animation: `previewBubbleFloat 4s ease-in-out infinite`,
                              animationDelay: bubble.delay,
                            }}
                          />
                        ))}
                      </div>
                      <div className="p-4">
                        <h4 className="text-sm sm:text-base font-semibold text-warm-gray-700">
                          Bubble Drift
                        </h4>
                        <p className="mt-1 text-sm leading-6 text-warm-gray-600">
                          Tap floating bubbles and watch them shimmer away.
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveGame("glow-trail")}
                      className="rounded-2xl border border-blush-100 overflow-hidden text-left bg-white shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="relative h-28 bg-gradient-to-b from-[#4c365f] via-[#573f6e] to-[#6a4a7e] overflow-hidden">
                        <svg
                          className="absolute inset-0 w-full h-full"
                          viewBox="0 0 100 40"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M10 28 C20 10, 35 34, 48 18 S72 8, 88 22"
                            fill="none"
                            stroke="rgba(255,220,214,0.65)"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            style={{
                              filter: "drop-shadow(0 0 8px rgba(255,210,200,0.45))",
                              animation: "previewTrailGlow 3.2s ease-in-out infinite",
                            }}
                          />
                        </svg>
                      </div>
                      <div className="p-4">
                        <h4 className="text-sm sm:text-base font-semibold text-warm-gray-700">
                          Glow Trail
                        </h4>
                        <p className="mt-1 text-sm leading-6 text-warm-gray-600">
                          Draw soft glowing trails that slowly fade away.
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveGame("sand-sweep")}
                      className="rounded-2xl border border-blush-100 overflow-hidden text-left bg-white shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="relative h-28 bg-gradient-to-b from-[#f0e0d8] via-[#edd9d0] to-[#e8d2c7] overflow-hidden">
                        {[
                          { top: "28%", left: "18%", delay: "0s" },
                          { top: "44%", left: "38%", delay: "0.6s" },
                          { top: "58%", left: "66%", delay: "1.1s" },
                        ].map((swirl, index) => (
                          <span
                            key={index}
                            className="absolute rounded-full"
                            style={{
                              top: swirl.top,
                              left: swirl.left,
                              width: "44px",
                              height: "12px",
                              background: "rgba(221, 187, 168, 0.35)",
                              filter: "blur(2px)",
                              animation: `previewSandShift 4s ease-in-out infinite`,
                              animationDelay: swirl.delay,
                            }}
                          />
                        ))}
                      </div>
                      <div className="p-4">
                        <h4 className="text-sm sm:text-base font-semibold text-warm-gray-700">
                          Sand Sweep
                        </h4>
                        <p className="mt-1 text-sm leading-6 text-warm-gray-600">
                          Move soft shimmer grains and watch them slowly settle.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {activeGame === "light-garden" && (
                <div className="focused-game-enter">
                  <button
                    type="button"
                    onClick={() => setActiveGame(null)}
                    className="mb-4 text-sm text-blush-600 hover:underline"
                  >
                    ← Back to games
                  </button>

                  <h4 className="text-base sm:text-lg font-semibold text-warm-gray-700">
                    Light Garden
                  </h4>
                  <p className="mt-1 mb-4 text-sm leading-6 text-warm-gray-600">
                    Tap anywhere to place soft glowing lights and slowly fill the space with calm.
                  </p>

                  <div
                    onClick={handleLightGardenClick}
                    className="relative overflow-hidden rounded-[28px] border border-blush-100 min-h-[360px] cursor-pointer bg-gradient-to-b from-[#231f3f] via-[#30295a] to-[#43346d]"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%)] pointer-events-none" />
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs tracking-wide text-white/80 uppercase z-10">
                      Tap to place light
                    </div>

                    {lights.map((light) => (
                      <span
                        key={light.id}
                        className="absolute rounded-full pointer-events-none animate-pulse"
                        style={{
                          left: light.x,
                          top: light.y,
                          width: `${light.size}px`,
                          height: `${light.size}px`,
                          transform: "translate(-50%, -50%)",
                          background:
                            "radial-gradient(circle, rgba(255,243,176,1) 0%, rgba(255,213,128,0.9) 40%, rgba(255,213,128,0.18) 72%, rgba(255,213,128,0) 100%)",
                          boxShadow:
                            "0 0 16px rgba(255,223,140,0.8), 0 0 34px rgba(255,223,140,0.35)",
                          animationDuration: "2.8s",
                        }}
                      />
                    ))}

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] text-white/75 z-10">
                      A quiet little moment to build your own glow
                    </div>
                  </div>
                </div>
              )}

              {activeGame === "bubble-drift" && (
                <div className="focused-game-enter">
                  <button
                    type="button"
                    onClick={() => setActiveGame(null)}
                    className="mb-4 text-sm text-blush-600 hover:underline"
                  >
                    ← Back to games
                  </button>

                  <h4 className="text-base sm:text-lg font-semibold text-warm-gray-700">
                    Bubble Drift
                  </h4>
                  <p className="mt-1 mb-4 text-sm leading-6 text-warm-gray-600">
                    Tap floating bubbles and watch them shimmer away.
                  </p>

                  <div className="relative overflow-hidden rounded-[28px] border border-blush-100 min-h-[360px] bg-gradient-to-b from-[#f8eeef] via-[#f8f2ee] to-[#f5e8de]">
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs tracking-wide text-[#b38a8f] uppercase z-10">
                      Tap a bubble
                    </div>

                    {bubbles.map((bubble) => {
                      const isPopped = poppedBubbles.includes(bubble.id);

                      return (
                        <button
                          key={bubble.id}
                          type="button"
                          onClick={() => handleBubblePop(bubble.id)}
                          className={`absolute rounded-full border border-white/80 transition-all duration-500 ${
                            isPopped ? "opacity-0 scale-125" : "opacity-100"
                          }`}
                          style={{
                            left: `${bubble.left}%`,
                            bottom: "-12px",
                            width: `${bubble.size}px`,
                            height: `${bubble.size}px`,
                            background: bubble.color,
                            boxShadow:
                              "inset 0 0 14px rgba(255,255,255,0.52), 0 0 14px rgba(255,220,210,0.34)",
                            animation: `bubbleRise ${bubble.duration}s linear infinite`,
                            animationDelay: `${bubble.delay}s`,
                          }}
                        />
                      );
                    })}

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] text-[#b38a8f] z-10">
                      A soft little shimmer pop
                    </div>
                  </div>
                </div>
              )}

              {activeGame === "glow-trail" && (
                <div className="focused-game-enter">
                  <button
                    type="button"
                    onClick={() => setActiveGame(null)}
                    className="mb-4 text-sm text-blush-600 hover:underline"
                  >
                    ← Back to games
                  </button>

                  <h4 className="text-base sm:text-lg font-semibold text-warm-gray-700">
                    Glow Trail
                  </h4>
                  <p className="mt-1 mb-4 text-sm leading-6 text-warm-gray-600">
                    Drag across the canvas and leave a soft fading trail of light.
                  </p>

                  <div
                    className="relative overflow-hidden rounded-[28px] border border-blush-100 min-h-[360px] bg-gradient-to-b from-[#4c365f] via-[#573f6e] to-[#6a4a7e]"
                    style={{ touchAction: "none" }}
                  >
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs tracking-wide text-white/80 uppercase z-10">
                      Drag to draw light
                    </div>

                    <canvas
                      ref={glowCanvasRef}
                      className="absolute inset-0 w-full h-full"
                      style={{ touchAction: "none" }}
                    />

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] text-white/75 z-10">
                      A gentle trace that slowly fades away
                    </div>
                  </div>
                </div>
              )}

              {activeGame === "sand-sweep" && (
                <div className="focused-game-enter">
                  <button
                    type="button"
                    onClick={() => setActiveGame(null)}
                    className="mb-4 text-sm text-blush-600 hover:underline"
                  >
                    ← Back to games
                  </button>

                  <h4 className="text-base sm:text-lg font-semibold text-warm-gray-700">
                    Sand Sweep
                  </h4>
                  <p className="mt-1 mb-4 text-sm leading-6 text-warm-gray-600">
                    Move across the surface and watch soft shimmer grains part and settle.
                  </p>

                  <div
                    className="relative overflow-hidden rounded-[28px] border border-blush-100 min-h-[360px] bg-gradient-to-b from-[#f0e0d8] via-[#edd9d0] to-[#e8d2c7]"
                    style={{ touchAction: "none" }}
                  >
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs tracking-wide text-[#a67c73] uppercase z-10">
                      Move to sweep
                    </div>

                    <canvas
                      ref={sandCanvasRef}
                      className="absolute inset-0 w-full h-full"
                      style={{ touchAction: "none" }}
                    />

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] text-[#a67c73] z-10">
                      A tactile little moment to clear the surface
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </>
  );
}