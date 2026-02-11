// client/src/pages/QAPage.tsx
import React, { useState } from "react";

type QAItem = {
  question: string;
  answer: string;
};

type QASection = {
  title: string;
  items: QAItem[];
};

const SECTIONS: QASection[] = [
  {
    title: "About MoodDrop",
    items: [
      {
        question: "What is MoodDrop?",
        answer:
          "MoodDrop is a gentle space to release your thoughts and emotions anonymously. You drop what’s on your mind, breathe for a moment, and step away feeling a little lighter.",
      },
      {
        question: "Do I need to create an account?",
        answer:
          "Nope. You can use MoodDrop without creating an account. Most features are designed to work without usernames, profiles, or public identities.",
      },
      {
        question: "Is MoodDrop a therapy or mental health app?",
        answer:
          "MoodDrop is not therapy and doesn’t replace professional mental health care. It’s more like an emotional release journal — a calm corner where you can vent, reflect, and breathe.",
      },
    ],
  },

  {
    title: "Echo Room (Echo Vault)",
    items: [
      {
        question: "What is the Echo Room?",
        answer:
          "The Echo Room is a private, reflective space inside MoodDrop where you can revisit what you’ve already released. Instead of a list or feed, your past drops appear as soft, glowing Echoes — gentle reminders you can return to when you need grounding or reassurance.",
      },
      {
        question: "What is an Echo?",
        answer:
          "An Echo is a moment you’ve released — either through text or voice. Each Echo becomes a quiet point of memory, not something to analyze or perform, but something you can gently return to when you need it.",
      },
      {
        question: "How do I use the Echo Room?",
        answer:
          "Enter the Echo Room and let your Echoes drift. Tap one to read a past text release or listen to a voice release. There’s no pressure to revisit everything — you choose what to open, when you’re ready.",
      },
      {
        question: "Can I replay my voice Echo later?",
        answer:
          "Yes. If you recorded a voice Echo, you can return and listen to it again anytime inside the Echo Room. Your voice stays connected to that Echo so you can revisit it when you need grounding or reassurance.",
      },
      {
        question: "Is my voice being recorded or stored?",
        answer:
          "Your voice Echoes are stored locally on your device as part of the Echo Vault. They are not posted publicly, shared with others, or turned into community audio. The Echo Room is designed to be private and personal — just you and your reflections.",
      },
      {
        question: "Can anyone else see or hear my Echoes?",
        answer:
          "No. Echoes are visible only to you. There are no comments, reactions, followers, or outside voices in the Echo Room — it’s a space designed to stay quiet and non-performative.",
      },
      {
        question: "How is the Echo Room different from My Drops?",
        answer:
          "My Drops is a private space for written entries saved on your device. The Echo Room (Echo Vault) is a more sensory space — your releases appear as visual Echoes, and may include both text and voice. It’s less about journaling and more about gentle reflection.",
      },
      {
        question: "Can I delete or tuck away an Echo?",
        answer:
          "Yes. You’re in control. You can delete Echoes or tuck them away if you’re not ready to see them. Nothing is permanent unless you want it to be.",
      },
      {
        question: "Is the Echo Room meant to reopen old pain?",
        answer:
          "No. The Echo Room isn’t about reliving difficult moments. It’s about remembering: “I’ve been here before — and I made it through.” You decide when, or if, you return to an Echo.",
      },
    ],
  },

  {
    title: "Safety & Privacy",
    items: [
      {
        question: "Are my drops anonymous?",
        answer:
          "Yes. Your drops in The Collective Drop are anonymous — they’re shown with a Vibe ID instead of your real name. Your private My Drops entries stay on your own device.",
      },
      {
        question: "Can anyone see my private journal (My Drops)?",
        answer:
          "No. My Drops is stored locally in your browser on your device. That means only you can see them, unless someone else has physical access to your device and browser.",
      },
      {
        question: "Do you sell or share my data?",
        answer:
          "No. MoodDrop is built with care and respect for your privacy. Your words are not meant to be sold, traded, or turned into ads. If anything changes in the future, it will be clearly explained in the Privacy & Safety section.",
      },
    ],
  },
  {
    title: "Voice Notes & Typing",
    items: [
      {
        question: "Do I have to type, or can I use my voice?",
        answer:
          "You can do either. If you don’t feel like typing, you can use the voice feature to speak your drop out loud. It’s there for those moments when the words are too heavy to type.",
      },
      {
        question: "What happens to my voice notes?",
        answer:
          "Voice notes are used to turn your spoken words into text so you can drop what you’re feeling. They’re not meant to be shared as public audio. Exact storage details may evolve, but the intention is always to keep things as private and gentle as possible.",
      },
      {
        question: "Can I edit or delete a drop?",
        answer:
          "For My Drops, you’re in full control — you can edit or delete entries saved on your device. In The Collective Drop, once something is posted anonymously, it may not always be editable, so try to share what feels safe and comfortable for you.",
      },
    ],
  },
];

export default function QAPage() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  const toggleItem = (key: string) => {
    setOpenKey((current) => (current === key ? null : key));
  };

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <p className="text-xs tracking-[0.2em] text-[#A08B73] uppercase">
          MoodDrop Q&amp;A
        </p>
        <h1 className="text-2xl font-semibold text-[#8B7355] flex items-center justify-center gap-2">
          Questions &amp; Answers <span className="text-[#3BA7FF]">💧</span>
        </h1>
        <p className="text-sm text-[#8B7355] max-w-xl mx-auto leading-relaxed">
          A gentle corner to understand how MoodDrop works, how your words are
          kept safe, and how to get the most out of your drops — at your own
          pace.
        </p>
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#C0A489]">
          Breathe in • Breathe out
        </p>
      </div>

      {/* Q&A Sections */}
      <div className="space-y-6">
        {SECTIONS.map((section, sectionIndex) => (
          <div
            key={section.title}
            className="bg-white/80 rounded-2xl border border-blush-100 shadow-sm p-5 space-y-3"
          >
            <h2 className="text-sm font-semibold text-[#8B7355]">
              {section.title}
            </h2>
            <div className="divide-y divide-blush-100">
              {section.items.map((item, itemIndex) => {
                const key = `${sectionIndex}-${itemIndex}`;
                const isOpen = openKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleItem(key)}
                    className="w-full text-left py-3 focus:outline-none"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-[#8B7355]">
                        {item.question}
                      </p>
                      <span className="text-[#C0A489] text-lg leading-none">
                        {isOpen ? "–" : "+"}
                      </span>
                    </div>
                    {isOpen && (
                      <p className="mt-2 text-sm text-[#8B7355] leading-relaxed">
                        {item.answer}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
