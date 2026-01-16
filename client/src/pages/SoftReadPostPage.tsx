import React from "react";
import { Link, useRoute } from "wouter";

export default function SoftReadPostPage() {
  const [, params] = useRoute("/soft-reads/:slug");
  const slug = params?.slug;

  // ✅ Pinned Post (Revised)
  if (slug === "why-mooddrop-exists") {
    return (
      <PostLayout mood="Foundations" title="I Needed a Place That Didn’t Talk Back">
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
      </PostLayout>
    );
  }

  // ✅ Tense Post placeholder (keeps URL working)
  if (slug === "tense-for-no-reason") {
    return (
      <PostLayout mood="Tense" title="Why You Feel Tense Even When Nothing Is Wrong">
        <p>
          This one is coming next 💗 (We’ll write it together and publish it as
          the first official Soft Read.)
        </p>
      </PostLayout>
    );
  }

  // ✅ Fallback
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <p className="text-muted-foreground">That Soft Read couldn’t be found.</p>
      <Link href="/soft-reads" className="underline underline-offset-4">
        Back to Soft Reads →
      </Link>
    </div>
  );
}

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
