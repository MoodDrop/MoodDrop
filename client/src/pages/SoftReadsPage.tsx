import { Link } from "wouter";

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
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold">Soft Reads</h1>
        <p className="mt-2 text-sm opacity-70">
          Gentle words for when your mind feels loud.
        </p>
      </div>

      {/* 📌 Pinned Intro Card */}
      <Link href="/soft-reads/welcome">
        <a className="mb-10 block rounded-2xl border border-blush/40 bg-white p-6 transition hover:shadow-sm">
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
            A founder note for the days you don’t want advice — you just
            need somewhere to release.
          </p>

          <div className="mt-4 text-sm opacity-70">Read softly →</div>
        </a>
      </Link>

      {/* Mood Cards Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {SOFT_READ_CARDS.map((card) => (
          <Link key={card.slug} href={`/soft-reads/${card.slug}`}>
            <a className="group block rounded-2xl border border-blush/40 bg-white p-4 transition hover:-translate-y-1 hover:shadow-sm">
              {/* Top Row */}
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full border px-3 py-1 text-xs">
                  {card.mood}
                </span>

                {card.status === "live" ? (
                  <span className="text-xs opacity-60">
                    {card.readTime}
                  </span>
                ) : (
                  <span className="text-xs opacity-50">Coming soon</span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-base font-medium">{card.title}</h3>

              {/* Description */}
              <p className="mt-1 text-sm opacity-75">
                {card.description}
              </p>

              {/* Action */}
              <div className="mt-4 text-sm opacity-70">
                {card.status === "live" ? "Read →" : "Open →"}
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
