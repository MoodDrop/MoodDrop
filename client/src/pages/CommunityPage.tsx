import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DropComposer from "@/components/community/DropComposer";
import DropFeed from "@/components/community/DropFeed";
import type { Drop } from "@/types/community";
import { getVibeId, refreshVibeId } from "@/lib/community/storage";
import { supabase } from "../lib/supabaseClient";

export default function CommunityPage() {
  const [vibeId, setVibeId] = useState("");
  const [drops, setDrops] = useState<Drop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load drops from Supabase
  const loadDrops = async () => {
    try {
      const { data, error } = await supabase
        .from("Drops")
        // ✅ alias syntax: alias:column (NOT "text as content")
        .select(
          "id, content:text, mood, created_at, vibe_id, reply_to, visible, reactions",
        )
        .eq("visible", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading drops:", error);
        toast({
          title: "Couldn't load drops",
          description: "Please try again in a moment.",
          variant: "destructive",
        });
        return;
      }

      console.log("[MoodDrop] drops OK:", data);

      // Map database rows to UI type
      const allDrops: Drop[] = (data ?? []).map((row: any) => ({
        id: row.id,
        vibeId: row.vibe_id,
        text: row.content, // ← now populated via content:text
        mood: row.mood,
        replyTo: row.reply_to,
        reactions: row.reactions ?? 0, // keep if your type expects it
        createdAt: new Date(row.created_at).getTime(),
        replies: [],
      }));

      // Nest replies (if any are included as top-level rows)
      const topLevelDrops = allDrops.filter((d) => !d.replyTo);
      const replyDrops = allDrops.filter((d) => d.replyTo);

      topLevelDrops.forEach((drop) => {
        drop.replies = replyDrops.filter((r) => r.replyTo === drop.id);
      });

      setDrops(topLevelDrops);
    } catch (err) {
      console.error("Error in loadDrops:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setVibeId(getVibeId());
    loadDrops();
  }, []);

  const handleRefreshVibeId = () => {
    const next = refreshVibeId();
    setVibeId(next);
    toast({
      title: "Vibe ID refreshed",
      description: `You are now ${next}`,
    });
  };

  const handlePost = async (text: string, mood?: string) => {
    await loadDrops();
  };

  const handleReply = async (parentId: string, text: string) => {
    await loadDrops();
  };

  // You said we'll revisit reactions later — leaving this as-is so UI doesn't break
  const handleReaction = async (dropId: string) => {
    try {
      const { data: currentDrop, error: fetchError } = await supabase
        .from("Drops")
        .select("reactions")
        .eq("id", dropId)
        .single();

      if (fetchError) throw fetchError;

      const newCount = (currentDrop?.reactions || 0) + 1;
      const { error: updateError } = await supabase
        .from("Drops")
        .update({ reactions: newCount })
        .eq("id", dropId);

      if (updateError) throw updateError;

      setDrops((prev) =>
        prev.map((drop) =>
          drop.id === dropId ? { ...drop, reactions: newCount } : drop,
        ),
      );

      toast({
        title: "🌸",
        description: "You feel this vibe",
      });
    } catch (err) {
      console.error("Error in handleReaction:", err);
      toast({
        title: "Couldn't react",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-warm-gray-800 mb-2">
          The Collective Drop
        </h1>
        <p className="text-gray-600">
          A gentle community of shared vibes — where people express, connect,
          and uplift each other anonymously.
        </p>
      </div>

      {/* Vibe ID */}
      <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 mb-1">Your Vibe ID</p>
            <p className="font-medium text-blue-800" data-testid="text-vibe-id">
              {vibeId}
            </p>
          </div>
          <button
            onClick={handleRefreshVibeId}
            className="flex items-center gap-2 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
            data-testid="button-refresh-vibe-id"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Composer */}
      <DropComposer vibeId={vibeId} onPost={handlePost} />

      {/* Feed */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading drops...</div>
      ) : (
        <DropFeed
          drops={drops}
          currentVibeId={vibeId}
          onReply={handleReply}
          onReaction={handleReaction}
        />
      )}
    </div>
  );
}
