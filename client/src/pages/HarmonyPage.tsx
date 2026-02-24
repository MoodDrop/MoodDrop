import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function HarmonyPage() {
  const reducedMotion = useReducedMotion();

  // Direct embed URL (no script needed)
  const TALLY_EMBED =
    "https://tally.so/embed/yP6a84?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1";

  return (
    <div className="relative mx-auto w-full max-w-[860px] px-5 pb-16 pt-10 sm:px-8">
      {/* Soft atmospheric background */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(255,230,238,0.75),transparent_60%),radial-gradient(circle_at_70%_35%,rgba(255,240,220,0.45),transparent_55%),radial-gradient(circle_at_50%_85%,rgba(255,215,235,0.35),transparent_60%)]" />
      </div>

      {/* Header */}
      <div className="text-center">
        <h1 className="font-serif text-[34px] leading-tight text-[#2e2424] sm:text-[42px]">
          Harmony
        </h1>

        <p className="mx-auto mt-4 max-w-[560px] text-[15px] leading-relaxed text-[#5a4c4c]/85">
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
        <br />
<br />
Once your Harmony is being shaped, your 30–45 second sample will arrive within 24 hours.
<br />
Each submission is reviewed personally.
<br />
If it feels like home, you may unlock the full version.
          <br />
          <br />
          Limited weekly availability.
        </p>
      </div>

      {/* Soft divider to reduce “dominates the page” feeling */}
      <div className="mx-auto mt-8 h-px w-full max-w-[640px] bg-white/25" />

      {/* Form Card (narrow + contained) */}
      <motion.div
        className="mx-auto mt-6 rounded-[28px] border border-white/18 bg-white/16 p-4 backdrop-blur-2xl shadow-[0_18px_45px_-28px_rgba(20,10,20,0.45)] sm:p-5"
        style={{ maxWidth: 600 }}
        initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="mb-3 text-center text-[12.5px] text-[#6a5a5a]/70">
          When you’re ready, begin below.
        </div>

        {/* Extra containment: narrower inner width */}
        <div className="mx-auto max-w-[520px] rounded-2xl border border-white/16 bg-white/10 p-2 backdrop-blur-xl">
          <iframe
            src={TALLY_EMBED}
            title="Harmony — A Song Shaped From Your Story"
            className="w-full"
            style={{
              height: 980, // adjust if needed
              border: 0,
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}