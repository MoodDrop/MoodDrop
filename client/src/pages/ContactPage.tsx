// client/src/pages/ContactPage.tsx
import React from "react";

export default function ContactPage() {
  return (
    <div className="max-w-lg mx-auto py-10 space-y-4">
      <h1 className="text-2xl font-semibold text-[#8B7355]">Contact</h1>

      <p className="text-sm text-[#8B7355] leading-relaxed">
        MoodDrop is an anonymous, gentle space — so there isn’t a big public
        inbox or chat inside the app yet. But if you ever need to reach me
        about feedback, ideas, or something that isn’t working, you can send
        an email here:
      </p>

      <p className="text-sm font-medium text-[#D4AF37]">
        Contact@mooddrop.me
      </p>

      <p className="text-xs text-[#A08B73] leading-relaxed">
        If you’re in crisis or need urgent emotional support, please use the
        crisis resources listed in the footer instead of email — they can
        respond much faster than I can. 💛
      </p>
    </div>
  );
}
