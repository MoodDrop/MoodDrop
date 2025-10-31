import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface NoteComposerProps {
  vibeId: string;
  onPost: (text: string) => void;
  disabled?: boolean;
}

const MAX_CHARS = 500;

export default function NoteComposer({ vibeId, onPost, disabled = false }: NoteComposerProps) {
  const [text, setText] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = text.trim();
    if (!trimmed) {
      toast({
        title: "Empty note",
        description: "Please write something before sharing.",
        variant: "destructive",
      });
      return;
    }

    if (trimmed.length > MAX_CHARS) {
      toast({
        title: "Too long",
        description: `Please keep your note under ${MAX_CHARS} characters.`,
        variant: "destructive",
      });
      return;
    }

    onPost(trimmed);
    setText("");
  };

  const remainingChars = MAX_CHARS - text.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-3 pt-3 border-t border-warm-gray-200">
      <p className="text-xs text-warm-gray-500">
        Note will post as <span className="font-medium text-warm-gray-600">Your Vibe ID</span>
      </p>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share a note of calm..."
        maxLength={MAX_CHARS}
        rows={3}
        disabled={disabled}
        className="w-full px-3 py-2 rounded-lg border border-warm-gray-300 focus:border-blush-400 focus:ring-2 focus:ring-blush-200 outline-none resize-none text-sm disabled:bg-warm-gray-50 disabled:cursor-not-allowed"
        data-testid="input-note-text"
      />
      
      <div className="flex justify-between items-center">
        <p className={`text-xs ${remainingChars < 50 ? "text-orange-500" : "text-warm-gray-500"}`}>
          {remainingChars} characters remaining
        </p>
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="px-4 py-2 rounded-lg bg-blush-400 hover:bg-blush-500 text-white text-sm font-medium shadow-sm hover:shadow-md transition-all disabled:bg-warm-gray-300 disabled:cursor-not-allowed min-h-[44px]"
          data-testid="button-send-note"
        >
          Send Note 💌
        </button>
      </div>
    </form>
  );
}
