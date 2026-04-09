import React from "react";
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
        <div className="mx-auto max-w-5xl px-6 py-9">
          {/* Tagline */}
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-10 bg-black/10" />
            <span className="text-[11px] tracking-wide text-[#8B7B7E]">
              A quiet space to breathe, release, and reset.
            </span>
            <span className="h-[1px] w-10 bg-black/10" />
          </div>

          {/* Care & Support trigger */}
          <div className="mt-5 flex flex-col items-center">
            <button
              type="button"
              className="group inline-flex items-center gap-2 text-sm text-[#4A3F41] transition-colors hover:text-[#3E3436]"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="relative">
                Care &amp; Support
                <span className="absolute left-0 right-0 -bottom-1 h-[2px] rounded-full bg-[#F4CBD2]/70 opacity-70 transition-opacity group-hover:opacity-100" />
              </span>

              <span
                className={[
                  "text-[#6D5E61] opacity-70 transition-transform duration-300",
                  open ? "rotate-180" : "rotate-0",
                ].join(" ")}
                aria-hidden="true"
              >
                ˅
              </span>
            </button>

            <p className="mt-1.5 text-xs text-[#6D5E61]">
              Resources are here if you need them.
            </p>
          </div>

          {/* Care & Support reveal */}
          <div
            id={panelId}
            className={[
              "overflow-hidden transition-all duration-500 ease-out",
              open ? "mt-5 max-h-[720px] opacity-100" : "mt-0 max-h-0 opacity-0",
            ].join(" ")}
          >
            <div className="mx-auto max-w-2xl">
              <div className="relative rounded-[24px] border border-white/60 bg-white/55 px-5 py-5 shadow-[0_10px_30px_rgba(74,63,65,0.06)] backdrop-blur-sm sm:px-6">
                {/* Soft ribbon accent */}
                <div className="absolute left-0 top-5 bottom-5 w-[3px] rounded-full bg-gradient-to-b from-[#F1AEB8]/30 via-[#F4CBD2]/70 to-[#F1AEB8]/30" />

                <div className="pl-4 sm:pl-5">
                  {/* Section label */}
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#C0A489]">
                    Support Resources
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-[#6D5E61]">
                    If you need extra support beyond MoodDrop, these resources
                    may help.
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-[#8B7B7E]">
                    MoodDrop is a quiet space for release and reflection, but it
                    is not a replacement for professional care or emergency
                    support.
                  </p>

                  <div className="mt-4 rounded-2xl border border-[#F4CBD2]/45 bg-[#FFF9FA]/80 px-4 py-4">
                    <ul className="space-y-4 text-sm text-[#6D5E61]">
                      <li className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-[#4A3F41]">
                            U.S. Suicide &amp; Crisis Lifeline
                          </p>
                          <p className="mt-1 text-xs text-[#8B7B7E]">
                            Call or text anytime
                          </p>
                        </div>
                        <span className="shrink-0 font-medium text-[#4A3F41]">
                          988
                        </span>
                      </li>

                      <li className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-[#4A3F41]">
                            Crisis Text Line
                          </p>
                          <p className="mt-1 text-xs text-[#8B7B7E]">
                            U.S. &amp; Canada
                          </p>
                        </div>
                        <span className="shrink-0 font-medium text-[#4A3F41] text-right">
                          Text HELLO
                          <br />
                          to 741741
                        </span>
                      </li>

                      <li className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-[#4A3F41]">
                            International help
                          </p>
                          <p className="mt-1 text-xs text-[#8B7B7E]">
                            Find support by country
                          </p>
                        </div>
                        <a
                          href="https://findahelpline.com"
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 font-medium text-[#4A3F41] underline underline-offset-4 decoration-[#F4CBD2]/70 hover:decoration-[#F1AEB8]"
                        >
                          findahelpline.com
                        </a>
                      </li>
                    </ul>
                  </div>

                  <p className="mt-4 text-xs text-[#8B7B7E]">
                    You don’t have to hold everything alone.
                  </p>

                  {/* Link to full support page */}
                  <div className="mt-4 border-t border-[#F4CBD2]/40 pt-3">
                    <Link
                      href="/care-support"
                      className="inline-flex items-center gap-1 text-xs text-[#6D5E61] underline underline-offset-4 decoration-[#F4CBD2]/70 transition-colors hover:text-[#4A3F41]"
                    >
                      Visit the full Care &amp; Support page
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer links */}
          <div className="mt-7 flex flex-col items-center gap-3">
            <p className="text-xs text-[#8B7B7E]">
              MoodDrop © {new Date().getFullYear()}
            </p>

            <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-[#6D5E61]">
              <Link href="/about" className="transition-colors hover:text-[#4A3F41]">
                About
              </Link>
              <span className="opacity-30">•</span>

              <Link href="/qa" className="transition-colors hover:text-[#4A3F41]">
                Q&amp;A
              </Link>
              <span className="opacity-30">•</span>

              <Link href="/privacy" className="transition-colors hover:text-[#4A3F41]">
                Privacy
              </Link>
              <span className="opacity-30">•</span>

              <Link href="/contact" className="transition-colors hover:text-[#4A3F41]">
                Contact
              </Link>
              <span className="opacity-30">•</span>

              <Link
                href="/care-support"
                className="font-medium text-[#5A4B4E] transition-colors hover:text-[#4A3F41]"
              >
                Care &amp; Support
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}