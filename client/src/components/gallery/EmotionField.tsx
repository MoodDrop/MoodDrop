import React, { useMemo } from "react";
import { SharedCanvas, getPreviewText } from "@/lib/livingGallery";

type EmotionFieldProps = {
  canvases: SharedCanvas[];
  onOpen: (canvas: SharedCanvas) => void;
  activeMood?: string | null;
};

type OrbPos = {
  left: number;
  top: number;
  size: "sm" | "md" | "lg";
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

function getMoodClasses(mood?: string | null) {
  switch (mood) {
    case "CrashOut":
      return {
        glow: "bg-rose-200/45",
        pill: "bg-rose-50/90 text-rose-700 border border-rose-100",
      };
    case "Overwhelmed":
      return {
        glow: "bg-violet-200/45",
        pill: "bg-violet-50/90 text-violet-700 border border-violet-100",
      };
    case "Healing":
      return {
        glow: "bg-emerald-200/45",
        pill: "bg-emerald-50/90 text-emerald-700 border border-emerald-100",
      };
    case "Hopeful":
      return {
        glow: "bg-amber-200/45",
        pill: "bg-amber-50/90 text-amber-700 border border-amber-100",
      };
    case "Reflective":
      return {
        glow: "bg-sky-200/45",
        pill: "bg-sky-50/90 text-sky-700 border border-sky-100",
      };
    case "Lonely":
      return {
        glow: "bg-slate-200/45",
        pill: "bg-slate-50/90 text-slate-600 border border-slate-100",
      };
    case "Grateful":
      return {
        glow: "bg-pink-200/45",
        pill: "bg-pink-50/90 text-pink-700 border border-pink-100",
      };
    case "Calm":
      return {
        glow: "bg-teal-200/45",
        pill: "bg-teal-50/90 text-teal-700 border border-teal-100",
      };
    case "Tense":
      return {
        glow: "bg-orange-200/45",
        pill: "bg-orange-50/90 text-orange-700 border border-orange-100",
      };
    case "Grounded":
      return {
        glow: "bg-lime-200/45",
        pill: "bg-lime-50/90 text-lime-700 border border-lime-100",
      };
    case "Joy":
      return {
        glow: "bg-yellow-200/45",
        pill: "bg-yellow-50/90 text-yellow-700 border border-yellow-100",
      };
    default:
      return {
        glow: "bg-white/45",
        pill: "bg-white/90 text-slate-600 border border-slate-100",
      };
  }
}

function getVisibleCanvases(canvases: SharedCanvas[], limit = 12) {
  return canvases.slice(0, limit);
}

function buildPositions(canvases: SharedCanvas[]): Record<string, OrbPos> {
  const rand = seedRng(canvases.map((c) => c.id).join("|") || "empty");
  const positions: Record<string, OrbPos> = {};

  const layout = [
    { left: 16, top: 14 },
    { left: 50, top: 12 },
    { left: 84, top: 16 },
    { left: 22, top: 32 },
    { left: 52, top: 34 },
    { left: 80, top: 31 },
    { left: 14, top: 53 },
    { left: 44, top: 54 },
    { left: 76, top: 52 },
    { left: 24, top: 73 },
    { left: 56, top: 74 },
    { left: 86, top: 71 },
  ];

  const sizePool: OrbPos["size"][] = [
    "md",
    "sm",
    "md",
    "sm",
    "lg",
    "sm",
    "md",
    "sm",
    "md",
    "sm",
    "md",
    "sm",
  ];

  canvases.forEach((canvas, index) => {
    const slot = layout[index % layout.length];

    positions[canvas.id] = {
      left: slot.left + (rand() * 4 - 2),
      top: slot.top + (rand() * 4 - 2),
      size: sizePool[index % sizePool.length],
      duration: 7 + rand() * 4,
      delay: rand() * 2,
    };
  });

  return positions;
}

function getSizeClasses(size: OrbPos["size"]) {
  switch (size) {
    case "lg":
      return "w-[160px] min-h-[108px]";
    case "md":
      return "w-[148px] min-h-[100px]";
    case "sm":
    default:
      return "w-[136px] min-h-[92px]";
  }
}

export default function EmotionField({
  canvases,
  onOpen,
  activeMood,
}: EmotionFieldProps) {
  const visibleCanvases = useMemo(() => getVisibleCanvases(canvases, 12), [canvases]);
  const positions = useMemo(() => buildPositions(visibleCanvases), [visibleCanvases]);

  if (visibleCanvases.length === 0) return null;

  return (
    <div className="relative h-[760px] w-full overflow-hidden rounded-[32px]">
      {visibleCanvases.map((canvas) => {
        const pos = positions[canvas.id];
        const mood = getMoodClasses(canvas.mood);
        const preview = getPreviewText(canvas.text, pos.size === "lg" ? 44 : 34);

        const isHighlighted =
          !activeMood || canvas.mood === activeMood || activeMood === "All";

        return (
          <div
            key={canvas.id}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              animation: `mooddropFloat ${pos.duration}s ease-in-out ${pos.delay}s infinite`,
            }}
          >
            <button
              type="button"
              onClick={() => onOpen(canvas)}
              className={`group relative cursor-pointer rounded-[26px] border border-white/70 bg-white/72 p-3 text-left shadow-[0_14px_28px_rgba(90,70,70,0.08)] backdrop-blur transition duration-200 hover:shadow-[0_18px_36px_rgba(90,70,70,0.12)] ${getSizeClasses(
                pos.size
              )} ${isHighlighted ? "opacity-100" : "opacity-45"}`}
            >
              <div
                className={`pointer-events-none absolute inset-0 rounded-[26px] blur-2xl opacity-40 ${mood.glow}`}
              />

              <div className="relative z-10">
                <div className="mb-2">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] ${mood.pill}`}
                  >
                    {canvas.mood || "Shared"}
                  </span>
                </div>

                <p className="line-clamp-2 whitespace-pre-wrap text-[11px] leading-5 text-slate-700">
                  {preview}
                </p>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="text-[9px] text-slate-400">
                    Witnessed by {canvas.witness_count ?? 0}
                  </div>

                  <div className="text-[9px] uppercase tracking-[0.14em] text-slate-400 group-hover:text-slate-500">
                    Open
                  </div>
                </div>
              </div>
            </button>
          </div>
        );
      })}

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