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
            data-testid="button
