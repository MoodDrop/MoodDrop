// client/src/pages/ReleaseTextPage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { X } from "lucide-react";
import { saveEchoLocal } from "@/lib/EchoVaultLocal";
import { supabase } from "@/lib/supabaseClient";
import dropletSfx from "../assets/sounds/moodDrop-droplet.m4a";

const MOODS = [
  { key: "Calm", hint: "Soft, steady, quieter inside." },
  { key: "Anxious", hint: "Restless, tight-chested, mentally ‘on.’" },
  { key: "Overwhelmed", hint: "Too much at once. Too loud." },
  { key: "Grounded", hint: "Present. Here. In your body." },
  { key: "Joy", hint: "Lightness returning." },
  { key: "CrashOut", hint: "Raw. Sharp. Unfiltered." },
];

type ReleaseDestination = "droplets" | "gallery" | null;

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

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const a = new Audio(dropletSfx);
    a.volume = 0.45;
    audioRef.current = a;
  }, []);

  const playDropSound = async () => {
    try {
      const a = audioRef.current;
      if (!a) return;
      a.currentTime = 0;
      await a.play().catch(() => {});
    } catch {}
  };

  const finishRelease = async (destination: "droplets" | "gallery") => {
    await playDropSound();
    setReleaseDestination(destination);
    setReleased(true);
    setText("");
    setShowDestinationModal(false);
  };

  const handleSaveToDroplets = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setIsSubmitting(true);

    saveEchoLocal({
      type: "text",
      mood,
      content: trimmed,
    });

    await finishRelease("droplets");
    setIsSubmitting(false);
  };

  const handleShareToGallery = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setIsSubmitting(true);

    saveEchoLocal({
      type: "text",
      mood,
      content: trimmed,
    });

    await supabase.from("drops").insert([
      { text: trimmed, mood, is_shared: true },
    ]);

    await finishRelease("gallery");
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (!released) return;

    const t = setTimeout(() => {
      setReleased(false);

      if (releaseDestination === "gallery") {
        setLocation("/living-gallery");
      } else {
        setLocation("/my-droplets");
      }

      setReleaseDestination(null);
    }, 1200);

    return () => clearTimeout(t);
  }, [released, releaseDestination]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 15%, rgba(255, 240, 235, 0.95), rgba(252, 232, 225, 0.75), rgba(249, 244, 240, 1))",
        }}
      />

      <section className="relative mx-auto flex min-h-screen max-w-md flex-col px-6 pb-10 pt-10">

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/")}
            className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center"
          >
            ←
          </button>

          <div>
            <div className="text-[22px] font-medium">Release</div>
            <div className="text-sm italic text-gray-500">
              Nothing needs to be fixed here.
            </div>
          </div>
        </div>

        {/* MOODS */}
        <div className="mt-6 p-4 rounded-3xl bg-white/60">
          <p className="text-xs tracking-widest mb-3">MOOD</p>

          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m.key}
                onClick={() => setMood(m.key)}
                className={`px-4 py-2 rounded-full text-sm ${
                  mood === m.key ? "bg-blush-200" : "bg-white"
                }`}
              >
                {m.key}
              </button>
            ))}
          </div>

          <p className="text-xs italic mt-3 text-gray-500">{moodHint}</p>
        </div>

        {/* TEXT */}
<textarea
  value={text}
  onChange={(e) => setText(e.target.value)}
  placeholder="Let it land here…"
  className="mt-6 h-[40vh] w-full rounded-3xl p-5 bg-white/70 outline-none
             focus:ring-2 focus:ring-[rgba(210,160,170,0.45)]
             focus:shadow-[0_0_20px_rgba(210,160,170,0.25)]
             transition-all duration-300"
/>

        <p className="text-center text-sm italic mt-4 text-gray-500">
          Whenever you're ready.
        </p>

        {/* BUTTON */}
        <button
          disabled={!canDrop || released || isSubmitting}
          onClick={() => setShowDestinationModal(true)}
          className="mt-4 w-full rounded-3xl py-4 bg-white/70"
        >
          DROP IT
        </button>

        {/* MODAL */}
        {showDestinationModal && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">

              <div className="flex justify-between items-center mb-4">
                <h2 className="italic text-lg">
                  Where should this drop go?
                </h2>
                <button onClick={() => setShowDestinationModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <button
                onClick={handleSaveToDroplets}
                className="w-full mb-3 p-4 rounded-2xl bg-gray-50 text-left"
              >
                <div className="font-medium">Save to My Droplets</div>
                <div className="text-sm text-gray-500">
                  Private. Just for you.
                </div>
              </button>

              <button
                onClick={handleShareToGallery}
                className="w-full p-4 rounded-2xl bg-gray-50 text-left"
              >
                <div className="font-medium">Share to Living Gallery</div>
                <div className="text-sm text-gray-500">
                  Anonymous. Witnessed softly.
                </div>
              </button>

              <button
                onClick={() => setShowDestinationModal(false)}
                className="mt-4 w-full py-3 rounded-2xl bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* SUCCESS */}
        {released && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl italic">It is released.</div>
              <div className="mt-2 text-sm italic text-gray-500">
                {releaseDestination === "gallery"
                  ? "Your drop has joined the Living Gallery."
                  : "Your droplet is waiting in My Droplets."}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}