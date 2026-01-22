import React from "react";

// If this import fails in YOUR setup, replace it with:
// import droplet from "../assets/droplet.png";
import droplet from "@/assets/droplet.png";

type Mood =
  | "Joy"
  | "Calm"
  | "Grounded"
  | "Tense"
  | "Overwhelmed"
  | "Crash Out"
  | "CrashOut";

interface MoodCanvasProps {
  mood: Mood | string;
  text: string;
  vibeCount?: number;
}

const moodStyles: Record<
  string,
  {
    border: string;
    wash: string;
    label: string;
  }
> = {
  Joy: {
    border: "border-[#F9E4B7]",
    wash: "from-[#F9E4B7]/40 to-transparent",
    label: "JOY",
  },
  Calm: {
    border: "border-[#C1D5C0]",
    wash: "from-[#C1D5C0]/40 to-transparent",
    label: "CALM",
  },
  Grounded: {
    border: "border-[#D7CCC8]",
    wash: "from-[#D7CCC8]/40 to-transparent",
    label: "GROUNDED",
  },
  Tense: {
    border: "border-[#D8BFD8]",
    wash: "from-[#D8BFD8]/40 to-transparent",
    label: "TENSE",
  },
  Overwhelmed: {
    border: "border-[#CDC4D6]",
    wash: "from-[#CDC4D6]/40 to-transparent",
    label: "OVERWHELMED",
  },
  "Crash Out": {
    border: "border-[#9E4759]",
    wash: "from-[#9E4759]/26 to-transparent",
    label: "CRASH OUT",
  },
  CrashOut: {
    border: "border-[#9E4759]",
    wash: "from-[#9E4759]/26 to-transparent",
    label: "CRASH OUT",
  },
};

export default function MoodCanvas({ mood, text, vibeCount = 0 }: MoodCanvasProps) {
  const style = moodStyles[mood] || {
    border: "border-black/10",
    wash: "from-black/5 to-transparent",
    label: String(mood || "MOOD").toUpperCase(),
  };

  const presenceLevel: 0 | 1 | 2 | 3 =
    vibeCount >= 12 ? 3 : vibeCount >= 6 ? 2 : vibeCount >= 1 ? 1 : 0;

  const presenceGlow =
    presenceLevel === 3
      ? "shadow-[0_0_0_1px_rgba(241,174,184,0.55),0_18px_40px_rgba(241,174,184,0.18)]"
      : presenceLevel === 2
      ? "shadow-[0_0_0_1px_rgba(241,174,184,0.40),0_14px_32px_rgba(241,174,184,0.14)]"
      : presenceLevel === 1
      ? "shadow-[0_0_0_1px_rgba(241,174,184,0.28),0_10px_24px_rgba(241,174,184,0.10)]"
      : "shadow-sm";

  return (
    <div className={`relative rounded-2xl border bg-white p-6 ${style.border} ${presenceGlow}`}>
      {/* Soft mood wash */}
      <div className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${style.wash}`} />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between">
        <p className="text-[15px] leading-relaxed text-warm-gray-700">{text}</p>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs tracking-wide text-warm-gray-600">{style.label}</span>

          {/* Decorative MoodDrop mark */}
          <img
            src={droplet}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="h-12 w-12 opacity-80 select-none"
          />
        </div>
      </div>
    </div>
  );
}
