import React from "react";

type DropletProps = {
  text: string;
  mood?: string | null;
  onClick?: () => void;
  className?: string;
};

const moodTintMap: Record<string, string> = {
  overwhelmed: "rgba(168, 139, 255, 0.09)",
  healing: "rgba(163, 190, 140, 0.09)",
  hopeful: "rgba(245, 183, 84, 0.09)",
  lonely: "rgba(136, 170, 204, 0.09)",
  grateful: "rgba(233, 169, 184, 0.09)",
  calm: "rgba(125, 211, 252, 0.09)",
  crashout: "rgba(244, 143, 177, 0.09)",
  reflective: "rgba(125, 170, 220, 0.09)",
  tense: "rgba(251, 146, 60, 0.09)",
  grounded: "rgba(190, 242, 100, 0.08)",
  joy: "rgba(250, 204, 21, 0.09)",
};

function getPreviewText(text: string, maxLength = 54) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).trim()}…`;
}

function getShapeClass(mood?: string | null) {
  switch ((mood || "").toLowerCase().trim()) {
    case "overwhelmed":
      return "[border-radius:58%_42%_50%_50%_/_46%_52%_48%_54%]";
    case "healing":
      return "[border-radius:46%_54%_58%_42%_/_52%_46%_54%_48%]";
    case "hopeful":
      return "[border-radius:52%_48%_56%_44%_/_44%_56%_46%_54%]";
    case "lonely":
      return "[border-radius:44%_56%_48%_52%_/_54%_46%_56%_44%]";
    case "grateful":
      return "[border-radius:54%_46%_52%_48%_/_48%_54%_44%_56%]";
    case "calm":
      return "[border-radius:50%_50%_58%_42%_/_52%_48%_54%_46%]";
    case "crashout":
      return "[border-radius:42%_58%_46%_54%_/_50%_46%_54%_50%]";
    case "reflective":
      return "[border-radius:56%_44%_50%_50%_/_54%_48%_52%_46%]";
    case "tense":
      return "[border-radius:48%_52%_44%_56%_/_50%_54%_46%_50%]";
    case "grounded":
      return "[border-radius:52%_48%_54%_46%_/_56%_44%_52%_48%]";
    case "joy":
      return "[border-radius:50%_50%_46%_54%_/_46%_54%_48%_52%]";
    default:
      return "[border-radius:52%_48%_54%_46%_/_50%_50%_52%_48%]";
  }
}

export default function Droplet({
  text,
  mood,
  onClick,
  className = "",
}: DropletProps) {
  const normalizedMood = mood?.toLowerCase().trim() ?? "";
  const preview = getPreviewText(text);
  const tint = moodTintMap[normalizedMood] ?? "rgba(233, 169, 184, 0.07)";
  const shapeClass = getShapeClass(mood);

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group relative overflow-hidden",
        "transition-transform duration-300 ease-out",
        "hover:scale-[1.02] active:scale-[0.985]",
        "focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-0",
        className,
      ].join(" ")}
      aria-label="Open shared drop"
    >
      <div
        className={`absolute inset-0 ${shapeClass}`}
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.56) 0%, rgba(255,255,255,0.26) 100%)",
          border: "1.35px solid rgba(223, 190, 196, 0.68)",
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.34),
            inset 0 -12px 20px rgba(255,255,255,0.08),
            0 8px 18px rgba(137, 113, 118, 0.045)
          `,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      />

      <div
        className={`pointer-events-none absolute inset-[10%] ${shapeClass}`}
        style={{
          background: `radial-gradient(circle at 50% 56%, ${tint} 0%, rgba(255,255,255,0.03) 72%, transparent 100%)`,
          filter: "blur(4px)",
          opacity: 1,
        }}
      />

      <div
        className={`pointer-events-none absolute left-[18%] top-[14%] h-[20%] w-[34%] ${shapeClass}`}
        style={{
          background: "rgba(255,255,255,0.28)",
          filter: "blur(8px)",
          transform: "rotate(-12deg)",
        }}
      />

      <div
        className="pointer-events-none absolute bottom-[16%] left-[22%] h-[24%] w-[56%] rounded-full bg-white/8 blur-lg"
      />

      <div className="relative z-10 flex h-full w-full items-center justify-center px-4">
        <div className="flex max-w-[78%] flex-col items-center justify-center gap-1 text-center">
          {mood ? (
            <span className="max-w-full truncate text-[10px] font-medium uppercase tracking-[0.12em] text-[#9b8783]">
              {mood}
            </span>
          ) : null}

          <p className="line-clamp-2 text-[11px] leading-snug text-[#6d5b57]">
            {preview}
          </p>
        </div>
      </div>
    </button>
  );
}