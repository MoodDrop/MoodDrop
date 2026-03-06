import React, { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

/* ---------------- Types ---------------- */

type HarmonyForm = {
  whoCategory: string;
  whoOther: string;
  moment: string;

  qualities: string;
  memories: string;

  emotionalTone: string;
  soundStyle: string;

  voicePreference: string;
  includeName: "yes" | "no" | "";
  nameValue: string;

  email: string;
};

const INITIAL_FORM: HarmonyForm = {
  whoCategory: "",
  whoOther: "",
  moment: "",
  qualities: "",
  memories: "",
  emotionalTone: "",
  soundStyle: "",
  voicePreference: "",
  includeName: "",
  nameValue: "",
  email: "",
};

export default function HarmonyRequestPage() {
  const reducedMotion = useReducedMotion();
  const [, setLocation] = useLocation();

  const steps = useMemo(
    () => [
      "Who is this for?",
      "The heart of this Harmony",
      "Tone & sound",
      "Personal touches",
      "Where should I send your preview?",
      "Review your Harmony",
    ],
    []
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<HarmonyForm>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const total = steps.length;

  function setField<K extends keyof HarmonyForm>(
    key: K,
    value: HarmonyForm[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function goBack() {
    setSubmitError(null);

    if (stepIndex === 0) {
      setLocation("/harmony");
      return;
    }
    setStepIndex((s) => s - 1);
  }

  async function submitHarmony() {
    console.log("[Harmony] saving request to Supabase", form.email);

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { error } = await supabase.from("harmony_requests").insert({
        email: form.email,
        who_category: form.whoCategory,
        who_other: form.whoCategory === "Other" ? form.whoOther : null,
        moment: form.moment,
        qualities: form.qualities || null,
        memories: form.memories || null,
        emotional_tone: form.emotionalTone,
        sound_style: form.soundStyle,
        voice_preference: form.voicePreference,
        include_name: form.includeName,
        name_value: form.includeName === "yes" ? form.nameValue : null,
      });

      if (error) {
        console.error("[Harmony] Supabase insert failed:", error);
        throw new Error(error.message);
      }

      console.log("[Harmony] Supabase insert success ✅");

      // 🔔 Try to notify you by email, but do NOT block the user if it fails
      try {
        const notifyRes = await fetch(
          "https://wsdtteefqzlbfochnurx.supabase.co/functions/v1/notify-harmony",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
          }
        );

        if (!notifyRes.ok) {
          const notifyText = await notifyRes.text().catch(() => "");
          console.error("[Harmony] notification response failed:", notifyText);
        } else {
          console.log("[Harmony] notification sent ✅");
        }
      } catch (notifyError) {
        console.error("[Harmony] notification failed:", notifyError);
      }

      setLocation("/harmony/confirm");
    } catch (err: any) {
      console.error("[Harmony] submit error:", err);
      setSubmitError(
        err?.message || "Something went wrong while submitting your request."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function goNext() {
    setSubmitError(null);

    if (stepIndex === total - 1) {
      if (!isSubmitting) void submitHarmony();
      return;
    }

    if (stepIndex === total - 2) {
      setStepIndex((s) => s + 1);
      return;
    }

    setStepIndex((s) => s + 1);
  }

  const showOtherField = form.whoCategory === "Other";
  const showNameField = form.includeName === "yes";

  return (
    <div className="relative mx-auto w-full max-w-[720px] px-4 pb-16 pt-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(255,230,238,0.75),transparent_60%),radial-gradient(circle_at_70%_35%,rgba(255,240,220,0.45),transparent_55%),radial-gradient(circle_at_50%_85%,rgba(255,215,235,0.35),transparent_60%)]" />
      </div>

      <div className="text-center">
        <h1 className="font-serif text-[28px] text-[#2e2424] sm:text-[34px]">
          Harmony Request
        </h1>
        <p className="mt-2 text-[13px] text-[#6a5a5a]/70">
          Step {stepIndex + 1} of {total}
        </p>
      </div>

      <motion.div
        className="mx-auto mt-6 rounded-[28px] border border-white/18 bg-white/16 p-6 backdrop-blur-2xl shadow-[0_18px_45px_-28px_rgba(20,10,20,0.45)]"
        style={{ maxWidth: 560 }}
        initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h2 className="text-center text-[18px] font-semibold text-[#2e2424]">
          {steps[stepIndex]}
        </h2>

        {submitError && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            {submitError}
          </div>
        )}

        <div className="mt-8 space-y-8">
          {stepIndex === 0 && (
            <>
              <RadioGroup
                label="Who is this for?"
                value={form.whoCategory}
                onChange={(v) => setField("whoCategory", v)}
                options={[
                  "Myself",
                  "Parent",
                  "Partner",
                  "Husband",
                  "Wife",
                  "Friend",
                  "Grandparent",
                  "Brother",
                  "Sister",
                  "Child",
                  "Other",
                ]}
              />

              {showOtherField && (
                <TextInput
                  label="Who is this for?"
                  value={form.whoOther}
                  onChange={(v) => setField("whoOther", v)}
                  placeholder="Tell me who"
                />
              )}

              <RadioGroup
                label="What moment are you honoring?"
                value={form.moment}
                onChange={(v) => setField("moment", v)}
                options={[
                  "Wedding",
                  "Anniversary",
                  "Birthday",
                  "Proposal",
                  "Thank You",
                  "Just Because",
                  "A Season of Change",
                  "Healing",
                  "In Memory Of",
                ]}
              />
            </>
          )}

          {stepIndex === 1 && (
            <>
              <Textarea
                label="What feels most true about who they are?"
                value={form.qualities}
                onChange={(v) => setField("qualities", v)}
                placeholder="Their spirit, personality, what makes them them…"
              />

              <Textarea
                label="Which memories should be woven in?"
                value={form.memories}
                onChange={(v) => setField("memories", v)}
                placeholder="A moment, phrase, inside joke, or something never said out loud…"
              />
            </>
          )}

          {stepIndex === 2 && (
            <>
              <RadioGroup
                label="How should this Harmony feel?"
                value={form.emotionalTone}
                onChange={(v) => setField("emotionalTone", v)}
                options={[
                  "Gentle",
                  "Uplifting",
                  "Reflective",
                  "Celebratory",
                  "Healing",
                  "Hopeful",
                ]}
              />

              <RadioGroup
                label="What sound feels right?"
                value={form.soundStyle}
                onChange={(v) => setField("soundStyle", v)}
                options={[
                  "Soft R&B",
                  "Neo-Soul",
                  "Jazz-inspired",
                  "Gospel-inspired",
                  "I trust your direction",
                ]}
              />
            </>
          )}

          {stepIndex === 3 && (
            <>
              <RadioGroup
                label="Voice preference"
                value={form.voicePreference}
                onChange={(v) => setField("voicePreference", v)}
                options={["Soft feminine vocal", "Warm masculine vocal"]}
              />

              <RadioGroup
                label="Would you like a name included?"
                value={form.includeName}
                onChange={(v) => setField("includeName", v as "yes" | "no")}
                options={["yes", "no"]}
                displayLabels={["Yes", "No"]}
              />

              {showNameField && (
                <TextInput
                  label="Name to include"
                  value={form.nameValue}
                  onChange={(v) => setField("nameValue", v)}
                  placeholder="Enter the name exactly as you'd like it written"
                />
              )}
            </>
          )}

          {stepIndex === 4 && (
            <TextInput
              label="Your email"
              value={form.email}
              onChange={(v) => setField("email", v)}
              placeholder="you@example.com"
            />
          )}

          {stepIndex === 5 && (
            <div className="space-y-6 text-[14px] text-[#2e2424]">
              <p className="text-center text-[#6a5a5a] italic">
                This is the story we'll shape into a song…
              </p>

              <ReviewLine
                label="For"
                value={
                  form.whoCategory === "Other" ? form.whoOther : form.whoCategory
                }
                onEdit={() => setStepIndex(0)}
              />
              <ReviewLine
                label="In honor of"
                value={form.moment}
                onEdit={() => setStepIndex(0)}
              />
              <ReviewLine
                label="What feels most true"
                value={form.qualities}
                onEdit={() => setStepIndex(1)}
              />
              <ReviewLine
                label="Memories to weave in"
                value={form.memories}
                onEdit={() => setStepIndex(1)}
              />
              <ReviewLine
                label="Tone"
                value={form.emotionalTone}
                onEdit={() => setStepIndex(2)}
              />
              <ReviewLine
                label="Sound"
                value={form.soundStyle}
                onEdit={() => setStepIndex(2)}
              />
              <ReviewLine
                label="Voice"
                value={form.voicePreference}
                onEdit={() => setStepIndex(3)}
              />

              {form.includeName === "yes" && (
                <ReviewLine
                  label="Name included"
                  value={form.nameValue}
                  onEdit={() => setStepIndex(3)}
                />
              )}

              <ReviewLine
                label="Preview will be sent to"
                value={form.email}
                onEdit={() => setStepIndex(4)}
              />

              <p className="text-center text-[#6a5a5a]/80 mt-6 italic">
                Once submitted, your 30-second reflection will arrive within 24
                hours.
              </p>
            </div>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={goBack}
            disabled={isSubmitting}
            className="rounded-2xl border border-white/18 bg-white/30 px-4 py-3 text-[14px] text-[#2e2424] disabled:opacity-60"
          >
            Back
          </button>

          <button
            onClick={goNext}
            disabled={isSubmitting}
            className="rounded-2xl bg-[#2e2424] px-5 py-3 text-[14px] font-medium text-white disabled:opacity-60"
          >
            {isSubmitting
              ? "Sending…"
              : stepIndex === total - 1
              ? "Send my Harmony"
              : stepIndex === total - 2
              ? "Review my Harmony"
              : "Next"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------- UI Components ---------------- */

function RadioGroup({
  label,
  value,
  onChange,
  options,
  displayLabels,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  displayLabels?: string[];
}) {
  return (
    <div className="space-y-3">
      <p className="text-[14px] font-medium text-[#2e2424]">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt, i) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-full px-4 py-2 text-[13px] transition ${
              value === opt
                ? "bg-[#2e2424] text-white"
                : "bg-white/60 text-[#2e2424] border border-white/20"
            }`}
          >
            {displayLabels ? displayLabels[i] : opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[14px] font-medium text-[#2e2424]">{label}</p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/18 bg-white/65 px-4 py-3 text-[14px] text-[#2e2424] shadow-sm placeholder:text-[#6a5a5a]/50"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[14px] font-medium text-[#2e2424]">{label}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder={placeholder}
        className="w-full resize-none rounded-2xl border border-white/18 bg-white/65 px-4 py-3 text-[14px] text-[#2e2424] shadow-sm placeholder:text-[#6a5a5a]/50"
      />
    </div>
  );
}

function ReviewLine({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <div className="border-b border-white/20 pb-3">
      <div className="flex justify-between items-center">
        <span className="font-medium text-[#2e2424]">{label}</span>
        <button
          onClick={onEdit}
          className="text-[11px] text-[#6a5a5a] hover:underline"
        >
          Edit
        </button>
      </div>
      <p className="mt-1 text-[#5a4c4c]/85">{value || "—"}</p>
    </div>
  );
}