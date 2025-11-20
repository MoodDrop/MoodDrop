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

import { supabase } from "@/lib/supabaseClient";
import {
  enableOwnerModeFromURL,
  isOwnerMode,
  getPostVibeId,
  OWNER_VIBE_ID,
} from "@/lib/community/ownerMode";

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
          "id, text, mood, created_at, vibe_id, reply_to, visible, reactions"
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

      // Nest replies under parents
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
      title: "Vibe ID saved ✅",
      description: `You're now ${saved}`,
    });
  };

  const handleCancelVibeId = () => {
    setVibeInput(vibeId);
  };

  // Disable Save when nothing changed or input is empty
  const isSaveDisabled =
    !vibeInput.trim() || vibeInput.trim() === vibeId || ownerActive;

  // After composer posts, reload feed
  const handlePost = async () => await loadDrops();

  // When a reply is added, reload feed
  const handleReply = async () => await loadDrops();

  // Increment reactions (“I Feel This”)
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

      // Local optimistic update
      setDrops((prev) =>
        prev.map((d) => (d.id === dropId ? { ...d, reactions: newCount } : d))
      );
    } catch (err) {
      console.error("Reaction error:", err);
    }
  };

  // DropCard → update local list (no full reload)
  const handleCardUpdated = (updated: Drop) => {
    setDrops((prev) =>
      prev.map((d) => (d.id === updated.id ? { ...d, ...updated } : d))
    );
  };

  // DropCard → remove locally (no full reload)
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
        <div className="mb-4 rounded-lg border border-blush-200 bg-blush-50 px-4 py-3 text-blush-700 text-sm">
          Replying as{" "}
          <strong className="text-blush-700">{OWNER_VIBE_ID}</strong>. Add{" "}
          <code className="text-blush-600">?owner=0</code> to turn off.
        </div>
      )}

      {/* Vibe ID card */}
      <div className="mb-8 rounded-xl border border-[#F8D8DD] bg-[#FDF2F3] px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Left text section */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#C27A84] mb-1">
              Your Vibe ID
            </p>
            <p
              className="font-semibold text-warm-gray-900 text-base"
              data-testid="text-vibe-id"
            >
              {postVibeId}
            </p>
            <p className="mt-1 text-xs text-warm-gray-600 max-w-md">
              Make it yours — this name shows up when you share or reply 🫶
            </p>
          </div>

          {/* Right: input + buttons */}
          {!ownerActive && (
            <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:max-w-xs">
              <input
                className="w-full rounded-lg border border-[#F3C6CF] bg-white px-3 py-2 text-sm text-warm-gray-900 placeholder:text-warm-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F1AEB8]"
                placeholder="Pick your Vibe ID (e.g., SoftGlow22)"
                value={vibeInput}
                onChange={(e) => setVibeInput(e.target.value)}
                maxLength={40}
              />

              <div className="flex gap-2">
                <button
                  onClick={handleSaveCustomVibeId}
                  disabled={isSaveDisabled}
                  className="flex-1 inline-flex items-center justify-center
                             rounded-lg border border-[#F3C6CF] bg-white
                             px-3 py-2 text-xs font-semibold text-warm-gray-900
                             shadow-sm hover:bg-[#FFF7F9] hover:border-[#F1AEB8]
                             focus:outline-none focus:ring-2 focus:ring-[#F1AEB8]
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-colors"
                >
                  Save Vibe ID
                </button>

                <button
                  type="button"
                  onClick={handleCancelVibeId}
                  className="inline-flex items-center justify-center
                             rounded-lg border border-transparent
                             px-3 py-2 text-xs font-medium text-warm-gray-600
                             hover:bg-[#FDF0F2] transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleRefreshVibeId}
                  className="inline-flex items-center justify-center gap-1
                             rounded-lg border border-[#F3C6CF] bg-white
                             px-3 py-2 text-xs font-medium text-warm-gray-800
                             hover:bg-[#FDF0F2] transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          )}

          {ownerActive && (
            <button
              onClick={handleRefreshVibeId}
              className="mt-2 inline-flex items-center justify-center gap-1 rounded-lg border border-[#F3C6CF] bg-white px-3 py-2 text-xs font-medium text-warm-gray-800 hover:bg-[#FDF0F2] transition-colors sm:mt-0"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh</span>
            </button>
          )}
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
          onUpdated={handleCardUpdated}
          onDeleted={handleCardDeleted}
        />
      )}
    </div>
  );
}
