// client/src/pages/CalmStudioPage.tsx
import { Link } from "wouter";
import { Wind, Waves, Sparkles, Eye } from "lucide-react";

const calmCards = [
  {
    title: "Take a Breath",
    description: "A small pause for your body and mind.",
    href: "/comfort/breath",
    icon: Wind,
    badge: "Ready",
  },
  {
    title: "Soft Visuals",
    description: "Gentle moments for when your mind needs less noise.",
    href: "/comfort/visuals",
    icon: Eye,
    badge: "Soon",
  },
  {
    title: "Soothing Sounds",
    description: "Let the room soften around you.",
    href: "/comfort/sounds",
    icon: Waves,
    badge: "Next",
  },
  {
    title: "Gentle Play",
    description: "Quiet interaction for restless moments.",
    href: "/comfort/play",
    icon: Sparkles,
    badge: "Playable",
  },
];

export default function CalmStudioPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#FFF9F5_0%,#FFF3EE_35%,#F8E0D9_100%)] px-4 py-10 text-[#7f5148]">
      <section className="mx-auto max-w-5xl">
        <div className="mb-10 rounded-[2rem] border border-white/40 bg-white/35 p-7 shadow-sm backdrop-blur-md">
          <p className="text-sm uppercase tracking-[0.28em] text-[#b98b80]">
            MoodDrop
          </p>

          <h1 className="mt-3 font-serif text-4xl text-[#7f5148]">
            Calm Studio
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#9b6c63]">
            A quieter space to settle, breathe, listen, or gently play when your
            mind needs somewhere soft to land.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {calmCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link key={card.title} href={card.href}>
                <button
                  type="button"
                  className="group w-full rounded-[2rem] border border-white/40 bg-white/35 p-6 text-left shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/50 hover:shadow-md"
                >
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/35 text-[#7f5148] shadow-sm">
                      <Icon size={25} />
                    </span>

                    <span className="rounded-full border border-blush-100 bg-blush-50 px-3 py-1 text-xs text-[#7f5148]">
                      {card.badge}
                    </span>
                  </div>

                  <h2 className="text-lg font-semibold text-[#7f5148]">
                    {card.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#9b6c63]">
                    {card.description}
                  </p>
                </button>
              </Link>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-[#9b6c63]">
          You don’t have to rush here.
        </p>
      </section>
    </main>
  );
}