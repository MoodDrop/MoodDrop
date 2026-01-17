import React from "react";
import { Link } from "wouter";

type Mood =
  | "Foundations"
  | "Calm"
  | "Tense"
  | "Overwhelmed"
  | "CrashOut"
  | "Joyful";

type SoftRead = {
  slug: string;
  title: string;
  excerpt: string;
  mood: Mood;
  readingTime: string; // e.g. "2 min read"
  pinned?: boolean;
};

const SOFT_READS: SoftRead[] = [
  {
    slug: "why-mooddrop-exists",
    title: "I Needed a Place That Didn’t Talk Back",
    excerpt:
      "A founder note for the days you don’t want advice — you just need somewhere to release.",
    mood: "Foundations",
    readingTime: "3 min read",
    pinned: true,
  },
  {
    slug: "why-you-feel-tense-for-no-reason",
    title: "Why You Feel Tense Even When Nothing Is Wrong",
    excerpt:
      "If your body won’t fully relax — even in quiet moments — this is for you.",
    mood: "Tense",
    readingTime: "2 min read",
  },
];

function moodTint(mood: Mood) {
  // Subtle outline tints (whisper-soft)
  switch (mood) {
    case "Calm":
      return "border-emerald-200 text-emerald-700";
    case "Tense":
      return "border-blush-200 text-blush-700";
    case "Overwhelmed":
      return "border-warm-gray-200 text-warm-gray-700";
    case "CrashOut":
      return "border-rose-200 text-rose-700";
    case "Joyful":
      return "border-amber-200 text-amber-700";
    case "Foundations":
    default:
      return "border-warm-gray-200 text-warm-gray-700";
  }
}

function MetaRow({ mood, readingTime }: { mood: Mood; readingTime: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={[
          "inline-flex items-center",
          "rounded-full border px-3 py-1",
          "text-xs font-medium",
          moodTint(mood),
          "bg-white/60",
        ].join(" ")}
      >
        {mood}
      </span>

      <span className="text-xs text-muted-foreground">{readingTime}</span>
    </div>
  );
}

function CardShell({
  children,
  href,
  featured,
}: {
  children: React.ReactNode;
  href: string;
  featured?: boolean;
}) {
  // ✅ subtle hover movement: tiny lift + soft shadow + slightly clearer title via group-hover
  return (
    <Link href={href}>
      <a
        className={[
          "group block",
          "rounded-2xl border border-blush-200 bg-white/60",
          "transition",
          "hover:-translate-y-0.5 hover:shadow-md",
          "focus:outline-none focus:ring-2 focus:ring-blush-200",
          featured ? "p-6" : "p-5",
        ].join(" ")}
      >
        {children}
      </a>
    </Link>
  );
}

export default function SoftReadsPage() {
  const pinned = SOFT_READS.find((p) => p.pinned);
  const rest = SOFT_READS.filter((p) => !p.pinned);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      {/* Page header */}
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-warm-gray-900">
          Soft Reads
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Gentle words for when your mind feels loud.
        </p>
      </div>

      {/* Featured pinned card */}
      {pinned && (
        <div className="mt-10">
          <CardShell href={`/soft-reads/${pinned.slug}`} featured>
            <div className="flex items-start justify-between gap-4">
              <MetaRow mood={pinned.mood} readingTime={pinned.readingTime} />
              <span className="text-xs text-muted-foreground">📌 Pinned</span>
            </div>

            <h2 className="mt-4 text-2xl font-medium tracking-tight text-warm-gray-900 transition-colors group-hover:text-warm-gray-950">
              {pinned.title}
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-warm-gray-700">
              {pinned.excerpt}
            </p>

            <div className="mt-5 inline-flex text-sm font-medium text-warm-gray-800">
              Read softly →
            </div>
          </CardShell>
        </div>
      )}

      {/* Grid */}
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
        {rest.map((post) => (
          <CardShell key={post.slug} href={`/soft-reads/${post.slug}`}>
            <MetaRow mood={post.mood} readingTime={post.readingTime} />

            <h3 className="mt-4 text-lg font-medium tracking-tight text-warm-gray-900 transition-colors group-hover:text-warm-gray-950">
              {post.title}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-warm-gray-700">
              {post.excerpt}
            </p>

            <div className="mt-4 inline-flex text-sm font-medium text-warm-gray-800">
              Read →
            </div>
          </CardShell>
        ))}
      </div>

      {/* Soft footer line (optional, but on-brand) */}
      <p className="mt-10 text-center text-xs text-muted-foreground">
        Read softly. Drop gently.
      </p>
    </div>
  );
}

