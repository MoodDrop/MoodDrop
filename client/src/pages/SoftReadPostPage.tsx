import { useEffect } from "react";
import { Link } from "wouter";
import dropletIcon from "@/assets/droplet.png";

export default function SoftReadPostPage() {
  // Ensure page always starts at top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const startTenseDrop = () => {
    localStorage.setItem("mooddrop_selected_mood", "Tense");
    window.location.href = "/drop-it";
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-10 text-warm-gray-700">
      {/* Back link */}
      <div className="mb-6">
        <Link href="/soft-reads">
          <span className="text-sm text-blush-400 hover:underline cursor-pointer">
            ← Back to Soft Reads
          </span>
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-warm-gray-900 mb-4">
        Why You Feel Tense Even When Nothing Is Wrong
      </h1>

      {/* TL;DR */}
      <p className="text-sm italic text-warm-gray-500 mb-8">
        If your body feels tight, restless, or “on edge” even when life seems
        calm, you’re not broken. This is what happens when your nervous system
        hasn’t had a chance to release yet.
      </p>

      {/* Content */}
      <section className="space-y-6 leading-relaxed">
        <h2 className="font-medium text-warm-gray-900">
          A personal note from me 💧
        </h2>

        <p>
          I want to say this first — because I’ve lived it.
        </p>

        <p>
          There are days when nothing bad is happening, but my shoulders are
          tight, my jaw is clenched, and my thoughts feel wound up like a spring.
          The house is quiet. The to-do list is mostly done. And still… my body
          won’t let go.
        </p>

        <p>
          For a long time, I thought something was wrong with me. I couldn’t
          explain why I felt tense — I just knew I did.
        </p>

        <p className="font-medium">
          What I’ve learned is this: tension doesn’t always come from chaos.
          Sometimes it comes from holding it together for too long.
        </p>

        <h2 className="font-medium text-warm-gray-900 mt-8">
          When your body stays “on” longer than it needs to
        </h2>

        <p>
          Tension doesn’t always come from a clear problem. Sometimes it comes
          from holding things in for too long — unspoken thoughts, delayed
          reactions, emotional restraint, and responsibilities that don’t pause
          just because you’re tired.
        </p>

        <p>
          Your nervous system doesn’t always know the difference between danger
          and pressure. So it stays alert — even at night, even in quiet moments,
          even when nothing feels wrong and you’re craving rest.
        </p>

        <h2 className="font-medium text-warm-gray-900 mt-8">
          Why overthinking shows up when you finally stop moving
        </h2>

        <p>
          Overthinking often isn’t a personality flaw — it’s timing. When the day
          is busy, your mind doesn’t get a chance to speak. When things slow down,
          your thoughts finally have space.
        </p>

        <p>
          That’s why tension often shows up at night or after everything is done.
          Nothing is wrong — your system is just catching up.
        </p>

        <h2 className="font-medium text-warm-gray-900 mt-8">
          3 Soft Ways to Unwind the Coil
        </h2>

        <h3 className="font-medium mt-4">1. The “Exhale” Priority</h3>
        <p>
          When we’re tense, we tend to take short, shallow sips of air. Focus only
          on the exhale — make it twice as long as the inhale. This gently signals
          safety to your nervous system.
        </p>

        <h3 className="font-medium mt-4">2. The 10-Second Shake</h3>
        <p>
          Stand up and shake your hands, arms, and feet for ten seconds. It may
          feel silly, but it physically breaks the tension loop your body is
          holding.
        </p>

        <h3 className="font-medium mt-4">3. The Brain Dump</h3>
        <p>
          Tension often comes from mental clutter. Give those thoughts somewhere
          to land so they don’t have to live in your body.
        </p>
      </section>

      {/* CTA */}
      <div className="mt-12 text-center">
        <button
          onClick={startTenseDrop}
          className="mx-auto flex items-center justify-center gap-3 rounded-3xl bg-blush-300 hover:bg-blush-400 text-white px-8 py-4 shadow-md transition-all"
        >
          <img src={dropletIcon} alt="" className="w-6 h-6" />
          <span className="font-medium">Start a Tense Drop</span>
        </button>

        <p className="mt-4 text-xs text-warm-gray-500">
          You don’t have to fix it. Just release it.
        </p>
      </div>
    </main>
  );
}
