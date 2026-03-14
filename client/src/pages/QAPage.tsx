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
    title: "About MoodDrop 💧",
    items: [
      {
        question: "What is MoodDrop?",
        answer:
          "MoodDrop is a gentle space to release thoughts and emotions. You can type or speak what you’re feeling, pause for a moment, and step away feeling a little lighter. Some moments remain private, while others can be shared anonymously in the Living Gallery.",
      },
      {
        question: "Do I need to create an account?",
        answer:
          "Nope. You can use MoodDrop without creating an account. Most features are designed to work without usernames, profiles, or public identities.",
      },
      {
        question: "What if I don’t know what to say?",
        answer:
          "That’s completely okay. MoodDrop doesn’t expect perfect words. You can type a single sentence, a few scattered thoughts, or even just a feeling you’re trying to understand. Some people release long reflections, while others share just a few words. There’s no right way to drop something here. Whatever feels honest in the moment is enough.",
      },
      {
        question: "Are other people feeling things like this too?",
        answer:
          "Yes. One of the quiet reminders inside MoodDrop is that emotions are rarely experienced alone. The Living Gallery exists so people can gently witness shared moments and recognize that many feelings — confusion, joy, stress, relief, uncertainty — are part of the human experience. Sometimes simply seeing that others carry emotions too can make things feel a little lighter.",
      },
      {
        question: "Is MoodDrop a therapy or mental health app?",
        answer:
          "MoodDrop is not therapy and doesn’t replace professional mental health care. It’s more like an emotional release journal — a calm corner where you can vent, reflect, and breathe.",
      },
    ],
  },

  {
    title: "Voice or Typing",
    items: [
      {
        question: "Do I have to type, or can I use my voice?",
        answer:
          "You can do either. If you don’t feel like typing, you can use the voice feature to speak your drop out loud. It’s there for those moments when the words feel too heavy to type.",
      },
      {
        question: "What happens to my voice notes?",
        answer:
          "Voice notes can help you release what you’re feeling in a way that feels more natural in the moment. Depending on how you use MoodDrop, your voice may help create a text drop or become part of a private voice Echo in the Echo Vault. They’re not shared publicly as community audio, and the intention is always to keep the experience as private and gentle as possible.",
      },
      {
        question: "Can I edit or delete a drop?",
        answer:
          "For My Drops, you’re in full control — entries saved on your device can be edited or deleted anytime. If you choose to share a moment in the Living Gallery, it appears anonymously as a canvas and may not always be editable.",
      },
      {
        question: "What if I share something and regret it later?",
        answer:
          "That feeling is completely understandable. MoodDrop is designed to give you space to release emotions without pressure or permanence. Many moments remain private on your own device, and shared moments in the Living Gallery appear anonymously without personal identity. The goal isn’t to hold onto your feelings forever — it’s simply to let them pass through. Sometimes the act of releasing a moment is enough.",
      },
    ],
  },

  {
    title: "Living Gallery",
    items: [
      {
        question: "What is the Living Gallery?",
        answer:
          "The Living Gallery is a quiet mosaic of emotions shared by people using MoodDrop. When someone releases a feeling, they can choose to share it anonymously. Those shared moments appear here as floating canvases. Each canvas holds a small glimpse of what someone felt in that moment. The gallery isn’t a feed or a conversation — it’s simply a place to witness what others are carrying and remember that you’re not alone.",
      },
      {
        question: "How does the Living Gallery work?",
        answer:
          "Shared drops appear as drifting canvases inside the Emotional Field. You may only see a few at a time, but many more are gently cycling beneath the surface. As time passes, new canvases slowly appear while others drift away. You can tap a canvas to read the full moment it holds.",
      },
      {
        question: "Can people reply to what I share?",
        answer:
          "No. The Living Gallery is intentionally designed to stay calm and supportive. There are no replies, comments, or discussions. Instead of responding with words, visitors simply witness a moment. This keeps the space peaceful and free from judgment or debate.",
      },
      {
        question: "What does 'Witnessed' mean?",
        answer:
          "When someone reads a shared moment, they can quietly acknowledge it by tapping Witness. It’s a gentle way of saying, “I see this.” There are no comments, advice, or reactions — just presence.",
      },
      {
        question: "Is the Living Gallery anonymous?",
        answer:
          "Yes. Shared moments never include personal details or identities. Your words appear only as a canvas representing a feeling. The goal is to create a space where people can express emotions without fear of being judged or recognized.",
      },
      {
        question: "Why do the canvases slowly change?",
        answer:
          "The gallery reflects what people are feeling in real time. Only a small number of canvases appear at once so the space stays calm and uncluttered. As the gallery shifts, new moments drift into view while others move quietly beneath the surface — like emotional weather gently changing.",
      },
      {
        question: "Why is the Living Gallery different from social media?",
        answer:
          "Most platforms focus on reactions, comments, and attention. The Living Gallery focuses on presence. It isn’t about posting for engagement. It’s about sharing a moment and allowing others to witness it quietly.",
      },
    ],
  },

  {
    title: "Calm Studio",
    items: [
      {
        question: "What is Calm Studio?",
        answer:
          "Calm Studio is a gentle space inside MoodDrop designed to help you slow down after releasing a feeling. Sometimes after expressing an emotion, your mind or body may still feel unsettled. Calm Studio offers simple, quiet experiences that help you pause, reset, and breathe. It’s not about fixing anything — just giving yourself a small moment of calm.",
      },
      {
        question: "What can I do inside Calm Studio?",
        answer:
          "Calm Studio includes soft, interactive experiences designed to help you relax and refocus. Some experiences include Gentle Play — quiet interactive moments like Light Garden, Bubble Drift, Glow Trail, and Sand Sweep — along with Take a Breath, Soft Visuals, and Soothing Sounds, which are coming soon. Each experience is designed to feel simple, calming, and pressure-free.",
      },
      {
        question: "Why was Calm Studio created?",
        answer:
          "MoodDrop follows a gentle emotional flow: Release → Witness → Restore. After releasing a feeling and seeing the shared humanity in the Living Gallery, Calm Studio offers a place to softly restore your emotional balance. Sometimes a few quiet moments are all we need.",
      },
      {
        question: "Do I have to use Calm Studio?",
        answer:
          "Not at all. Calm Studio is simply there if you’d like a moment of calm after releasing a drop. You can stay for a few seconds or a few minutes — whatever feels right for you.",
      },
      {
        question: "How long should I stay in Calm Studio?",
        answer:
          "There’s no set time. Some people stay for just a few seconds to take a breath or watch a moment drift by. Others spend a few minutes exploring the gentle experiences inside. Calm Studio isn’t meant to be a task or a routine. It’s simply a quiet space you can step into whenever you need a pause. Even a small moment can make a difference.",
      },
      {
        question: "Do the Calm Studio experiences have goals or scores?",
        answer:
          "No. Calm Studio experiences are intentionally simple and pressure-free. They’re designed to feel gentle and calming rather than competitive. There are no scores to chase or levels to complete — just small interactive moments meant to help your mind slow down.",
      },
      {
        question: "Is Calm Studio private?",
        answer:
          "Yes. Calm Studio is a personal space within MoodDrop. Nothing you do inside Calm Studio is shared or visible to others.",
      },
      {
        question: "What if I just want to sit here for a moment?",
        answer:
          "That’s perfectly okay. Calm Studio is meant to feel soft and unhurried. You don’t need to complete anything or do anything a certain way. Take your time here. Nothing needs to be solved right now.",
      },
    ],
  },

  {
    title: "Echo Vault",
    items: [
      {
        question: "What is the Echo Vault?",
        answer:
          "The Echo Vault is a private reflective space inside MoodDrop where you can revisit moments you’ve already released. Instead of a list or feed, your past drops appear as soft Echoes — quiet reminders you can return to whenever you need grounding or perspective.",
      },
      {
        question: "What is an Echo?",
        answer:
          "An Echo is a moment you’ve released — either through text or voice. Each Echo becomes a quiet point of memory, not something to analyze or perform, but something you can gently return to when you need it.",
      },
      {
        question: "How do I use the Echo Vault?",
        answer:
          "Enter the Echo Vault and allow your Echoes to gently drift. Tap one to read a past text release or listen to a voice release. There’s no pressure to revisit everything — you choose what to open and when.",
      },
      {
        question: "Can I replay my voice Echo later?",
        answer:
          "Yes. If you recorded a voice Echo, you can return and listen to it again anytime inside the Echo Vault. Your voice stays connected to that moment so you can revisit it whenever you need grounding or reassurance.",
      },
      {
        question: "Is my voice being recorded or stored?",
        answer:
          "Voice Echoes are stored locally on your device as part of the Echo Vault. They are not shared publicly or used as community audio. The Echo Vault is designed to remain private and personal.",
      },
      {
        question: "Can anyone else see or hear my Echoes?",
        answer:
          "No. Echoes are visible only to you. There are no comments, reactions, followers, or outside voices in the Echo Vault — it’s a space designed to stay quiet and non-performative.",
      },
      {
        question: "How is the Echo Vault different from My Drops?",
        answer:
          "My Drops is a private space for written entries saved on your device. The Echo Vault is a more reflective space where past releases appear as visual Echoes and may include both text and voice.",
      },
      {
        question: "Can I delete or tuck away an Echo?",
        answer:
          "Yes. You’re in control. You can delete Echoes or tuck them away if you’re not ready to see them. Nothing is permanent unless you want it to be.",
      },
      {
        question: "Is the Echo Vault meant to reopen old pain?",
        answer:
          "No. The Echo Vault isn’t meant to reopen difficult moments. It’s meant to remind you that you’ve moved through things before. You decide when — or if — you return to an Echo.",
      },
    ],
  },

  {
    title: "Harmony 🌹 (Intimate Song Experience)",
    items: [
      {
        question: "What is Harmony?",
        answer:
          "Harmony is a quiet offering inside MoodDrop where your story is carefully shaped into melody. It’s meant to feel intimate, thoughtful, and deeply personal.",
      },
      {
        question: "Is Harmony anonymous like Echoes?",
        answer:
          "Harmony is private, but not anonymous. Your email is used only to deliver your sample and any selected version. It isn’t connected to your Echo Vault, releases, or anything you’ve shared elsewhere in MoodDrop. Your submission is handled with care and is never shared publicly.",
      },
      {
        question: "How does Harmony work?",
        answer:
          "You share what feels ready — a memory, a name, or a quiet truth — and choose the emotional tone. Within 24 hours, you’ll receive a 30 second Soft Echo via email. If it resonates, you may continue into the full piece. Each submission is reviewed personally.",
      },
      {
        question: "What are the Harmony options?",
        answer:
          "After receiving your Soft Echo, you may choose between Full Harmony or Signature Harmony. Details and Founder Phase pricing are shared privately via email.",
      },
      {
        question: "Why is Harmony limited each week?",
        answer:
          "Harmony is shaped slowly and intentionally — never rushed. To preserve depth and care, only a limited number of submissions are accepted each week. When sessions are full, new openings return the following week.",
      },
      {
        question: "Can I submit more than once?",
        answer:
          "Yes. Harmony is available for repeat submissions, and each request is treated as its own intentional studio session.",
      },
      {
        question: "Will my words be stored or reused?",
        answer:
          "No. Your submission is used only to create your requested Soft Echo and any selected version. It is not shared, sold, or repurposed.",
      },
      {
        question: "Can I request changes to my song?",
        answer:
          "Full and Signature Harmony each include one thoughtful refinement if requested within 48 hours. Small factual corrections, such as names or pronunciation, are always welcome.",
      },
    ],
  },

  {
  title: "Privacy & Care",
  items: [
    {
      question: "Are my drops anonymous?",
      answer:
        "Shared moments in the Living Gallery are anonymous. They appear as floating canvases without names or personal details. Your My Drops entries and Echo Vault moments stay private on your device.",
    },
    {
      question: "Is anyone watching what I write?",
      answer:
        "No one is watching your writing in real time. MoodDrop is designed as a quiet space where you can release thoughts without feeling observed or judged. Private moments stay on your device, and shared moments appear anonymously in the Living Gallery without names or identities attached.",
    },
    {
      question: "Do I have to share my drop with others?",
      answer:
        "No. Sharing is always optional. Many people use MoodDrop purely as a private space to release thoughts and revisit them later in the Echo Vault or My Drops. If you choose to share a moment, it will appear anonymously in the Living Gallery.",
    },
    {
      question: "Can anyone see my private journal (My Drops)?",
      answer:
        "No. My Drops is stored locally in your browser on your device. That means only you can see them unless someone else has access to your device and browser.",
    },
    {
      question: "Will my words ever be used to train AI or shared publicly?",
      answer:
        "Your words belong to you. MoodDrop is designed as a space for emotional release, not data collection. Your private entries remain on your device, and anything shared anonymously in the Living Gallery appears only as a moment to be witnessed — not as content to be analyzed, reused, or sold.",
    },
    {
      question: "What if I’m going through something really serious or overwhelming?",
      answer:
        "If you're going through something that feels really heavy or overwhelming, you're not alone in feeling that way. MoodDrop is a space for emotional release and reflection, but it isn’t a replacement for professional care or crisis support.\n\nIf you’re experiencing something unsafe or urgent, it’s important to reach out to someone who can support you directly. This might be a trusted friend, family member, counselor, or a mental health professional.\n\nMoodDrop can be a quiet place to pause and breathe, but you don’t have to carry heavy moments alone. You can also visit the Care & Support page for additional resources and guidance.",
    },
  ],
},
];

