import { useState, useEffect } from "react";
import { Heart, RefreshCw, Phone, MessageCircle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const inspirationalQuotes = [
  {
    text: "You are braver than you believe, stronger than you seem, and smarter than you think.",
    author: "A.A. Milne"
  },
  {
    text: "Every storm runs out of rain. Every dark night turns into day.",
    author: "Maya Angelou"
  },
  {
    text: "The only way out is through.",
    author: "Robert Frost"
  },
  {
    text: "You have been assigned this mountain to show others it can be moved.",
    author: "Mel Robbins"
  },
  {
    text: "Healing isn't about forgetting or moving on. It's about learning to carry the weight in a way that doesn't break you.",
    author: "Unknown"
  },
  {
    text: "Your current situation is not your final destination. The best is yet to come.",
    author: "Unknown"
  },
  {
    text: "It's okay to not be okay. It's not okay to stay that way.",
    author: "Unknown"
  },
  {
    text: "You are allowed to be both a masterpiece and a work in progress simultaneously.",
    author: "Sophia Bush"
  },
  {
    text: "The comeback is always stronger than the setback.",
    author: "Unknown"
  },
  {
    text: "Your feelings are valid. Your struggles are real. Your healing matters.",
    author: "Unknown"
  }
];

const copingStrategies = [
  {
    title: "Deep Breathing",
    description: "Take 4 deep breaths: inhale for 4 counts, hold for 4, exhale for 4.",
    icon: "🫁"
  },
  {
    title: "5-4-3-2-1 Grounding",
    description: "Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.",
    icon: "🌱"
  },
  {
    title: "Progressive Muscle Relaxation",
    description: "Tense and release each muscle group starting from your toes to your head.",
    icon: "💪"
  },
  {
    title: "Mindful Walking",
    description: "Take a slow walk and focus on each step, your breathing, and your surroundings.",
    icon: "🚶"
  },
  {
    title: "Journaling",
    description: "Write down your thoughts and feelings without judgment. Let them flow freely.",
    icon: "📝"
  },
  {
    title: "Listen to Music",
    description: "Put on your favorite calming or uplifting music and let it wash over you.",
    icon: "🎵"
  }
];

const emergencyResources = [
  {
    name: "National Suicide Prevention Lifeline",
    contact: "988",
    description: "24/7 free and confidential support",
    icon: <Phone size={16} />
  },
  {
    name: "Crisis Text Line",
    contact: "Text HOME to 741741",
    description: "24/7 crisis support via text",
    icon: <MessageCircle size={16} />
  },
  {
    name: "SAMHSA National Helpline",
    contact: "1-800-662-4357",
    description: "Treatment referral and information service",
    icon: <Phone size={16} />
  },
  {
    name: "International Association for Suicide Prevention",
    contact: "iasp.info/resources/Crisis_Centres",
    description: "Crisis centers worldwide",
    icon: <Globe size={16} />
  }
];

export default function ComfortCorner() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [showCoping, setShowCoping] = useState(false);
  const [showResources, setShowResources] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % inspirationalQuotes.length);
    }, 15000); // Change quote every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const nextQuote = () => {
    setCurrentQuote(prev => (prev + 1) % inspirationalQuotes.length);
  };

  return (
    <div className="bg-gradient-to-br from-blush-50 to-cream-50 rounded-2xl p-6 mb-8 border border-blush-100">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Heart className="text-blush-400" size={20} />
        <h3 className="text-lg font-semibold text-warm-gray-700">Comfort Corner</h3>
      </div>

      {/* Inspirational Quote */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-blush-100">
        <div className="flex justify-between items-start mb-3">
          <span className="text-2xl">💝</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextQuote}
            className="h-8 w-8 p-0 hover:bg-blush-100"
            data-testid="button-next-quote"
          >
            <RefreshCw size={14} />
          </Button>
        </div>
        <blockquote className="text-warm-gray-700 italic mb-2 leading-relaxed">
          "{inspirationalQuotes[currentQuote].text}"
        </blockquote>
        <cite className="text-blush-400 text-sm font-medium">
          — {inspirationalQuotes[currentQuote].author}
        </cite>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCoping(!showCoping)}
          className="border-blush-200 hover:bg-blush-50 text-warm-gray-700"
          data-testid="button-toggle-coping"
        >
          🧘 Coping Strategies
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowResources(!showResources)}
          className="border-blush-200 hover:bg-blush-50 text-warm-gray-700"
          data-testid="button-toggle-resources"
        >
          🆘 Crisis Resources
        </Button>
      </div>

      {/* Coping Strategies */}
      {showCoping && (
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-blush-100">
          <h4 className="font-medium text-warm-gray-700 mb-3">Quick Coping Strategies</h4>
          <div className="grid gap-3">
            {copingStrategies.map((strategy, index) => (
              <div key={index} className="flex gap-3 p-3 bg-blush-50 rounded-lg">
                <span className="text-xl flex-shrink-0">{strategy.icon}</span>
                <div>
                  <h5 className="font-medium text-warm-gray-700 text-sm">{strategy.title}</h5>
                  <p className="text-warm-gray-600 text-xs leading-relaxed">{strategy.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crisis Resources */}
      {showResources && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-blush-100">
          <h4 className="font-medium text-warm-gray-700 mb-3">Emergency Support Resources</h4>
          <div className="text-xs text-warm-gray-500 mb-3 p-2 bg-yellow-50 rounded border border-yellow-200">
            If you're having thoughts of self-harm or suicide, please reach out for help immediately.
          </div>
          <div className="grid gap-3">
            {emergencyResources.map((resource, index) => (
              <div key={index} className="flex gap-3 p-3 bg-blush-50 rounded-lg">
                <div className="text-blush-400 flex-shrink-0 mt-1">
                  {resource.icon}
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-warm-gray-700 text-sm">{resource.name}</h5>
                  <p className="text-blush-600 text-sm font-medium">{resource.contact}</p>
                  <p className="text-warm-gray-600 text-xs">{resource.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gentle Reminder */}
      <div className="text-center text-warm-gray-600 text-xs mt-4 p-3 bg-cream-50 rounded-lg border border-cream-200">
        💙 Remember: You are not alone. Your feelings are valid. Help is always available.
      </div>
    </div>
  );
}