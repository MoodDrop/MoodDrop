import React from "react";
import { SharedCanvas } from "@/lib/livingGallery";

type CanvasViewerProps = {
  canvas: SharedCanvas | null;
  onClose: () => void;
};

export default function CanvasViewer({
  canvas,
  onClose,
}: CanvasViewerProps) {
  if (!canvas) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-slate-500">
            {canvas.mood}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-800"
          >
            Close
          </button>
        </div>

        <p className="whitespace-pre-wrap leading-7 text-slate-700">
          {canvas.text}
        </p>

        <p className="mt-4 text-xs italic text-slate-400">
          This moment was shared anonymously.
        </p>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Witnessed by {canvas.witness_count ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
}