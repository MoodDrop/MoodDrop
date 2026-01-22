import { useId, useState } from "react";
import { Link } from "wouter";

export default function Footer() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <footer className="relative mt-10 overflow-hidden bg-[#FFF7F9]">
      {/* Petals layer */}
      <div className="pointer-events-none absolute inset-0">
        <span className="petal petal-1" />
        <span className="petal petal-2" />
        <span className="petal petal-3" />
        <span className="petal petal-4" />
        <span className="petal petal-5" />
      </div>

      {/* Soft atmospheric band */}
      <div className="h-[8px] w-full bg-gradient-to-r from-[#F4CBD2]/60 via-[#FFF7F9] to-[#F1AEB8]/50" />

      {/* Footer content */}
      <div className="relative z-10 border-t border-black/5">
        <div className="mx-auto max-w-5xl px-6 py-8">
          {/* Tagline */}
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-10 bg-black/10" />
            <span className="text-[11px] tracking-wide text-[#8B7B7E]">
              A quiet space to breathe, release, and reset.
            </span>
            <span className="h-[1px] w-10 bg-black/10" />
          </div>

          {/* Care & Support trigger */}
          <div className="mt-4 flex flex-col items-center">
            <button
              type="button"
              className="group inline-flex items-center gap-2 text-sm text-[#4A3F41]"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="relative">
                Care &amp; Support
                <span className="absolute left-0 right-0 -bottom-1 h-[2px] rounded-full bg-[#F4CBD2]/70 opacity-70 transition-opacity group-hover:opacity-100" />
              </span>
              <span className="text-[#6D5E61] opacity-70" aria-hidden="true">
                {open ? "˄" : "˅"}
              </span>
            </button>

            <p className="mt-1 text-xs text-[#6D5E61]">
              Resources are here if you need them.
            </p>
          </div>

          {/* Care & Support reveal */}
          <div
            id={panelId}
            className={[
              "overflow-hidden transition-all duration-500 ease-out",
              open ? "max-h-[520px] opacity-100 mt-5" : "max-h-0 opacity-0 mt-0",
            ].join(" ")}
          >
            <div className="relative mx-auto max-w-2xl">
              {/* Soft ribbon accent */}
              <div className="absolute left-0 top-0 h-full w-[2px] rounded-full bg-[#F1AEB8]/40" />

              <div className="pl-6 pr-2 space-y-3">
                <p className="text-sm leading-relaxed text-[#6D5E61]">
                  MoodDrop is a quiet space for emotional release and reflection.
                  It isn’t a substitute for professional mental health care.
                </p>

                <p className="text-xs text-[#8B7B7E]">
                  If you’re feeling overwhelmed or in crisis, support is available:
                </p>

                <ul className="space-y-3 text-sm text-[#6D5E61]">
                  <li className="flex items-start justify-between gap-4">
                    <span>U.S. Suicide &amp; Crisis Lifeline</span>
                    <span className="font-medium text-[#4A3F41]">988</span>
                  </li>

                  <li className="flex items-start justify-between gap-4">
                    <span>Crisis Text Line (U.S./Canada)</span>
                    <span className="font-medium text-[#4A3F41]">
                      Text HELLO to 741741
                    </span>
                  </li>

                  <li className="flex items-start justify-between gap-4">
                    <span>International help</span>
                    <a
                      href="https://findahelpline.com"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[#4A3F41] underline underline-offset-4 decoration-[#F4CBD2]/70 hover:decoration-[#F1AEB8]"
                    >
                      findahelpline.com
                    </a>
                  </li>
                </ul>

                <p className="pt-1 text-xs text-[#8B7B7E]">
                  You don’t have to hold everything alone.
                </p>
              </div>
            </div>
          </div>

          {/* Footer links */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-xs text-[#8B7B7E]">
              MoodDrop © {new Date().getFullYear()}
            </p>

            <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-[#6D5E61]">
              <Link href="/about" className="hover:text-[#4A3F41]">
                About
              </Link>
              <span className="opacity-30">•</span>
              <Link href="/qa" className="hover:text-[#4A3F41]">
                Q&amp;A
              </Link>
              <span className="opacity-30">•</span>
              <Link href="/privacy" className="hover:text-[#4A3F41]">
                Privacy
              </Link>
              <span className="opacity-30">•</span>
              <Link href="/contact" className="hover:text-[#4A3F41]">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
