import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import {
  Droplet,
  Archive,
  Route,
  HeartHandshake,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/**
 * MoodDrop — Reflections
 * Phase 1: visual sanctuary + emotional continuity (no analytics, no metrics)
 */

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function useLocalDayPart() {
  // Uses device local time only (privacy-safe). No timezone storage.
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 22) return "evening";
  return "night";
}

function PresenceRing({
  variant = "halo",
}: {
  variant?: "clean" | "halo";
}) {
  // "halo" = soft luminous arc (not progress)
  // "clean" = simple ring
  return (
    <div className="relative mx-auto grid aspect-square w-[220px] place-items-center sm:w-[260px]">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 rounded-full blur-2xl opacity-70 bg-[radial-gradient(circle_at_50%_50%,rgba(255,220,230,0.75),rgba(255,220,230,0.1),transparent_65%)]" />

      {/* subtle floating dust (very light) */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-[18%] top-[22%] h-2 w-2 rounded-full bg-white/40 blur-[1px]" />
        <div className="absolute left-[68%] top-[35%] h-1.5 w-1.5 rounded-full bg-white/35 blur-[1px]" />
        <div className="absolute left-[45%] top-[72%] h-1.5 w-1.5 rounded-full bg-white/30 blur-[1px]" />
      </div>

      {/* ring */}
      <svg
        viewBox="0 0 200 200"
        className="relative h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="md-center" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="55%" stopColor="rgba(255,235,242,0.45)" />
            <stop offset="100%" stopColor="rgba(255,235,242,0.0)" />
          </radialGradient>

          <linearGradient id="md-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,210,225,0.95)" />
            <stop offset="55%" stopColor="rgba(255,240,210,0.85)" />
            <stop offset="100%" stopColor="rgba(255,205,225,0.9)" />
          </linearGradient>

          <filter id="md-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="
                1 0 0 0 0
                0 0.85 0 0 0
                0 0 0.95 0 0
                0 0 0 0.85 0"
              result="tint"
            />
            <feMerge>
              <feMergeNode in="tint" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* center haze */}
        <circle cx="100" cy="100" r="62" fill="url(#md-center)" />

        {/* base ring (clean) */}
        <circle
          cx="100"
          cy="100"
          r="68"
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="10"
        />
        <circle
          cx="100"
          cy="100"
          r="68"
          fill="none"
          stroke="rgba(255,215,230,0.55)"
          strokeWidth="6"
          filter="url(#md-glow)"
        />

        {/* halo arc (not progress, just presence trace) */}
        {variant === "halo" && (
          <>
            <path
              d="M 100 32
                 A 68 68 0 0 1 164 92"
              fill="none"
              stroke="url(#md-ring)"
              strokeWidth="10"
              strokeLinecap="round"
              filter="url(#md-glow)"
              opacity="0.95"
            />
            <path
              d="M 44 128
                 A 68 68 0 0 0 100 168"
              fill="none"
              stroke="url(#md-ring)"
              strokeWidth="7"
              strokeLinecap="round"
              filter="url(#md-glow)"
              opacity="0.55"
            />
          </>
        )}
      </svg>

      {/* inner soft orb */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-full"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-[18%] rounded-full bg-white/25 blur-xl" />
      </motion.div>
    </div>
  );
}

function ReflectionCard({
  title,
  body,
  icon,
  onClick,
}: {
  title: string;
  body: React.ReactNode;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.995 }}
      className={cn(
        "group w-full text-left",
        "rounded-3xl p-5 sm:p-6",
        "bg-white/22 backdrop-blur-xl",
        "border border-white/20",
        "shadow-[0_18px_45px_-28px_rgba(20,10,20,0.45)]",
        "transition",
        "hover:bg-white/26"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl bg-white/20 border border-white/15">
          <div className="opacity-80">{icon}</div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="truncate font-serif text-[22px] leading-tight text-[#3a2f2f]">
              {title}
            </h3>
            <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-60" />
          </div>
          <div className="mt-2 text-[15px] leading-relaxed text-[#5a4c4c]/90">
            {body}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export default function ReflectionsPage() {
  const [, setLocation] = useLocation();
  const dayPart = useLocalDayPart();

  const subtitle = useMemo(() => {
    // subtle, non-metric reinforcement. Changes only in tone.
    switch (dayPart) {
      case "morning":
        return "A quiet mirror for what’s beginning to shift.";
      case "evening":
        return "A quiet mirror for what you’re unwinding from.";
      case "night":
        return "A quiet mirror for what you’re carrying tonight.";
      default:
        return "A quiet mirror of your journey.";
    }
  }, [dayPart]);

  return (
    <div className="relative mx-auto w-full max-w-[920px] px-5 pb-16 pt-10 sm:px-8">
      {/* page veil / atmospheric wash */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(255,230,238,0.75),transparent_60%),radial-gradient(circle_at_70%_35%,rgba(255,240,220,0.45),transparent_55%),radial-gradient(circle_at_50%_85%,rgba(255,215,235,0.35),transparent_60%)]" />
      </div>

      {/* top bar */}
      <div className="mb-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setLocation("/")}
          className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/20 px-4 py-2 text-sm text-[#4b3f3f]/90 backdrop-blur-md hover:bg-white/25"
        >
          <ChevronLeft className="h-4 w-4 opacity-70" />
          Back
        </button>

        <div className="text-xs tracking-[0.25em] text-[#6b5a5a]/70">
          REFLECTIONS
        </div>
      </div>

      {/* header */}
      <div className="text-center">
        <h1 className="font-serif text-[46px] leading-[1.05] text-[#2e2424] sm:text-[56px]">
          Reflections
        </h1>
        <p className="mx-auto mt-3 max-w-[560px] text-[16px] leading-relaxed text-[#5a4c4c]/85">
          {subtitle}
        </p>
      </div>

      {/* presence card */}
      <motion.div
        className="mt-10 rounded-[34px] border border-white/18 bg-white/18 p-6 backdrop-blur-2xl sm:p-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <div className="grid gap-8 sm:grid-cols-[320px_1fr] sm:items-center">
          <PresenceRing variant="halo" />

          <div className="text-left">
            <h2 className="font-serif text-[28px] leading-tight text-[#2f2525]">
              Presence
            </h2>
            <p className="mt-3 text-[15.5px] leading-relaxed text-[#5a4c4c]/90">
              You’ve returned to this space.
              <br />
              Each visit is held gently.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/18 px-4 py-2 text-sm text-[#4b3f3f]/85">
              <span className="inline-flex h-2 w-2 rounded-full bg-[#f2b8c8]/70" />
              No tracking. No pressure.
            </div>
          </div>
        </div>
      </motion.div>

      {/* cards */}
      <div className="mt-8 grid gap-5">
        <ReflectionCard
          title="Echo Archive"
          icon={<Archive className="h-5 w-5" />}
          body={
            <>
              Your words remain safely held.
              <br />
              Nothing shared here is ever lost.
            </>
          }
          onClick={() => setLocation("/echo-vault")}
        />

        <ReflectionCard
          title="Sanctuary Paths"
          icon={<Route className="h-5 w-5" />}
          body={
            <>
              You’ve moved through spaces designed to hold you.
              <br />
              Each step becomes part of your quiet landscape.
            </>
          }
          onClick={() => setLocation("/")}
        />

        <ReflectionCard
          title="Held Space"
          icon={<HeartHandshake className="h-5 w-5" />}
          body={
            <>
              This space remembers your presence.
              <br />
              You are always welcome here.
            </>
          }
        />
      </div>

      {/* footer whisper */}
      <div className="mt-10 text-center text-sm text-[#6a5a5a]/70">
        Take what you need. Leave the rest.
      </div>
    </div>
  );
}
