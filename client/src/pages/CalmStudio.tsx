import { Music, Wind, Youtube, Sparkles, Gamepad2 } from "lucide-react";

export default function CalmStudio() {
  const tools = [
    {
      icon: <Music className="w-8 h-8 text-warm-gray-600" />,
      title: "Soundscapes",
      description: "Ambient sounds to help you focus and relax",
    },
    {
      icon: <Wind className="w-8 h-8 text-warm-gray-600" />,
      title: "Breathing",
      description: "Guided breathing exercises for calm",
    },
    {
      icon: <Youtube className="w-8 h-8 text-warm-gray-600" />,
      title: "Watch & Smile",
      description: "Curated uplifting videos",
    },
    {
      icon: <Sparkles className="w-8 h-8 text-warm-gray-600" />,
      title: "Affirmations",
      description: "Gentle reminders and positive messages",
    },
    {
      icon: <Gamepad2 className="w-8 h-8 text-warm-gray-600" />,
      title: "Mini Games",
      description: "Simple interactive calming activities",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold text-warm-gray-800 mb-3">
          Calm Studio
        </h1>
        <p className="text-warm-gray-600 leading-relaxed">
          A small collection of soothing tools. More coming soon.
        </p>
      </div>

      {/* Grid of Coming Soon Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool, index) => (
          <div
            key={index}
            className="rounded-2xl border border-blush-100 bg-white/80 p-6 shadow-sm hover:shadow-md transition-all"
            data-testid={`tool-card-${tool.title.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 rounded-full bg-cream-50">
                {tool.icon}
              </div>
              <h3 className="text-lg font-medium text-warm-gray-800">
                {tool.title}
              </h3>
              <p className="text-sm text-warm-gray-600">
                {tool.description}
              </p>
              <span className="inline-block px-3 py-1 rounded-full bg-blush-100 text-blush-600 text-xs font-medium">
                Coming soon
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
