import React from "react";

export default function CareSupportPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-12 space-y-10">

      {/* Header */}
      <div className="text-center space-y-4">
        <p className="text-xs tracking-[0.2em] text-[#A08B73] uppercase">
          MoodDrop Care & Support
        </p>

        <h1 className="text-2xl font-semibold text-[#8B7355] flex items-center justify-center gap-2">
          Care & Support <span className="text-[#3BA7FF]">💧</span>
        </h1>

        <p className="text-sm text-[#8B7355] leading-relaxed max-w-md mx-auto">
          MoodDrop is a quiet space for emotional release and reflection.
          If you're going through something heavy, you deserve care,
          understanding, and support beyond what any app can provide.
        </p>

        <p className="text-[11px] uppercase tracking-[0.25em] text-[#C0A489]">
          Support exists beyond this space
        </p>
      </div>

      {/* Breathing Divider */}
      <div className="flex items-center justify-center py-1">
        <span className="text-[#C0A489] text-xs tracking-[0.35em]">
          • • •
        </span>
      </div>

      {/* What MoodDrop Is */}
      <div className="bg-white/80 rounded-2xl border border-blush-100 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#8B7355]">
          What MoodDrop Is (and Isn’t)
        </h2>

        <p className="text-sm text-[#8B7355] leading-relaxed">
          MoodDrop can help you release thoughts, pause, and reflect on your
          emotions. It’s designed as a gentle space where people can express
          feelings and witness shared human moments.
        </p>

        <p className="text-sm text-[#8B7355] leading-relaxed">
          However, MoodDrop is not a replacement for professional mental health
          care or crisis support. If you’re experiencing something overwhelming
          or unsafe, reaching out to someone who can support you directly can
          make a meaningful difference.
        </p>
      </div>

      {/* Immediate Help */}
      <div className="bg-white/80 rounded-2xl border border-blush-100 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#8B7355]">
          If You Need Immediate Help
        </h2>

        <p className="text-sm text-[#8B7355] leading-relaxed">
          If you are in crisis or feel unsafe, please contact a crisis service
          or emergency support in your area.
        </p>

        <ul className="space-y-3 text-sm text-[#6D5E61]">
          <li className="flex items-start justify-between gap-4">
            <span>U.S. Suicide & Crisis Lifeline</span>
            <span className="font-medium text-[#4A3F41]">988</span>
          </li>

          <li className="flex items-start justify-between gap-4">
            <span>Crisis Text Line (U.S. / Canada)</span>
            <span className="font-medium text-[#4A3F41]">
              Text HELLO to 741741
            </span>
          </li>

          <li className="flex items-start justify-between gap-4">
            <span>International support</span>

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
      </div>

      {/* Support Options */}
      <div className="bg-white/80 rounded-2xl border border-blush-100 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#8B7355]">
          If You're Struggling but Not in Crisis
        </h2>

        <p className="text-sm text-[#8B7355] leading-relaxed">
          Sometimes what we need most is simply someone to talk to.
          If things feel heavy, you might consider reaching out to someone you trust.
        </p>

        <ul className="text-sm text-[#6D5E61] space-y-1">
          <li>• A trusted friend or family member</li>
          <li>• A therapist or counselor</li>
          <li>• A school counselor or doctor</li>
          <li>• A local support line or community resource</li>
        </ul>

        <p className="text-sm text-[#8B7355] leading-relaxed">
          Support exists in many forms, and you deserve to find what helps you.
        </p>
      </div>

      {/* Gentle Closing */}
      <div className="text-center space-y-3 pt-2">
        <p className="text-sm text-[#8B7355] leading-relaxed">
          If things feel overwhelming right now, take a small moment for
          yourself. Relax your shoulders. Take one slow breath. Step away from
          the screen if you need to.
        </p>

        <p className="text-sm text-[#8B7355] leading-relaxed">
          You don’t have to solve everything today.
        </p>

        <p className="text-sm text-[#8B7355] leading-relaxed">
          MoodDrop will still be here whenever you return.
        </p>
      </div>
    </div>
  );
}