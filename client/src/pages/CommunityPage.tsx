// client/src/pages/CommunityPage.tsx

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DropComposer from "@/components/community/DropComposer";
import DropFeed from "@/components/community/DropFeed";
import type { Drop } from "@/types/community";
import {
  getVibeId,
  refreshVibeId,
  setCustomVibeId,
} from "@/lib/community/storage";
import { supabase } from "../lib/supabaseClient";
import {
  enableOwnerModeFromURL,
  isOwnerMode,
  getPostVibeId,
  OWNER_VIBE_ID,
} from "../lib/community/ownerMode";

export default function CommunityPage() {
  const [vibeId, setVibeId] = useState("");
  const [vibeInput, setVibeInput] = useState("");
  const [drops, setDrops] = useState<Drop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load drops from Supabase
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

    const stored = getVibeId();
    setVibeId(stored);
    setVibeInput(stored);

    loadDrops();
  }, []);

  const ownerActive = isOwnerMode();
  const postVibeId = getPostVibeId(vibeId);

  const handleRefreshVibeId = () => {
    const next = refreshVibeId();
    setVibeId(next);
    setVibeInput(next);
    toast({
      title: "Vibe ID refreshed",
      description: `You are now ${next}`,
    });
  };

  const handleSaveCustomVibeId = () => {
    const trimmed = vibeInput.trim();

    if (!trimmed) {
      toast({
        title: "Vibe ID can't be empty",
        description: "Type something soft and unique to you.",
        variant: "destructive",
      });
      setVibeInput(vibeId);
      return;
    }

    const saved = setCustomVibeId(trimmed);
    setVibeId(saved);

    toast({
      title: "Vibe ID updated",
      description: `You're now ${saved}`,
    });
  };

  const handlePost = async () => await loadDrops();

  const handleReply = async () => await loadDrops();

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

      setDrops((prev) =>
        prev.map((d) => (d.id === dropId ? { ...d, reactions: newCount } : d)),
      );
    } catch (err) {
      console.error("Reaction error:", err);
    }
  };

  const handleCardUpdated = (updated: Drop) => {
    setDrops((prev) =>
      prev.map((d) => (d.id === updated.id ? { ...d, ...updated } : d)),
    );
  };

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
        <div className="mb-4 rounded-lg border border-blush-200 bg-blush-50 px-4 py-3 text-blush-700">
          Replying as{" "}
          <strong className="text-blush-700">{OWNER_VIBE_ID}</strong>. Add{" "}
          <code className="text-blush-600">?owner=0</code> to turn off.
        </div>
      )}

      <div className="mb-8 p-4 bg-blush-50 rounded-xl border border-blush-200">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-blush-600 mb-1">Your Vibe ID</p>
            <p
              className="font-semibold text-blush-700"
              data-testid="text-vibe-id"
            >
              {postVibeId}
            </p>
            <p className="text-xs text-warm-gray-600 mt-1">
              Make it yours — this name shows up when you share or reply 🫶
            </p>
          </div>

          <button
            onClick={handleRefreshVibeId}
            className="flex items-center gap-2 px-3 py-2 text-sm text-blush-700 hover:bg-blush-200 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-blush-600" />
            <span>Refresh</span>
          </button>
        </div>

        {!ownerActive && (
          <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:items-center">
            <input
              className="flex-1 rounded-lg border border-blush-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blush-200"
              placeholder="Pick your Vibe ID (e.g., SoftGlow22)"
              value={vibeInput}
              onChange={(e) => setVibeInput(e.target.value)}
              maxLength={40}
            />
            <button
              onClick={handleSaveCustomVibeId}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blush-600 text-white hover:bg-blush-700 transition-colors"
            >
              Save Vibe ID
            </button>
          </div>
        )}
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
          onUpdated={handleCardUpdated}
          onDeleted={handleCardDeleted}
        />
      )}
    </div>
  );
}
