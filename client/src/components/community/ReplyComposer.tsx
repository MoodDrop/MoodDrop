import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

interface ReplyComposerProps {
  parentId: string;
  vibeId: string;
  onReply: (parentId: string, text: string) => void;
  onCancel: () => void;
}

const MAX_CHARS = 240; // Shorter limit for replies

export default function ReplyComposer({
  parentId,
  vibeId,
  onReply,
  onCancel,
}: ReplyComposerProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = text.trim();
    if (!trimmed) {
      toast({
        title: "Empty reply",
        description: "Please write something before posting.",
        variant: "destructive",
      });
      return;
    }

    if (trimmed.length > MAX_CHARS) {
      toast({
        title: "Too long",
        description: `Please keep your reply under ${MAX_CHARS} characters.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("drops")
        .insert([
          {
            vibe_id: vibeId,
            text: trimmed,
            mood: null,
            reply_to: parentId,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Reply sent 💌",
        description: "Your reply vibe has been shared.",
      });

      setText("");
      onReply(parentId, trimmed);
    } catch (err: any) {
      toast({
        title: "Couldn't send reply",
        description: err?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingChars = MAX_CHARS - text.length;

  return (
    <form onSubmit={handleSubmit} className="mt-3 p-3 bg-cream-50 rounded-lg border border-warm-gray-200">
      <p className="text-xs text-warm-gray-600 mb-2">
        Reply as <span className="font-medium">{vibeId}</span>
      </p>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share a note of calm..."
        maxLength={MAX_CHARS}
        rows={3}
        disabled={isSubmitting}
        className="w-full px-3 py-2 rounded-lg border border-warm-gray-300 focus:border-blush-400 focus:ring-2 focus:ring-blush-200 outline-none resize-none text-sm disabled:bg-warm-gray-50 disabled:cursor-not-allowed"
        data-testid="input-reply-text"
      />

      <div className="flex items-center justify-between mt-2">
        <p className={`text-xs ${remainingChars < 30 ? "text-orange-500" : "text-warm-gray-500"}`}>
          {remainingChars} characters remaining
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-3 py-1.5 text-xs text-warm-gray-600 hover:bg-warm-gray-100 rounded-lg transition-colors disabled:opacity-50"
            data-testid="button-cancel-reply"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !text.trim()}
            className="px-3 py-1.5 text-xs bg-blush-400 hover:bg-blush-500 text-white rounded-lg transition-colors disabled:bg-warm-gray-300 disabled:cursor-not-allowed"
            data-testid="button-send-reply"
          >
            {isSubmitting ? "Sending..." : "Send Reply 💌"}
          </button>
        </div>
      </div>
    </form>
  );
}
