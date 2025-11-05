import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface DropComposerProps {
  vibeId: string;
  onPost?: (text: string, mood?: string) => void;
  disabled?: boolean;
}

const MOOD_OPTIONS = [
  { emoji: "💧", label: "Calm" },
  { emoji: "🌷", label: "Tender" },
  { emoji: "🌿", label: "Grounded" },
  { emoji: "🌙", label: "Reflective" },
  { emoji: "✨", label: "Hopeful" },
  { emoji: "💨", label: "Crash Out" },
  { emoji: "😊", label: "Joy" },
];

const MAX_CHARS = 500;

export default function DropComposer({
  vibeId,
  onPost,
  disabled = false,
}: DropComposerProps) {
  const [text, setText] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | undefined>();
  const { toast } = useToast();

  // 🩵 Handle submit + send to Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = text.trim();

    if (!trimmed) {
      toast({
        title: "Empty drop",
        description: "Please write something before sharing.",
        variant: "destructive",
      });
      return;
    }

    if (trimmed.length > MAX_CHARS) {
      toast({
        title: "Too long",
        description: `Please keep your drop under ${MAX_CHARS} characters.`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Save to Supabase
      const { data, error } = await supabase
        .from("drops")
        .insert([
          {
            vibeId: vibeId,
            text: trimmed,
            mood: selectedMood ?? null,
            replyTo: null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Optional: keep local UI in sync
      onPost?.(trimmed, selectedMood);

      // Reset form
      setText("");
      setSelectedMood(undefined);

      toast({
        title: "Shared 💧",
        description: "Your drop was posted to the community.",
      });
    } catch (err: any) {
      toast({
        title: "Couldn’t share",
        description: err?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const remainingChars = MAX_CHARS - text.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Posting as */}
      <p className="text-sm text-warm-gray-600">
        Posting as Your Vibe ID:{" "}
        <span className="font-medium text-warm-gray-700">{vibeId}</span>
      </p>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's your vibe today..."
        maxLength={MAX_CHARS}
        rows={4}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-xl border border-warm-gray-300 focus:border-blush-400 focus:ring-2 focus:ring-blush-200 outline-none resize-none disabled:bg-warm-gray-50 disabled:cursor-not-allowed"
        data-testid="input-drop-text"
      />

      {/* Character count */}
      <div className="flex justify-between items-center">
        <p
          className={`text-sm ${
            remainingChars < 50 ? "text-orange-500" : "text-warm-gray-500"
          }`}
        >
          {remainingChars} characters remaining
        </p>
      </div>

      {/* Mood selector */}
      <div>
        <label className="text-sm text-warm-gray-600 mb-2 block">
          Choose a mood (optional)
        </label>
        <div className="flex gap-2 flex-wrap">
          {MOOD_OPTIONS.map((mood) => (
            <button
              key={mood.emoji}
              type="button"
              onClick={() =>
                setSelectedMood(
                  selectedMood === mood.emoji ? undefined : mood.emoji,
                )
              }
              className={`px-4 py-2 rounded-full border-2 transition-all min-h-[44px] ${
                selectedMood === mood.emoji
                  ? "border-blush-400 bg-blush-50"
                  : "border-warm-gray-200 hover:border-warm-gray-300"
              }`}
              disabled={disabled}
              data-testid={`mood-${mood.label.toLowerCase()}`}
            >
              <span className="text-xl mr-1">{mood.emoji}</span>
              <span className="text-sm">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Submit button */}
      <div className="space-y-2">
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="w-full py-3 rounded-xl bg-blush-400 hover:bg-blush-500 text-white font-medium shadow-sm hover:shadow-md transition-all disabled:bg-warm-gray-300 disabled:cursor-not-allowed min-h-[44px]"
          data-testid="button-share-drop"
        >
          Share Drop 💧
        </button>
        <p className="text-xs text-center text-warm-gray-500">
          “No right words needed — just honesty.”
        </p>
      </div>
    </form>
  );
}
