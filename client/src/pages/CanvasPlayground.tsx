import MoodCanvas from "@/components/MoodCanvas";

export default function CanvasPlayground() {
  const samples = [
    {
      mood: "Joy",
      text: "I finally finished the roadmap and didn’t rush myself.",
      vibeCount: 9,
      vibeType: "resonance" as const,
    },
    {
      mood: "Calm",
      text: "Nothing is urgent right now. I can breathe.",
      vibeCount: 2,
      vibeType: "holding" as const,
    },
    {
      mood: "Grounded",
      text: "I’m here. I’m steady. I don’t need to move fast.",
      vibeCount: 4,
      vibeType: "blessing" as const,
    },
    {
      mood: "Tense",
      text: "My shoulders are tight and I don’t know why.",
      vibeCount: 1,
      vibeType: "holding" as const,
    },
    {
      mood: "Overwhelmed",
      text: "There’s too much in my head right now.",
      vibeCount: 6,
      vibeType: "resonance" as const,
    },
    {
      mood: "Crash Out",
      text: "I’m at my limit and I need to let this go.",
      vibeCount: 8,
      vibeType: "blessing" as const,
    },
  ];

  return (
    <main className="min-h-screen bg-[#FFF7F9] px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-xl font-semibold text-[#4A3F41]">
            MoodCanvas Playground
          </h1>
          <p className="text-sm text-[#6D5E61]">
            Temporary page to visually test MoodCanvas before the Gallery exists.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {samples.map((sample, index) => (
            <MoodCanvas key={index} {...sample} />
          ))}
        </div>
      </div>
    </main>
  );
}
