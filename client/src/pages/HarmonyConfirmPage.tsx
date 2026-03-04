import React from "react";
import { useLocation } from "wouter";
import { motion, useReducedMotion } from "framer-motion";

export default function HarmonyConfirmPage() {
  const reducedMotion = useReducedMotion();
  const [, setLocation] = useLocation();

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center px-6 py-16">
      {/* Soft ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,230,238,0.6),transparent_60%),radial-gradient(circle_at_70%_40%,rgba(255,240,220,0.4),transparent_55%)]" />
      </div>

      <motion.div
        className="mx-auto w-full max-w-[520px] text-center"
        initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* Header */}
        <h1 className="font-serif text-[26px] leading-tight text-[#2e2424] sm:text-[30px]">
          Your Harmony has begun.
        </h1>

        {/* Body */}
        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[#5a4c4c]/85">
          <p>
            Your Harmony is now being gently shaped.
            <br />
            Your preview will arrive within 24 hours.
          </p>

          <p className="text-[14px] text-[#6a5a5a]/75">
            If you don’t see it, check your spam or promotions folder just in case.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-col items-center space-y-4">
          <button
            onClick={() => setLocation("/")}
            className="w-[220px] rounded-2xl bg-[#2e2424] px-5 py-2.5 text-[14px] font-medium text-white shadow-sm transition hover:opacity-95 active:scale-[0.98]"
          >
            Return to MoodDrop
          </button>

          <button
            onClick={() => setLocation("/dashboard")}
            className="text-[13px] text-[#6a5a5a] hover:underline"
          >
            Explore the app →
          </button>
        </div>
      </motion.div>
    </div>
  );
}