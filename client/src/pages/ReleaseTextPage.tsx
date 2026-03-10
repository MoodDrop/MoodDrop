import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { X } from "lucide-react";
import { saveEchoLocal } from "@/lib/EchoVaultLocal";
import { supabase } from "@/lib/supabaseClient";

// ✅ Droplet sound
import dropletSfx from "../assets/sounds/moodDrop-droplet.m4a";

const MOODS = [
  { key: "Calm", hint: "Soft, steady, quieter inside." },
  { key: "Tense", hint: "Restless, tight-chested, mentally ‘on.’" },
  { key: "Overwhelmed", hint: "Too much at once. Too loud." },
  { key: "Grounded", hint: "Present. Here. In your body." },
  { key: "Joy", hint: "Lightness returning." },
  { key: "CrashOut", hint: "Raw. Sharp. Unfiltered." },
];

type ReleaseDestination = "vault" | "gallery" | null;

export default function ReleaseTextPage() {
  const [, setLocation] = useLocation();

  const [mood, setMood] = useState(MOODS[0].key);
  const [text, setText] = useState("");

  const [released, setReleased] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [releaseDestination, setReleaseDestination] =
    useState<ReleaseDestination>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moodHint = useMemo(
    () => MOODS.find((m) => m.key === mood)?.hint ?? "",
    [mood]
  );

  const canDrop = text.trim().length > 0;

  const goBack = () => setLocation("/");
  const goVoice = () => setLocation("/release/voice");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const a = new Audio(dropletSfx);
    a.preload = "auto";
    a.volume = 0.45;
    audioRef.current = a;

    return () => {
      audioRef.current = null;
    };
  }, []);

  const playDropSound = async () => {
    try {
      const a = audioRef.current;
      if (!a) return;

      a.currentTime = 0;
      const p = a.play();
      if (p && typeof (p as Promise<void>).catch === "function") {
        await (p as Promise<void>).catch(() => {});
      }
    } catch {
      // ignore sound errors
    }
  };

  const openDestinationModal = () => {
    if (!text.trim() || isSubmitting) return;
    setShowDestinationModal(true);
  };

  const finishRelease = async (destination: "vault" | "gallery") => {
    await playDropSound();
    setReleaseDestination(destination);
    setReleased(true);
    setText("");
    setShowDestinationModal(false);
  };

  const handleSendToVault = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      setIsSubmitting(true);

      saveEchoLocal({
        type: "text",
        mood,
        content: trimmed,
      });

      await finishRelease("vault");
    } catch (error) {
      console.error("Error saving to Echo Vault:", error);
      alert("Failed to save your release. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShareToGallery = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      setIsSubmitting(true);

      // Save privately too
      saveEchoLocal({
        type: "text",
        mood,
        content: trimmed,
      });

      const { error } = await supabase.from("drops").insert([
        {
          text: trimmed,
          mood,
          is_shared: true,
        },
      ]);

      if (error) {
        console.error("Error sharing to Living Gallery:", error);
        alert(
          "Your release was saved to Echo Vault, but it could not be shared to the Living Gallery."
        );
        await finishRelease("vault");
        return;
      }

      await finishRelease("gallery");
    } catch (error) {
      console.error("Error sharing release:", error);
      alert("Failed to share your release. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!released) return;

    const t = window.setTimeout(() => {
      setReleased(false);

      if (releaseDestination === "gallery") {
        setLocation("/living-gallery");
      } else {
        setLocation("/vault");
      }

      setReleaseDestination(null);
    }, 1100);

    return () => window.clearTimeout(t);
  }, [released, releaseDestination, setLocation]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 15%, rgba(255, 240, 235, 0.92), rgba(252, 232, 225, 0.70), rgba(249, 244, 240, 0.98))",
        }}
      />
      <div className="pointer-events-none absolute inset-0 mooddrop-grain opacity-20" />

      <section className="relative mx-auto flex min-h-screen max-w-md flex-col px-6 pb-10 pt-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            className="h-10 w-10 rounded-full"
            style={{
              background: "rgba(255,255,255,0.50)",
              border: "1px solid rgba(210,160,170,0.18)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
            aria-label="Back"
          >
            <span style={{ color: "rgba(35,28,28,0.72)" }}>←</span>
          </button>

          <div className="flex-1">
            <div
              className="text-[20px] leading-tight"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "rgba(35,28,28,0.88)",
              }}
            >
              Release
            </div>
            <div
              className="text-[12px] italic"
              style={{ color: "rgba(35,28,28,0.52)" }}
            >
              Nothing needs to be fixed here.
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div
            className="rounded-3xl px-5 py-4"
            style={{
              background: "rgba(255,255,255,0.52)",
              border: "1px solid rgba(210,160,170,0.18)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "0 16px 40px rgba(210,160,170,0.14)",
            }}
          >
            <div
              className="text-[11px] uppercase"
              style={{
                letterSpacing: "0.26em",
                color: "rgba(35,28,28,0.46)",
              }}
            >
              Mood
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {MOODS.map((m) => {
                const active = m.key === mood;

                const pillStyle: React.CSSProperties = {
                  background: active
                    ? "rgba(255,255,255,0.74)"
                    : "rgba(255,255,255,0.34)",
                  border: active
                    ? "1px solid rgba(210,160,170,0.46)"
                    : "1px solid rgba(210,160,170,0.16)",
                  color: active
                    ? "rgba(35,28,28,0.82)"
                    : "rgba(35,28,28,0.60)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  boxShadow: active
                    ? "0 12px 28px rgba(210,160,170,0.20), 0 0 0 1px rgba(255,255,255,0.28) inset"
                    : "none",
                  transform: active ? "scale(1.02)" : "scale(1)",
                  transition:
                    "transform 200ms ease, box-shadow 250ms ease, background 250ms ease, border-color 250ms ease, color 250ms ease",
                };

                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setMood(m.key)}
                    className="rounded-full px-4 py-2 text-[12px] focus:outline-none focus-visible:ring-2"
                    style={pillStyle}
                    aria-pressed={active}
                  >
                    {m.key}
                  </button>
                );
              })}
            </div>

            <div
              className="mt-3 text-[12px] italic"
              style={{ color: "rgba(35,28,28,0.52)" }}
            >
              {moodHint}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-2xl px-4 py-3 text-[13px] uppercase"
            style={{
              letterSpacing: "0.22em",
              background: "rgba(255,255,255,0.60)",
              border: "1px solid rgba(210,160,170,0.20)",
              color: "rgba(35,28,28,0.74)",
              boxShadow: "0 12px 30px rgba(210,160,170,0.12)",
            }}
          >
            Write
          </button>

          <button
            type="button"
            onClick={goVoice}
            className="flex-1 rounded-2xl px-4 py-3 text-[13px] uppercase"
            style={{
              letterSpacing: "0.22em",
              background: "rgba(255,255,255,0.34)",
              border: "1px solid rgba(210,160,170,0.16)",
              color: "rgba(35,28,28,0.62)",
            }}
          >
            Voice
          </button>
        </div>

        <div className="mt-6 flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Let it land here…"
            className="h-[44vh] w-full resize-none rounded-3xl p-5 text-[14px] outline-none"
            style={{
              background: "rgba(255,255,255,0.45)",
              border: "1px solid rgba(210,160,170,0.16)",
              color: "rgba(35,28,28,0.78)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          />
          <div
            className="mt-3 text-center text-[12px] italic"
            style={{
              color: "rgba(35,28,28,0.46)",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Whenever you’re ready.
          </div>
        </div>

        <button
          type="button"
          disabled={!canDrop || released || isSubmitting}
          onClick={openDestinationModal}
          className="mt-6 w-full rounded-3xl px-6 py-4 text-[12px] uppercase transition-opacity"
          style={{
            letterSpacing: "0.28em",
            background:
              canDrop && !released
                ? "rgba(255,255,255,0.62)"
                : "rgba(255,255,255,0.28)",
            border: "1px solid rgba(210,160,170,0.18)",
            color:
              canDrop && !released
                ? "rgba(35,28,28,0.78)"
                : "rgba(35,28,28,0.42)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow:
              canDrop && !released
                ? "0 18px 44px rgba(210,160,170,0.16)"
                : "none",
            opacity: canDrop && !released ? 1 : 0.75,
          }}
        >
          Drop it
        </button>
      </section>

      {showDestinationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-[28px] p-6 shadow-xl"
            style={{
              background: "rgba(255,255,255,0.88)",
              border: "1px solid rgba(210,160,170,0.18)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  className="text-[22px] italic"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "rgba(35,28,28,0.84)",
                  }}
                >
                  Where should this drop go?
                </h2>
                <p
                  className="mt-2 text-[12px]"
                  style={{ color: "rgba(35,28,28,0.58)" }}
                >
                  Choose what feels right for this moment.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDestinationModal(false)}
                className="rounded-full p-2"
                style={{ color: "rgba(35,28,28,0.54)" }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={handleSendToVault}
                disabled={isSubmitting}
                className="w-full rounded-3xl px-4 py-4 text-left transition"
                style={{
                  background: "rgba(255,255,255,0.62)",
                  border: "1px solid rgba(210,160,170,0.18)",
                  color: "rgba(35,28,28,0.80)",
                }}
              >
                <div className="text-[13px] font-medium">Send to Echo Vault</div>
                <div
                  className="mt-1 text-[11px]"
                  style={{ color: "rgba(35,28,28,0.52)" }}
                >
                  Private. Just for you.
                </div>
              </button>

              <button
                type="button"
                onClick={handleShareToGallery}
                disabled={isSubmitting}
                className="w-full rounded-3xl px-4 py-4 text-left transition"
                style={{
                  background: "rgba(255,255,255,0.62)",
                  border: "1px solid rgba(210,160,170,0.18)",
                  color: "rgba(35,28,28,0.80)",
                }}
              >
                <div className="text-[13px] font-medium">
                  Share to Living Gallery
                </div>
                <div
                  className="mt-1 text-[11px]"
                  style={{ color: "rgba(35,28,28,0.52)" }}
                >
                  Anonymous. Witnessed softly.
                </div>
                <div
                  className="mt-1 text-[10px]"
                  style={{ color: "rgba(35,28,28,0.42)" }}
                >
                  No name. No profile. No replies.
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowDestinationModal(false)}
              className="mt-4 w-full rounded-3xl px-4 py-3 text-[12px]"
              style={{
                background: "rgba(255,255,255,0.40)",
                border: "1px solid rgba(210,160,170,0.16)",
                color: "rgba(35,28,28,0.66)",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {released && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div
            className="rounded-3xl px-6 py-5 text-center"
            style={{
              background: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(210,160,170,0.20)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              boxShadow: "0 20px 60px rgba(210,160,170,0.18)",
            }}
          >
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "rgba(35,28,28,0.82)",
              }}
              className="text-[22px] italic"
            >
              It is released.
            </div>
            <div
              className="mt-2 text-[12px] italic"
              style={{ color: "rgba(35,28,28,0.52)" }}
            >
              {releaseDestination === "gallery"
                ? "Your drop has joined the Living Gallery."
                : "Your echo is waiting in the vault."}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}