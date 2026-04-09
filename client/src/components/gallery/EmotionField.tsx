import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SharedCanvas } from "@/lib/livingGallery";
import Droplet from "@/components/gallery/Droplet";

type EmotionFieldProps = {
  canvases: SharedCanvas[];
  onOpen: (canvas: SharedCanvas) => void;
  activeMood?: string | null;
};

type OrbPos = {
  left: number;
  top: number;
  size: "sm" | "md";
  duration: number;
  delay: number;
};

function seedRng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }

  return () => {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildPositions(
  canvases: SharedCanvas[],
  isMobile: boolean
): Record<string, OrbPos> {
  const rand = seedRng(canvases.map((c) => c.id).join("|") || "empty");
  const positions: Record<string, OrbPos> = {};

  const mobileLayout = [
    { left: 30, top: 30 },
    { left: 70, top: 34 },
    { left: 32, top: 64 },
    { left: 68, top: 68 },
  ];

  const desktopLayout = [
    { left: 20, top: 24 },
    { left: 50, top: 20 },
    { left: 80, top: 24 },
    { left: 22, top: 56 },
    { left: 52, top: 60 },
    { left: 80, top: 56 },
  ];

  const layout = isMobile ? mobileLayout : desktopLayout;

  canvases.forEach((canvas, index) => {
    const slot = layout[index % layout.length];

    positions[canvas.id] = {
      left: slot.left + (rand() * 3 - 1.5),
      top: slot.top + (rand() * 3 - 1.5),
      size: index % 2 === 0 ? "md" : "sm",
      duration: 7 + rand() * 3,
      delay: rand() * 2,
    };
  });

  return positions;
}

function getSizeClasses(size: OrbPos["size"], isMobile: boolean) {
  if (isMobile) {
    return size === "md"
      ? "w-[126px] h-[112px]"
      : "w-[108px] h-[96px]";
  }

  return size === "md"
    ? "w-[148px] h-[128px]"
    : "w-[124px] h-[108px]";
}

export default function EmotionField({
  canvases,
  onOpen,
  activeMood,
}: EmotionFieldProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    if (canvases.length <= 1) return;

    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % canvases.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [canvases.length]);

  const visibleCanvases = useMemo(() => {
    const limit = isMobile ? 4 : 6;
    const rotated = [
      ...canvases.slice(startIndex),
      ...canvases.slice(0, startIndex),
    ];
    return rotated.slice(0, limit);
  }, [canvases, startIndex, isMobile]);

  const positions = useMemo(
    () => buildPositions(visibleCanvases, isMobile),
    [visibleCanvases, isMobile]
  );

  if (visibleCanvases.length === 0) return null;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[32px] ${
        isMobile ? "h-[300px]" : "h-[500px]"
      }`}
    >
      <AnimatePresence mode="popLayout">
        {visibleCanvases.map((canvas) => {
          const pos = positions[canvas.id];

          const isHighlighted =
            !activeMood || canvas.mood === activeMood || activeMood === "All";

          return (
            <motion.div
              key={canvas.id}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                animation: `mooddropFloat ${pos.duration}s ease-in-out ${pos.delay}s infinite`,
              }}
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <Droplet
                text={canvas.text}
                mood={canvas.mood}
                onClick={() => onOpen(canvas)}
                className={`
                  ${getSizeClasses(pos.size, isMobile)}
                  ${isHighlighted ? "opacity-100" : "opacity-45"}
                `}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      <style>{`
        @keyframes mooddropFloat {
          0% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-8px); }
          100% { transform: translate(-50%, -50%) translateY(0px); }
        }
      `}</style>
    </div>
  );
}