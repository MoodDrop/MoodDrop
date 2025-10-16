import { useState, useRef, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { moods, type MoodKey } from "@/lib/moods";
import { getAffirmation } from "@/lib/affirmations";

interface WriteTabProps {
  selectedMood: MoodKey | null;
  onResetMood: () => void;
  draftText: string;
  onTextChange: (text: string) => void;
}

export default function WriteTab({ selectedMood, onResetMood, draftText, onTextChange }: WriteTabProps) {
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [affirmation, setAffirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const affirmationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    return () => {
      if (affirmationTimerRef.current) {
        clearTimeout(affirmationTimerRef.current);
      }
    };
  }, []);

  // Auto-focus textarea when component opens
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const emotion = selectedMood ? moods[selectedMood].key : "Calm";

    // Save to localStorage (anonymous, client-side only)
    try {
      const savedMessages = JSON.parse(localStorage.getItem('mooddrop_messages') || '[]');
      savedMessages.push({
        id: Date.now(),
        content: draftText.trim(),
        emotion,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('mooddrop_messages', JSON.stringify(savedMessages));
    } catch (error) {
      console.log('LocalStorage not available, continuing anyway');
    }

    // Get affirmation message
    const encouragingMessage = getAffirmation(draftText.trim(), emotion);
    
    if (affirmationTimerRef.current) {
      clearTimeout(affirmationTimerRef.current);
    }
    
    setAffirmation(encouragingMessage);
    setShowAffirmation(true);
    onTextChange("");
    setIsSubmitting(false);
    
    affirmationTimerRef.current = setTimeout(() => {
      setShowAffirmation(false);
      setAffirmation("");
      affirmationTimerRef.current = null;
    }, 8000);
  };

  const mood = selectedMood ? moods[selectedMood] : null;

  return (
    <div className="animate-in fade-in duration-500">
      {/* Selected Mood Display */}
      {mood && (
        <div className="flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-blush-50 to-cream-50 rounded-xl border border-blush-100">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
              style={{ backgroundColor: mood.color }}
            />
            <div>
              <p className="font-medium text-warm-gray-800">{mood.key}</p>
              <p className="text-sm text-warm-gray-600">{mood.meaning}</p>
            </div>
          </div>
          <button
            onClick={onResetMood}
            className="flex items-center gap-2 text-sm text-warm-gray-600 hover:text-warm-gray-800 transition"
            data-testid="button-reset-mood"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      )}

      {/* Affirmation Display */}
      {showAffirmation && (
        <div 
          className="mb-6 p-6 bg-gradient-to-br from-blush-50 to-cream-50 border-2 border-blush-200 rounded-2xl shadow-lg animate-in fade-in duration-500"
          data-testid="affirmation-message"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blush-300 rounded-full flex items-center justify-center">
              <span className="text-xl">✨</span>
            </div>
            <div className="flex-1">
              <p className="text-warm-gray-700 leading-relaxed font-medium">
                {affirmation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Write Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-warm-gray-700 mb-2">
            Write it out (only you can see this)
          </label>
          <textarea
            ref={textareaRef}
            value={draftText}
            onChange={(e) => onTextChange(e.target.value)}
            rows={6}
            placeholder="Let it all drop here — one mood at a time."
            className="w-full rounded-lg border border-warm-gray-200 focus:ring-2 focus:ring-blush-300 focus:outline-none px-4 py-3 text-warm-gray-800 placeholder-warm-gray-400"
            data-testid="textarea-write"
          />
        </div>

        <button
          type="submit"
          disabled={!draftText.trim() || isSubmitting}
          className="w-full bg-blush-300 hover:bg-blush-400 disabled:bg-warm-gray-200 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
          data-testid="button-submit-write"
        >
          {isSubmitting ? "Sharing..." : "Share Your Feelings"}
        </button>
      </form>
    </div>
  );
}
