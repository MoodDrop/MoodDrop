import React from "react";
import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { Home, BookOpen, MessageCircle } from "lucide-react";

type ExploreCard = {
  title: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
};

export default function Dashboard() {
  const reducedMotion = useReducedMotion();

  const cards: ExploreCard[] = [
    {
      title: "Calm Studio",
      desc: "Regulate. Breathe. Reset.",
      href: "/calm-studio",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="5" />
        </svg>
      ),
    },
    {
      title: "Echo Vault",
      desc: "Private reflections, held locally.",
      href: "/vault",
      icon: <MessageCircle className="h-5 w-5" />,
    },
    {
      title: "Soft Reads",
      desc: "Grounded words for tender seasons.",
      href: "/soft-reads",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "Home",
      desc: "Return to the beginning.",
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
  ];

  return (
    <div className="relative min-h-screen px-6 py-12">
      {/* Soft ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(255,230,238,0.65),transparent_60%),radial-gradient(circle_at_75%_35%,rgba(255,240,220,0.45),transparent_55%),radial-gradient(circle_at_50%_85%,rgba(255,215,235,0.28),transparent_60%)]" />
      </div>

      <motion.div
        className="mx-auto w-full max-w-[900px]"
        initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="font-serif text-[30px] leading-tight text-[#2e2424] sm:text-[36px]">
            Explore MoodDrop
          </h1>
          <p className="mt-2 text-[14px] text-[#6a5a5a]/80">
            Choose where you’d like to land.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {cards.map((c) => (
            <Link key={c.title} href={c.href}>
              <a className="group block">
                <div
                  className={[
                    "rounded-[26px] border border-white/18 bg-white/18 p-6 backdrop-blur-2xl",
                    "shadow-[0_18px_45px_-28px_rgba(20,10,20,0.45)]",
                    "transition duration-200",
                    "hover:bg-white/22 hover:shadow-[0_22px_55px_-30px_rgba(20,10,20,0.55)]",
                    "hover:border-white/28",
                    reducedMotion ? "" : "hover:-translate-y-[1px]",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/18 bg-white/30 text-[#2e2424]">
                        {c.icon}
                      </div>
                      <div>
                        <div className="text-[16px] font-semibold text-[#2e2424]">
                          {c.title}
                        </div>
                        <div className="mt-1 text-[13px] text-[#5a4c4c]/80">
                          {c.desc}
                        </div>
                      </div>
                    </div>

                    <div className="text-[13px] text-[#6a5a5a]/70 transition group-hover:text-[#2e2424]">
                      →
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}