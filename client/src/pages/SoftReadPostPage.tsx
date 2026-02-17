import React from "react";
import { Link, useRoute, useLocation } from "wouter";

export default function SoftReadPostPage() {
  const [, params] = useRoute("/soft-reads/:slug");
  const slug = params?.slug;
  const [, navigate] = useLocation();

  const startDropWithMood = (mood: string) => {
    localStorage.setItem("mooddrop_selected_mood", mood);
    navigate("/drop-it");
  };

  const startDropRitual = () => {
    // Keeps your intended flow: Emotion → Mood Choice → Release
    navigate("/");
  };

  /* ===============================
     📌 PINNED / WELCOME POST
     =============================== */
  if (slug === "welcome" || slug === "why-mooddrop-exists") {
    return (
      <PostLayout
        mood="Foundations"
        title="I Needed a Place That Didn’t Talk Back"
      >
        <p>
          Hi, I’m <strong>Charae</strong> 💧
        </p>

        <p>
          I’m a stay-at-home mom of four daughters. I’m a wife. And I’m a woman
          who’s still figuring herself out in the middle of everyone else needing
          her.
        </p>

        <p>
          My days are full — of love, responsibility, noise, repetition, care,
          and invisible work. Some days I feel grounded and grateful. Other days
          I feel stretched thin, quietly overwhelmed, or unsure of who I’m
          becoming in this season of my life.
        </p>

        <p>And then there were days I didn’t want advice.</p>
        <p>Not encouragement.</p>
        <p>Not “have you tried this?”</p>
        <p>Not even a response.</p>

        <p>
          I just needed somewhere to put the feeling so it wouldn’t keep sitting
          in my chest.
        </p>

        <p>
          Private journaling helped — but it still felt like everything stayed
          trapped inside me.
        </p>
        <p>Social media felt loud.</p>
        <p>Talking felt like work.</p>

        <p>I was also changing.</p>
        <p>Outgrowing certain friendships.</p>
        <p>Losing people I thought would be around forever.</p>
        <p>
          Trying to find connection again — especially over 40 — when starting
          over socially feels awkward and vulnerable.
        </p>

        <p>
          Sometimes I had wins that felt huge to me… and life just kept moving
          like nothing happened.
        </p>
        <p>Not because people didn’t care — they just didn’t always see it.</p>

        <p>
          So I built MoodDrop — not as a solution, but as a place to{" "}
          <strong>release</strong>.
        </p>

        <p>A place where you don’t have to explain yourself.</p>
        <p>Where you don’t have to organize your thoughts.</p>
        <p>Where you don’t have to make sense for anyone else.</p>

        <p>Some days you’re calm.</p>
        <p>Some days you’re overwhelmed.</p>
        <p>
          Some days you’re holding it together so tightly you can feel it in your
          body.
        </p>

        <p>I created MoodDrop for all of those days.</p>

        <p>You don’t have to be “ready” to be here.</p>
        <p>You don’t have to know what you’re feeling.</p>
        <p>You don’t have to write well or say the right thing.</p>

        <p>You can just… drop it.</p>

        <p>If you found your way here, I’m really glad you did.</p>
        <p>
          I’m here too — navigating change, identity, and the quiet parts of life
          no one talks about enough.
        </p>

        <p className="pt-2 font-medium">— Charae 💧</p>

        {/* ✅ Welcome CTA (Ritual: route to homepage mood picker) */}
        <CtaCard
          buttonText="Start a Drop"
          subText="Type it or voice it — release it, and walk away."
          onClick={startDropRitual}
        />
      </PostLayout>
    );
  }

  /* ===============================
     😣 TENSE POST (FULL)
     =============================== */
  if (slug === "tense" || slug === "tense-for-no-reason") {
    return (
      <PostLayout
        mood="Tense"
        title="Why You Feel Tense Even When Nothing Is Wrong"
      >
        <p className="text-sm text-muted-foreground">
          If your body feels tight, restless, or “on edge” even when life seems
          calm, you’re not broken. This is what happens when your nervous system
          hasn’t had a chance to release yet.
        </p>

        <h2 className="pt-4 text-lg font-semibold">
          A personal note from me 💧
        </h2>

        <p>I want to say this first — because I’ve lived it.</p>

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

        <p>
          What I’ve learned is this: tension doesn’t always come from chaos.
          Sometimes it comes from holding it together for too long.
        </p>

        <h2 className="pt-4 text-lg font-semibold">
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

        <h2 className="pt-4 text-lg font-semibold">
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

        <h2 className="pt-4 text-lg font-semibold">
          3 Soft Ways to Unwind the Coil
        </h2>

        <h3 className="pt-2 font-medium">1. The “Exhale” Priority</h3>
        <p>
          When we’re tense, we tend to take short, shallow sips of air. Focus only
          on the exhale — make it twice as long as the inhale. This gently signals
          safety to your nervous system.
        </p>

        <h3 className="pt-2 font-medium">2. The 10-Second Shake</h3>
        <p>
          Stand up and shake your hands, arms, and feet for ten seconds. It may
          feel silly, but it physically breaks the tension loop your body is
          holding.
        </p>

        <h3 className="pt-2 font-medium">3. The Brain Dump</h3>
        <p>
          Tension often comes from mental clutter. Give those thoughts somewhere
          to land so they don’t have to live in your body.
        </p>

        {/* ✅ Tense CTA (Mood already chosen: go straight to Drop It) */}
        <div className="pt-6">
          <div className="flex justify-center">
            <button
              onClick={() => startDropWithMood("Tense")}
              className="rounded-full bg-rose-200 px-10 py-4 text-sm font-medium text-rose-950 shadow-sm transition hover:shadow"
            >
              Start a Tense Drop
            </button>
          </div>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            You don’t have to fix it. Just release it.
          </p>
        </div>
      </PostLayout>
    );
  }

  /* ===============================
     🌱 STILL FORMING POSTS
     =============================== */
  if (
    slug === "crashout" ||
    slug === "overwhelmed" ||
    slug === "grounded" ||
    slug === "calm" ||
    slug === "joyful"
  ) {
    const titles: Record<string, string> = {
      crashout: "CrashOut",
      overwhelmed: "Overwhelmed",
      grounded: "Grounded",
      calm: "Calm",
      joyful: "Joyful",
    };

    return (
      <PostLayout mood={titles[slug]} title={titles[slug]}>
        <div className="rounded-2xl border border-blush/40 bg-white/90 p-6">
          <p className="text-base font-medium">Still forming.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            This space will open when it’s ready.
          </p>
        </div>

        <div className="pt-6">
          <Link href="/soft-reads" className="underline underline-offset-4">
            Back to Soft Reads →
          </Link>
        </div>
      </PostLayout>
    );
  }

  /* ===============================
     ❌ FALLBACK
     =============================== */
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <p className="text-muted-foreground">That Soft Read couldn’t be found.</p>
      <Link href="/soft-reads" className="underline underline-offset-4">
        Back to Soft Reads →
      </Link>
    </div>
  );
}

/* ===============================
   CTA CARD (Welcome)
   =============================== */
function CtaCard({
  buttonText,
  subText,
  onClick,
}: {
  buttonText: string;
  subText: string;
  onClick: () => void;
}) {
  return (
    <div className="mt-10 rounded-2xl border border-blush/40 bg-white px-6 py-8 text-center">
      <p className="text-sm font-medium">
        If you want a place to release it (without advice)…
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{subText}</p>

      <div className="mt-5 flex justify-center">
        <button
          onClick={onClick}
          className="rounded-full border border-blush/50 bg-white px-8 py-3 text-sm font-medium transition hover:shadow-sm"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

/* ===============================
   LAYOUT
   =============================== */
function PostLayout({
  title,
  mood,
  children,
}: {
  title: string;
  mood: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <Link href="/soft-reads" className="text-sm underline underline-offset-4">
        ← Back to Soft Reads
      </Link>

      <p className="mt-4 text-sm text-muted-foreground">{mood}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>

      <div className="mt-6 space-y-4 leading-relaxed text-warm-gray-700">
        {children}
      </div>
    </div>
  );
}
