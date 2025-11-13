// client/src/pages/CommunityPage.tsx

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DropComposer from "@/components/community/DropComposer";
import DropFeed from "@/components/community/DropFeed";
import type { Drop } from "@/types/community";
import { getVibeId, refreshVibeId } from "@/lib/community/storage";
import { supabase } from "../lib/supabaseClient";
import {
  enableOwnerModeFromURL,
  isOwnerMode,
  getPostVibeId,
  OWNER_VIBE_ID,
} from "../lib/community/ownerMode";

export default function CommunityPage() {
  const [vibeId, setVibeId] = useState("");
  const [drops, setDrops] = useState<Drop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load drops from the lowercase view `drops`
  const loadDrops = async () => {
    console.log("[MoodDrop] loadDrops() called — fetching from Supabase...");
    try {
      const { data, error } = await supabase
        .from("drops")
        .select(
          "id, text, mood, created_at, vibe_id, reply_to, visible, reactions",
        )
        .eq("visible", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        toast({
          title: "Couldn't load drops",
          description: "Please try again in a moment.",
          variant: "destructive",
        });
        return;
      }

      // map rows to your Drop type
      const allDrops: Drop[] = (data ?? []).map((row: any) => ({
        id: row.id,
        vibeId: row.vibe_id,
        text: row.text,
        mood: row.mood,
        replyTo: row.reply_to,
        reactions: row.reactions || 0,
        createdAt: new Date(row.created_at).getTime(),
        replies: [],
      }));

      // nest replies under parents
      const topLevelDrops = allDrops.filter((d) => !d.replyTo);
      const replyDrops = allDrops.filter((d) => d.replyTo);
      topLevelDrops.forEach((drop) => {
        drop.replies = replyDrops.filter((r) => r.replyTo === drop.id);
      });

      setDrops(topLevelDrops);
    } catch (err) {
      console.error("loadDrops() failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    enableOwnerModeFromURL();
    setVibeId(getVibeId());
    loadDrops();
  }, []);

  const ownerActive = isOwnerMode();
  const postVibeId = getPostVibeId(vibeId);

  const handleRefreshVibeId = () => {
    const next = refreshVibeId();
    setVibeId(next);
    toast({ title: "Vibe ID refreshed", description: `You are now ${next}` });
  };

  // after composer posts, reload feed
  const handlePost = async () => await loadDrops();

  // when a reply is added (your DropComposer/onReply handler should call this)
  const handleReply = async () => await loadDrops();

  // increment reactions (“I Feel This”)
  const handleReaction = async (dropId: string) => {
    try {
      const { data: currentDrop, error } = await supabase
        .from("drops")
        .select("reactions")
        .eq("id", dropId)
        .single();
      if (error) throw error;

      const newCount = (currentDrop?.reactions || 0) + 1;

      const { error: updateError } = await supabase
        .from("drops")
        .update({ reactions: newCount })
        .eq("id", dropId);
      if (updateError) throw updateError;

      // local optimistic update
      setDrops((prev) =>
        prev.map((d) => (d.id === dropId ? { ...d, reactions: newCount } : d)),
      );
    } catch (err) {
      console.error("Reaction error:", err);
    }
  };

  // NEW: wire DropCard onUpdated → update local list (no full reload)
  const handleCardUpdated = (updated: Drop) => {
    setDrops((prev) =>
      prev.map((d) => (d.id === updated.id ? { ...d, ...updated } : d)),
    );
  };

  // NEW: wire DropCard onDeleted → remove locally (no full reload)
  const handleCardDeleted = (deletedId: string) => {
    setDrops((prev) => prev.filter((d) => d.id !== deletedId));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-warm-gray-800 mb-2">
          The Collective Drop
        </h1>
        <p className="text-gray-600">
          A gentle community of shared vibes — where people express, connect,
          and uplift each other anonymously.
        </p>
      </div>

      {ownerActive && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-blue-800">
          Replying as <strong>{OWNER_VIBE_ID}</strong>. Add{" "}
          <code>?owner=0</code> to the URL to turn off.
        </div>
      )}

      <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 mb-1">Your Vibe ID</p>
            <p className="font-medium text-blue-800" data-testid="text-vibe-id">
              {postVibeId}
            </p>
          </div>
          <button
            onClick={handleRefreshVibeId}
            className="flex items-center gap-2 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <DropComposer vibeId={postVibeId} onPost={handlePost} />

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading drops...</div>
      ) : (
        <DropFeed
          drops={drops}
          currentVibeId={postVibeId}
          onReply={handleReply}
          onReaction={handleReaction}
          // NEW: make list respond instantly to edits/deletes
          onUpdated={handleCardUpdated}
          onDeleted={handleCardDeleted}
        />
      )}
    </div>
  );
}
