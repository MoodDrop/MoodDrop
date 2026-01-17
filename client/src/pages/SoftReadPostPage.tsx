import React, { useEffect } from "react";
import { Link } from "wouter";

type SoftReadPost = {
  slug: string;
  title: string;
  mood: string;
  readingTime: string;
  excerpt?: string;
  moodCtaMood?: string; // e.g. "Tense"
  content: React.ReactNode;
};

const STORAGE_SELECTED_MOOD_KEY = "mooddrop_selected_mood";

const POSTS: Record<string, SoftReadPost> = {
  "why-mooddrop-exists": {
    slug: "why-mooddrop-exists",
    title: "I Needed a Place That Didn’t Talk Back",
    mood: "Foundations",
    readingTime: "3 min read",
    excerpt:
      "A founder note for the days you don’t want advice — you just need somewhere to release.",
    content: (
      <>
        <p>
          Hi, I’m Charae 💧 I’m a stay-at-home mom of four daughters. I’m a wife.
          And I’m a woman who’s still figuring herself out in the middle of
          everyone else needing her.
        </p>
        <p>
          My days are full — of love, responsibility, noise, repetition, care,
          and invisible work. Some days I feel grounded and grateful. Other days
          I feel stretched thin, quietly overwhelmed, or unsure of who I’m
          becoming in this season of my life.
        </p>
        <p>
          And then there were days I didn’t want advice. Not encouragement. Not
          “have you tried this?” Not even a response.
        </p>
        <p>
          I just needed somewhere to put the feeling so it wouldn’t keep sitting
          in my chest.
        </p>
        <p>
          Private journaling helped — but it still felt like everything stayed
          trapped inside me. Social media felt loud. Talking felt like work.
        </p>
        <p>
          I was also changing. Outgrowing certain friendships. Losing people I
          thought would be around forever. Trying to find connection again —
          especially over 40 — when starting over socially feels awkward and
          vulnerable.
        </p>
        <p>
          Sometimes I had wins that felt huge to me… and life just kept moving
          like nothing happened. Not because people didn’t care — they just
          didn’t always see it.
        </p>
        <p>So I built MoodDrop — not as a solution, but as a place to release.</p>
        <p>
          A place where I don’t have to explain myself. Where I don’t have to
          organize my thoughts. Where I don’t have to make sense for anyone
          else.
        </p>
        <p>
          Some days I’m calm. Some days I’m overwhelmed. Some days I’m holding
          it together so tightly I can feel it in my body.
        </p>
        <p>I created MoodDrop for all of those days.</p>
        <p>
          You don’t have to be “ready” to be here. You don’t have to know what
          you’re feeling. You don’t have to write well or say the right thing.
        </p>
        <p>You can just… drop it.</p>
        <p>
          If you found your way here, I’m really glad you did. I’m here too —
          navigating change, identity, and the quiet parts of life no one talks
          about enough.
        </p>
        <p className="mt-6 font-medium">— Charae 💧</p>
      </>
    ),
  },

  "why-you-feel-tense-for-no-reason": {
    slug: "why-you-feel-tense-for-no-reason",
    title: "Why You Feel Tense Even When Nothing Is Wrong",
    mood: "Tense",
    readingTime: "3 min read",
    excerpt:
      "If your body won’t fully relax — even in quiet moments — this is for you.",
    moodCtaMood: "Tense",
    content: (
      <>
        <p>
          If you’re here because your chest feels tight, your thoughts won’t
          slow down, or your body can’t fully relax — even though nothing bad is
          happening — you’re not alone. And you’re not imagining it.
        </p>

        <h2 className="mt-8 text-lg font-medium text-warm-gray-900">
          When your body stays “on” longer than it needs to
        </h2>
        <p>
          Tension doesn’t always come from a clear problem. Sometimes it comes
          from holding things in for too long — unspoken thoughts, delayed
          reactions, responsibilities that don’t pause just because you’re tired.
        </p>
        <p>
          Your nervous system doesn’t always know the difference between danger
          and pressure. So it stays alert — even at night, even in quiet moments,
          even when you want rest.
        </p>

        <h2 className="mt-8 text-lg font-medium text-warm-gray-900">
          Why overthinking shows up when you finally stop moving
        </h2>
        <p>
          When the day slows down, your mind finally has space to speak. And
          instead of calm, you get replayed conversations, “did I do enough?”
          thoughts, and worries that didn’t have time to surface earlier.
        </p>
        <p>
          That’s why tension often shows up after everything is done. Nothing is
          wrong — your system is just catching up.
        </p>

        <h2 className="mt-8 text-lg font-medium text-warm-gray-900">
          If the tension is still sitting with you…
        </h2>
        <p>
          MoodDrop was created for moments like this — a place to type it or
          voice it, release it without judgment, and walk away when you’re done.
        </p>
      </>
    ),
  },
};

export default function SoftReadPostPage({
  params,
}: {
  params: { slug?: string };
}) {
  const slug = params?.slug || "";
  const post = POSTS[slug];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (!post) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <Link href="/soft-reads">
          <a className="text-sm font-medium text-warm-gray-800 hover:underline">
            ← Back to Soft Reads
          </a>
        </Link>

        <div className="mt-8 rounded-2xl border border-blush-200 bg-white/60 p-6">
          <h1 className="text-xl font-semibold text-warm-gray-900">
            This Soft Read isn’t available yet.
          </h1>
          <p className="mt-2 text-sm text-warm-gray-700">
            Try heading back to Soft Reads to choose another one.
          </p>
        </div>
      </div>
    );
  }

  const hasMoodCta = Boolean(post.moodCtaMood);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <Link href="/soft-reads">
        <a className="text-sm font-medium text-warm-gray-800 hover:underline">
          ← Back to Soft Reads
        </a>
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-blush-200 bg-white/60 px-3 py-1 text-xs font-medium text-warm-gray-700">
          {post.mood}
        </span>
        <span className="text-xs text-muted-foreground">{post.readingTime}</span>
      </div>

      <h1 className="mt-4 text-3xl font-medium tracking-tight text-warm-gray-900">
        {post.title}
      </h1>

      {post.excerpt && (
        <p className="mt-3 text-sm leading-relaxed text-warm-gray-700">
          {post.excerpt}
        </p>
      )}

      <div className="mt-8 rounded-2xl border border-blush-200 bg-white/60 p-6 leading-relaxed text-warm-gray-800 space-y-4">
        {post.content}
      </div>

      <div className="mt-8 rounded-2xl border border-blush-200 bg-white/60 p-6 text-center">
        <p className="text-sm font-medium text-warm-gray-900">
          If you want a place to release it (without advice)…
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Type it or voice it — release it, and walk away.
        </p>

        <div className="mt-6 flex justify-center">
          {hasMoodCta ? (
            <a
              href="/drop-it?mood=tense"
              onClick={() => {
                // Force Tense before navigating (kills stale Joyful)
                localStorage.setItem(STORAGE_SELECTED_MOOD_KEY, "Tense");
              }}
              className="rounded-full border border-blush-200 bg-white/70 px-6 py-2 text-sm font-medium text-warm-gray-700 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blush-200"
            >
              Start a Tense Drop
            </a>
          ) : (
            <Link href="/">
              <a className="rounded-full border border-blush-200 bg-white/70 px-6 py-2 text-sm font-medium text-warm-gray-700 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blush-200">
                Start a Drop
              </a>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
