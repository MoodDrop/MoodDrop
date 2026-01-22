// client/src/components/GhostMenu.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type GhostMenuProps = {
  hiddenOnRoutes?: string[];
};

type MenuItem = {
  label: string;
  href: string;
  sub?: string;
};

export default function GhostMenu({ hiddenOnRoutes = [] }: GhostMenuProps) {
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  const isHidden = hiddenOnRoutes.includes(location);

  const items: MenuItem[] = useMemo(
    () => [
      { label: "Echoes", href: "/vault", sub: "Echo Vault" },
      { label: "Explore", href: "/garden", sub: "Mood Garden" },
      { label: "Rest", href: "/calm-studio", sub: "Calm Studio" },
      { label: "Read", href: "/soft-reads", sub: "Soft Reads" },
    ],
    []
  );

  // Close on ESC
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Lock background scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (isHidden) return null;

  const go = (href: string) => {
    setOpen(false);
    setLocation(href);
  };

  /* Motion: Gallery / Lobby */
  const overlayVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: reducedMotion ? 0.2 : 0.36,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: reducedMotion ? 0.18 : 0.26,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const blurLayerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delay: reducedMotion ? 0 : 0.08,
        duration: reducedMotion ? 0.2 : 0.32,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: reducedMotion ? 0.16 : 0.22,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const panelVariants = {
    hidden: {
      opacity: 0,
      y: reducedMotion ? 0 : 8,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        delay: reducedMotion ? 0 : 0.18,
        duration: reducedMotion ? 0.22 : 0.34,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: reducedMotion ? 0.18 : 0.22,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const listVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.05,
        delayChildren: reducedMotion ? 0 : 0.02,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: reducedMotion ? 0.18 : 0.22,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: reducedMotion ? 0.12 : 0.16,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <>
      {/* Menu trigger */}
      <div className="fixed top-6 right-6 z-[60]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-3 py-2 text-[11px] tracking-[0.3em] uppercase opacity-50 hover:opacity-90 transition-opacity"
          style={{ color: "rgba(35,28,28,0.82)" }}
        >
          Menu
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70]"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={overlayVariants}
          >
            {/* Atmosphere */}
            <button
              type="button"
              className="absolute inset-0 w-full h-full"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,244,240,0.65), rgba(252,232,225,0.52), rgba(249,244,240,0.70))",
              }}
            />

            {/* Blur */}
            <motion.div
              className="absolute inset-0"
              variants={blurLayerVariants}
              style={{
                backdropFilter: reducedMotion ? "blur(8px)" : "blur(12px)",
                WebkitBackdropFilter: reducedMotion ? "blur(8px)" : "blur(12px)",
              }}
            />

            {/* Content */}
            <motion.div
              className="relative h-full w-full px-8 py-10 flex flex-col items-center justify-center text-center"
              variants={panelVariants}
            >
              {/* Close */}
              <div className="absolute top-6 right-6">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 text-[11px] tracking-[0.3em] uppercase opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: "rgba(35,28,28,0.82)" }}
                >
                  Close
                </button>
              </div>

              {/* Menu */}
              <nav className="w-full max-w-sm">
                <motion.ul
                  className="flex flex-col gap-5"
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                >
                  {items.map((item) => (
                    <motion.li key={item.href} variants={itemVariants}>
                      <button
                        type="button"
                        onClick={() => go(item.href)}
                        className="w-full rounded-3xl px-8 py-5 text-left"
                        style={{
                          background: "rgba(255,255,255,0.40)",
                          border: "1px solid rgba(210,160,170,0.18)",
                          boxShadow: "0 12px 30px rgba(210,160,170,0.14)",
                        }}
                      >
                        <div
                          className="text-[26px] leading-tight"
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            color: "rgba(35,28,28,0.92)",
                          }}
                        >
                          {item.label}
                        </div>

                        {item.sub && (
                          <div
                            className="mt-1 text-[13px] italic"
                            style={{ color: "rgba(35,28,28,0.52)" }}
                          >
                            {item.sub}
                          </div>
                        )}
                      </button>
                    </motion.li>
                  ))}
                </motion.ul>
              </nav>

              <p
                className="mt-10 text-[12px] italic tracking-wide"
                style={{ color: "rgba(35,28,28,0.42)" }}
              >
                A quiet map. Nothing urgent.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
