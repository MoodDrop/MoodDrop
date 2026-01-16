import { Link } from "wouter";

export default function SoftReadsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      {/* Page Header */}
      <h1 className="text-3xl font-semibold tracking-tight">Soft Reads</h1>
      <p className="mt-2 text-muted-foreground">
        Comforting reflections connected to real moods — written gently, without judgment.
      </p>

      {/* 📌 Pinned Intro Post (Clickable) */}
      <Link href="/soft-reads/why-mooddrop-exists">
        <div className="mt-8 cursor-pointer rounded-2xl border bg-white/60 p-6 transition hover:bg-white/80">
          <p className="text-sm text-muted-foreground">📌 Pinned · Foundations</p>

          <h2 className="mt-3 text-2xl font-semibold">
            I Needed a Place That Didn’t Talk Back
          </h2>

          <p className="mt-3 text-muted-foreground">
            A note from the founder on why MoodDrop exists — and why release
            matters more than advice.
          </p>

          <p className="mt-4 text-sm underline underline-offset-4">
            Read softly →
          </p>
        </div>
      </Link>

      {/* First Topic Placeholder */}
      <div className="mt-8 rounded-2xl border bg-white/60 p-6">
        <p className="text-sm text-muted-foreground">Tense</p>
        <h3 className="mt-2 text-xl font-semibold">
          Why You Feel Tense Even When Nothing Is Wrong
        </h3>
        <p className="mt-2 text-muted-foreground">
          That tight feeling that shows up even on quiet days — and what it might
          be asking for.
        </p>
      </div>
    </div>
  );
}
