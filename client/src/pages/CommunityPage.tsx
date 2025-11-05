import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DropComposer from "@/components/community/DropComposer";
import DropFeed from "@/components/community/DropFeed";
import type { Drop, ReactionType } from "@/types/community";

// keep your vibe-id helpers ONLY
import { getVibeId, refreshVibeId } from "@/lib/community/storage";

// ✅ Supabase
import { supabase } from "@/lib/supabaseClient";

export default function CommunityPage() {
  const [vibeId, setVibeId] = useState("");
  const [drops, setDrops] = useState<Drop[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const { toast } = useToast();

  // ---- Fetch from Supabase (not localStorage) ----
  const loadDrops = async () => {
    const { data, error } = await supabase
      .from("Drops") // table name (capital D)
      .select("*")
      .order("created_at", { ascending: false });

    console.log("Supabase feed:", {
      error,
      count: data?.length,
      sample: data?.[0],
    });

    if (error) {
      console.error(error);
      toast({
        title: "Couldn't load feed",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
      return;
    }

    // map DB rows -> UI type
    const mapped: Drop[] = (data ?? []).map((row: any) => ({
      id: row.id, // uuid in DB
      name: row.vibe_id ?? "Anon",
      text: row.text ?? "",
      mood: row.mood ?? undefined,
      reactions: { calm: 0, feel: 0 }, // (phase 2 we’ll store these)
      createdAt: row.created_at
        ? new Date(row.created_at).getTime()
        : Date.now(),
    }));

    setDrops(mapped);
  };

  useEffect(() => {
    setVibeId(getVibeId());
    loadDrops();
  }, []);

  const handleRefreshVibeId = () => {
    const next = refreshVibeId();
    setVibeId(next);
    toast({ title: "Vibe ID refreshed", description: `You are now ${next}` });
  };

  // This keeps the UI snappy after composer inserts to Supabase.
  // (Composer still calls onPost(text, mood) after a successful insert.)
  const handlePost = (text: string, mood?: string) => {
    setIsPosting(true);

    // add an optimistic item (will be replaced when we refetch)
    const now = Date.now();
    const optimistic: Drop = {
      id: `tmp-${now}`,
      name: vibeId,
      text,
      mood,
      reactions: { calm: 0, feel: 0 },
      createdAt: now,
    };
    setDrops((d) => [optimistic, ...d]);

    // fetch fresh list from Supabase
    loadDrops().finally(() => setIsPosting(false));
  };

  // Reactions still local for now (phase 2 we’ll store in Supabase)
  const handleReact = (dropId: string, type: ReactionType) => {
    setDrops((prev) =>
      prev.map((d) =>
        d.id === dropId
          ? {
              ...d,
              reactions: { ...d.reactions, [type]: d.reactions[type] + 1 },
            }
          : d,
      ),
    );
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
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
            title="Refresh Vibe ID"
            data-testid="button-refresh-vibe-id"
          >
            <RefreshCw className="w-5 h-5 text-blue-600" />
          </button>
        </div>
      </div>

      {/* Composer */}
      <div className="mb-8 p-6 bg-white rounded-2xl border border-warm-gray-200 shadow-sm">
        <DropComposer
          calmName={vibeId}
          onPost={handlePost}
          disabled={isPosting}
        />
      </div>

      {/* Feed */}
      <DropFeed
        drops={drops}
        vibeId={vibeId}
        notes={[]}
        onReact={handleReact}
        onNotePost={() => {}}
      />

      <div className="mt-12 text-center text-sm text-warm-gray-500">
        <p>Always anonymous. Always kind.</p>
      </div>
    </div>
  );
}
