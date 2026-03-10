// client/src/components/gallery/CanvasCard.tsx
import React from "react";
import { SharedCanvas, getPreviewText } from "@/lib/livingGallery";

type CanvasCardProps = {
  canvas: SharedCanvas;
  onOpen?: (canvas: SharedCanvas) => void;
};

function getMoodStampClasses(mood?: string | null) {
  switch (mood) {
    case "CrashOut":
      return "text-rose-700 border-rose-200 bg-rose-50/80";
    case "Overwhelmed":
      return "text-violet-700 border-violet-200 bg-violet-50/80";
    case "Healing":
      return "text-emerald-700 border-emerald-200 bg-emerald-50/80";
    case "Hopeful":
      return "text-amber-700 border-amber-200 bg-amber-50/80";
    case "Reflective":
      return "text-sky-700 border-sky-200 bg-sky-50/80";
    case "Lonely":
      return "text-slate-600 border-slate-200 bg-slate-50/80";
    case "Grateful":
      return "text-rose-600 border-rose-100 bg-rose-50/60";
    default:
      return "text-slate-600 border-slate-200 bg-white/70";
  }
}

function getLetterTone(mood?: string | null) {
  switch (mood) {
    case "CrashOut":
      return "bg-[linear-gradient(180deg,rgba(255,245,246,0.96)_0%,rgba(255,250,250,0.92)_100%)]";
    case "Overwhelmed":
      return "bg-[linear-gradient(180deg,rgba(247,245,255,0.96)_0%,rgba(252,250,255,0.92)_100%)]";
    case "Healing":
      return "bg-[linear-gradient(180deg,rgba(244,252,248,0.96)_0%,rgba(250,255,252,0.92)_100%)]";
    case "Hopeful":
      return "bg-[linear-gradient(180deg,rgba(255,251,242,0.96)_0%,rgba(255,253,248,0.92)_100%)]";
    case "Reflective":
      return "bg-[linear-gradient(180deg,rgba(244,249,255,0.96)_0%,rgba(250,252,255,0.92)_100%)]";
    default:
      return "bg-[linear-gradient(180deg,rgba(255,252,250,0.96)_0%,rgba(255,255,255,0.92)_100%)]";
  }
}

function getRotationClass(id: string) {
  const rotations = [
    "rotate-[-1deg]",
    "rotate-[0.8deg]",
    "rotate-[-0.6deg]",
    "rotate-[1deg]",
    "rotate-0",
  ];
  const index = id.charCodeAt(id.length - 1) % rotations.length;
  return rotations[index];
}

export function CanvasCard({ canvas, onOpen }: CanvasCardProps) {
  const preview = getPreviewText(canvas.text, 60);
  const stampClasses = getMoodStampClasses(canvas.mood);
  const toneClass = getLetterTone(canvas.mood);
  const rotationClass = getRotationClass(canvas.id);

  return (
    <button
      type="button"
      onClick={() => onOpen?.(canvas)}
      className={`group w-full rounded-[28px] border border-white/70 ${toneClass} ${rotationClass} p-3 text-left shadow-[0_16px_40px_rgba(120,90,90,0.08)] transition duration-300 hover:rotate-0 hover:shadow-[0_20px_50px_rgba(120,90,90,0.12)]`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.18em] ${stampClasses}`}
        >
          {canvas.mood || "Shared Moment"}
        </span>
      </div>

      <div className="mt-3">
        <p className="line-clamp-1 whitespace-pre-wrap text-[13px] leading-6 text-[#5b4d4d]">
          {preview}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-[11px] italic text-[#9a8b8b]">
          left softly
        </span>
        <span className="text-[11px] uppercase tracking-[0.16em] text-[#b5a8a8] transition group-hover:text-[#8f7f7f]">
          Witnessed by {canvas.witness_count ?? 0}
        </span>
      </div>
    </button>
  );
}