// client/src/pages/ContactPage.tsx
import React from "react";
import { Link } from "wouter";

export default function ContactPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <p className="text-xs tracking-[0.2em] text-[#A08B73] uppercase">
          MoodDrop Contact
        </p>

        <h1 className="text-2xl font-semibold text-[#8B7355] flex items-center justify-center gap-2">
          Contact <span className="text-[#3BA7FF]">💧</span>
        </h1>

        <p className="text-sm text-[#8B7355] leading-relaxed max-w-md mx-auto">
          A quiet way to reach out if something isn’t working, you have an idea,
          or you’d simply like to get in touch.
        </p>
      </div>

      {/* Breathing Divider */}
      <div className="flex items-center justify-center py-1">
        <span className="text-[#C0A489] text-xs tracking-[0.35em]">
          • • •
        </span>
      </div>

      {/* Intro / Email Card */}
      <div className="bg-white/80 rounded-2xl border border-blush-100 shadow-sm p-6 space-y-4">
        <p className="text-sm text-[#8B7355] leading-relaxed">
          MoodDrop is a gentle space, and communication here is meant to feel
          simple too. If you ever need to reach out about feedback, ideas, or
          something that isn’t working, you can email me directly.
        </p>

        <div className="rounded-xl bg-[#FFF7F9] border border-[#F4CBD2]/60 px-4 py-3 text-center">
          <a
            href="mailto:contact@mooddrop.me"
            className="text-sm font-medium text-[#D4AF37] underline underline-offset-4 decoration-[#F4CBD2]/70 hover:text-[#C49A1E]"
          >
            contact@mooddrop.me
          </a>
        </div>

        <p className="text-xs text-[#8B7B7E] leading-relaxed text-center">
          I try to respond within a few days when possible.
        </p>
      </div>

      {/* What You Can Reach Out About */}
      <div className="bg-white/80 rounded-2xl border border-blush-100 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#8B7355]">
          You can reach out about
        </h2>

        <ul className="text-sm text-[#6D5E61] space-y-2">
          <li>• Feedback or ideas for MoodDrop</li>
          <li>• Something not working in the app</li>
          <li>• Partnerships or collaborations</li>
          <li>• General questions</li>
        </ul>
      </div>

      {/* Support Reminder */}
      <div className="bg-white/80 rounded-2xl border border-blush-100 shadow-sm p-6 space-y-3">
        <h2 className="text-sm font-semibold text-[#8B7355]">
          Need immediate support?
        </h2>

        <p className="text-sm text-[#8B7355] leading-relaxed">
          If you&apos;re in crisis or need immediate emotional support, please
          visit the{" "}
          <Link href="/care-support" className="text-[#8B7355] underline underline-offset-4">
            Care &amp; Support
          </Link>{" "}
          page or use the support resources listed in the footer. Those services
          can respond much faster than email.
        </p>
      </div>

      {/* Closing */}
      <div className="text-center pt-1">
        <p className="text-sm text-[#8B7355] leading-relaxed">
          Thank you for helping MoodDrop grow into a gentler space.
        </p>
      </div>
    </div>
  );
}