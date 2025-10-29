import * as React from "react";
import { motion } from "framer-motion";

export function Flower({
  color,
  onClick,
  title,
  size = 1,
  rotation = 0,
  delay = 0,
}: {
  color: string;
  onClick?: () => void;
  title?: string;
  size?: number;
  rotation?: number;
  delay?: number;
}) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: delay,
      }}
      onClick={onClick}
      title={title}
      className="group absolute transition-transform hover:scale-110 focus:scale-110 focus:outline-none cursor-pointer"
      style={{
        width: `${size * 60}px`,
        height: `${size * 60}px`,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* Simple SVG flower with sway animation */}
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md"
        animate={{
          rotate: [rotation, rotation + 3, rotation - 3, rotation],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Petals */}
        <circle cx="50" cy="30" r="12" fill={color} opacity="0.9" />
        <circle cx="70" cy="50" r="12" fill={color} opacity="0.9" />
        <circle cx="50" cy="70" r="12" fill={color} opacity="0.9" />
        <circle cx="30" cy="50" r="12" fill={color} opacity="0.9" />
        {/* Center */}
        <circle cx="50" cy="50" r="10" fill="#fff7ed" stroke="#edb08b" strokeWidth="2" />
        {/* Stem */}
        <rect x="48" y="60" width="4" height="25" fill="#4ade80" rx="2" />
      </motion.svg>
      {/* Hover ring */}
      <span className="pointer-events-none absolute inset-0 rounded-full ring-0 group-hover:ring-2 ring-rose-300 opacity-60" />
    </motion.button>
  );
}
