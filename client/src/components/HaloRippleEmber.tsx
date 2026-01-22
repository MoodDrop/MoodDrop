// client/src/components/HaloRippleEmber.tsx
import React from "react";
import { motion } from "framer-motion";

type EchoType = "text" | "voice";

type HaloRippleEmberProps = {
  type: EchoType;
  onClick?: () => void;
  dateLabel?: string; // optional hover label under the ember
  className?: string;
};

export default function HaloRippleEmber({
  type,
  onClick,
  dateLabel,
  className = "",
}: HaloRippleEmberProps) {
  const centerLabel = type === "voice" ? "Listen" : "Read";

  return (
    <>
      {/* Local styles so you don't have to hunt in CSS */}
      <style>
        {`
          @keyframes md-ripple {
            0%   { transform: scale(1);   opacity: 0.35; }
            70%  { transform: scale(1.55); opacity: 0; }
            100% { transform: scale(1.7);  opacity: 0; }
          }
          @keyframes md-halo-breathe {
            0%,100% { transform: scale(1);    opacity: 0.9; }
            50%     { transform: scale(1.03); opacity: 1; }
          }
        `}
      </style>

      <motion.button
        type="button"
        onClick={onClick}
        className={[
          "group absolute cursor-pointer select-none",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(210,160,170,0.35)]",
          className,
        ].join(" ")}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.98 }}
        aria-label={type === "voice" ? "Listen to echo" : "Read echo"}
      >
        <div className="relative h-16 w-16">
          {/* Outer soft halo */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.55), rgba(245,215,220,0.22), rgba(255,255,255,0.06))",
              border: "1px solid rgba(210,160,170,0.18)",
              boxShadow: "0 18px 55px rgba(210,160,170,0.16)",
              animation: "md-halo-breathe 5.8s ease-in-out infinite",
            }}
          />

          {/* Ripple rings */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px solid rgba(210,160,170,0.18)",
              animation: "md-ripple 3.2s ease-out infinite",
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px solid rgba(210,160,170,0.12)",
              animation: "md-ripple 3.2s ease-out infinite",
              animationDelay: "1.2s",
            }}
          />

          {/* Inner “still pond” core */}
          <div
            className="absolute inset-[10px] rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(210,160,170,0.20)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <span
              className="text-[10px] uppercase"
              style={{
                letterSpacing: "0.24em",
                color: "rgba(35,28,28,0.55)",
              }}
            >
              {centerLabel}
            </span>
          </div>
        </div>

        {/* Hover date label */}
        {dateLabel ? (
          <div className="pointer-events-none absolute left-1/2 top-[74px] -translate-x-1/2 whitespace-nowrap opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span
              className="text-[10px] italic"
              style={{ color: "rgba(35,28,28,0.45)" }}
            >
              {dateLabel}
            </span>
          </div>
        ) : null}
      </motion.button>
    </>
  );
}