export default function QAPage() {
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const toggleItem = (key: string) => {
    setOpenKeys((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-8">
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
        <p className="text-xs text-[#A08B73]">Tap a question whenever you&apos;re curious.</p>
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#C0A489]">
          Breathe in • Breathe out
        </p>
      </div>

      <div className="text-center space-y-2">
        <p className="text-xs tracking-[0.18em] uppercase text-[#C0A489]">
          Curious about something? Start here.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-[#8B7355]">
          <span>About MoodDrop 💧</span>
          <span>•</span>
          <span>Voice or Typing</span>
          <span>•</span>
          <span>Living Gallery</span>
          <span>•</span>
          <span>Calm Studio</span>
          <span>•</span>
          <span>Echo Vault</span>
          <span>•</span>
          <span>Harmony</span>
          <span>•</span>
          <span>Privacy &amp; Care</span>
        </div>
      </div>

      <div className="space-y-8">
        {SECTIONS.map((section, sectionIndex) => (
          <div key={section.title} className="space-y-4">
            <div className="bg-white/80 rounded-2xl border border-blush-100 shadow-sm p-5 space-y-3">
              <h2 className="text-sm font-semibold text-[#8B7355] flex items-center gap-2">
                <span className="text-[#3BA7FF]">💧</span>
                {section.title}
              </h2>
              <div className="divide-y divide-blush-100">
                {section.items.map((item, itemIndex) => {
                  const key = `${sectionIndex}-${itemIndex}`;
                  const isOpen = openKeys.includes(key);

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

            {sectionIndex < SECTIONS.length - 1 && (
              <div className="text-center text-[#C0A489] text-xs tracking-[0.3em]">
                • • •
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center pt-2">
        <p className="text-sm text-[#8B7355] leading-relaxed">
          If something still feels unclear, that&apos;s okay. MoodDrop is meant to
          be explored slowly.
        </p>
      </div>
    </div>
  );
}