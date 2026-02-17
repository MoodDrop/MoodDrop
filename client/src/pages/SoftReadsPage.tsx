import { Link } from "wouter";
import SoftReadsAtmosphere from "@/components/SoftReadsAtmosphere";

const SOFT_READ_CARDS = [
  {
    mood: "Tense",
    title: "Why You Feel Tense Even When Nothing Is Wrong",
    description:
      "If your body won’t fully relax — even in quiet moments — this is for you.",
    slug: "tense",
    status: "live",
    readTime: "2 min read",
  },
  {
    mood: "Overwhelmed",
    title: "Overwhelmed",
    description: "Gentle words for when everything feels like too much.",
    slug: "overwhelmed",
    status: "coming-soon",
  },
  {
    mood: "CrashOut",
    title: "CrashOut",
    description: "When everything hits at once and your system shuts down.",
    slug: "crashout",
    status: "coming-soon",
  },
  {
    mood: "Grounded",
    title: "Grounded",
    description: "Finding your footing again.",
    slug: "grounded",
    status: "coming-soon",
  },
  {
    mood: "Calm",
    title: "Calm",
    description: "Quiet moments for your nervous system.",
    slug: "calm",
    status: "coming-soon",
  },
  {
    mood: "Joyful",
    title: "Joyful",
    description: "Lightness without guilt.",
    slug: "joyful",
    status: "coming-soon",
  },
];

export default function SoftReadsPage() {
  return (
    <div className="relative mx-auto max-w-5xl px-4 py-12">
      {/* 🌸 Soft Reads atmospheric warmth layer (page-scoped) */}
      <SoftReadsAtmosphere />

      {/* Header */}
      <div className="mb-10 text-center relative">
        {/* subtle reading-room glow behind header */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-70 blur-3xl bg-[radial-gradient(circle_at_50%_40%,rgba(255,230,236,0.75),transparent_65%)]" />

        <h1 className="text-3xl font-semibold">Soft Reads</h1>
        <p className="mt-2 text-sm opacity-70">
          Gentle words for when your mind feels loud.
        </p>
      </div>

      {/* 📌 Pinned Intro Card */}
      <Link href="/soft-reads/welcome">
        <a className="relative mb-10 block rounded-2xl border border-blush/40 bg-white/95 backdrop-blur-sm p-6 transition hover:shadow-sm">
          {/* subtle radial glow behind pinned card */}
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 blur-2xl bg-[radial-gradient(circle_at_50%_50%,rgba(255,220,230,0.6),transparent_70%)]" />

          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded-full border px-3 py-1 text-xs">
                Foundations
              </span>
              <span className="text-xs opacity-60">3 min read</span>
            </div>

            <span className="text-xs opacity-60">📌 Pinned</span>
          </div>

          <h2 className="text-xl font-medium">
            I Needed a Place That Didn’t Talk Back
          </h2>

          <p className="mt-2 text-sm opacity-75">
            A founder note for the days you don’t want advice — you just need
            somewhere to release.
          </p>

          <div className="mt-4 text-sm opacity-70">Enter →</div>
        </a>
      </Link>

      {/* Mood Cards Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {SOFT_READ_CARDS.map((card) => {
          const isLive = card.status === "live";

          return (
            <Link key={card.slug} href={`/soft-reads/${card.slug}`}>
              <a className="relative group block rounded-2xl border border-blush/40 bg-white/95 backdrop-blur-sm p-4 transition hover:-translate-y-1 hover:shadow-sm">
                {/* soft glow on hover */}
                <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 group-hover:opacity-60 blur-xl transition bg-[radial-gradient(circle_at_50%_50%,rgba(255,220,230,0.55),transparent_70%)]" />

                {/* Top Row */}
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-full border px-3 py-1 text-xs">
                    {card.mood}
                  </span>

                  {isLive ? (
                    <span className="text-xs opacity-60">{card.readTime}</span>
                  ) : (
                    <span className="text-xs opacity-55">Still forming</span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base font-medium">{card.title}</h3>

                {/* Description */}
                <p className="mt-1 text-sm opacity-75">{card.description}</p>

                {/* Action */}
                <div className="mt-4 text-sm opacity-70">
                  {isLive ? "Enter →" : "Held for now →"}
                </div>
              </a>
            </Link>
          );
        })}
      </div>

      {/* Closing line */}
      <div className="mt-12 text-center text-sm opacity-60 italic">
        Take what you need. Leave the rest.
      </div>
    </div>
  );
}
