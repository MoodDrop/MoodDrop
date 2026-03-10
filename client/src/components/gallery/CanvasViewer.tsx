import React from "react";
import { SharedCanvas } from "@/lib/livingGallery";

type CanvasViewerProps = {
  canvas: SharedCanvas | null;
  onClose: () => void;
  onWitnessed: (canvas: SharedCanvas) => void;
};

export default function CanvasViewer({
  canvas,
  onClose,
  onWitnessed,
}: CanvasViewerProps) {
  if (!canvas) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="max-w-lg w-full rounded-3xl bg-white p-6 shadow-xl">

        <div className="flex justify-between items-center mb-4">
          <span className="text-xs uppercase tracking-widest text-slate-500">
            {canvas.mood}
          </span>

          <button
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-800"
          >
            Close
          </button>
        </div>

        <p className="text-slate-700 whitespace-pre-wrap leading-7">
          {canvas.text}
        </p>

        <div className="mt-6 flex justify-between items-center">

          <span className="text-xs text-slate-400">
            Witnessed by {canvas.witness_count ?? 0}
          </span>

          <button
            onClick={() =>
              onWitnessed({
                ...canvas,
                witness_count: (canvas.witness_count ?? 0) + 1,
              })
            }
            className="rounded-full bg-slate-900 text-white px-4 py-2 text-sm"
          >
            Witness
          </button>

        </div>
      </div>
    </div>
  );
}