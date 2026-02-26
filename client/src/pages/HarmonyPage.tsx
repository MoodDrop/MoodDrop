import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function HarmonyPage() {
  const reducedMotion = useReducedMotion();

  const TALLY_EMBED =
    "https://tally.so/embed/yP6a84?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1";

  return (
    <div className="relative mx-auto w-full max-w-[720px] px-4 pb-16 pt-10 sm:px-6">
      {/* Soft atmospheric background */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(255,230,238,0.75),transparent_60%),radial-gradient(circle_at_70%_35%,rgba(255,240,220,0.45),transparent_55%),radial-gradient(circle_at_50%_85%,rgba(255,215,235,0.35),transparent_60%)]" />
      </div>

      {/* Header */}
      <div className="text-center">
        <h1 className="font-serif text-[34px] leading-tight text-[#2e2424] sm:text-[40px]">
          Harmony
        </h1>

        <p className="italic mt-2 text-[16px] text-[#6d5c5c]">
          An Intimate Musical Reflection
        </p>

        <p className="mx-auto mt-6 max-w-[520px] text-[15px] leading-relaxed text-[#5a4c4c]/85">
          A song shaped from your story.
          <br />
          <br />
          Share what feels ready.
          <br />
          A memory. A name. A quiet truth.
          <br />
          <br />
          We’ll gently shape it into melody —
          <br />
          with care, warmth, and intention.
          <br />
          <br />
          Once your Harmony begins to take form,
          <br />
          your 30–45 second reflection will arrive within 24 hours.
          <br />
          <br />
          If it resonates, you may continue into the full 2–3 minute piece
          <br />
          or choose Signature Harmony — a keepsake-level version of your story.
          <br />
          <br />
          Each Harmony is shaped personally and in small, intentional batches
          <br />
          to protect the depth of the experience.
        </p>
      </div>

      {/* Soft divider */}
      <div className="mx-auto mt-8 h-px w-full max-w-[560px] bg-white/25" />

      {/* Form Card */}
      <motion.div
        className="mx-auto mt-6 rounded-[28px] border border-white/18 bg-white/16 p-4 backdrop-blur-2xl shadow-[0_18px_45px_-28px_rgba(20,10,20,0.45)] sm:p-5"
        style={{ maxWidth: 520 }}
        initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="mb-3 text-center text-[12.5px] text-[#6a5a5a]/70">
          When you’re ready, begin below.
        </div>

        <div className="mx-auto max-w-[480px] rounded-2xl border border-white/16 bg-white/10 p-2 backdrop-blur-xl">
          <iframe
            src={TALLY_EMBED}
            title="Harmony — An Intimate Musical Reflection"
            className="w-full"
            style={{
              height: 1050,
              border: 0,
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}