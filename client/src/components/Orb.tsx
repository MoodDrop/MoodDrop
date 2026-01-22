// client/src/components/Orb.tsx
import React from "react";

type OrbProps = {
  className?: string;
};

export function Orb({ className = "" }: OrbProps) {
  return (
    <div className={`mooddrop-breathe ${className}`} aria-hidden="true">
      <div
        style={{
          width: 160,
          height: 160,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 30%, #ffffff, #f5d7dc, #e8b6c1)",
          boxShadow: "0 22px 70px rgba(210, 160, 170, 0.24)",
        }}
      />
    </div>
  );
}
