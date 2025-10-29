import * as React from "react";

export function Flower({
  color,
  onClick,
  title,
}: { color: string; onClick?: () => void; title?: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="group relative aspect-square w-full rounded-md grid place-items-center
                 transition-transform hover:scale-105 focus:scale-105 focus:outline-none"
    >
      {/* simple SVG flower */}
      <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 drop-shadow-sm">
        <circle cx="50" cy="30" r="12" fill={color} />
        <circle cx="70" cy="50" r="12" fill={color} />
        <circle cx="50" cy="70" r="12" fill={color} />
        <circle cx="30" cy="50" r="12" fill={color} />
        <circle cx="50" cy="50" r="10" fill="#fff7ed" stroke="#edb08b" strokeWidth="2" />
        <rect x="48" y="60" width="4" height="25" fill="#4ade80" rx="2" />
      </svg>
      {/* hover ring (no white overlay) */}
      <span className="pointer-events-none absolute inset-0 rounded-md ring-0 group-hover:ring-2 ring-rose-200" />
    </button>
  );
}
