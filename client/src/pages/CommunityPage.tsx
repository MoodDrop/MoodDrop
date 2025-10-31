import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DropComposer from "@/components/community/DropComposer";
import DropFeed from "@/components/community/DropFeed";
import type { Drop, ReactionType } from "@/types/community";
import { 
  getCalmName, 
  refreshCalmName, 
  getDrops, 
  addDrop, 
  updateDrop,
  getLastPostAt,
  setLastPostAt
} from "@/lib/community/storage";
import { canPost, getRemainingCooldown } from "@/lib/community/rateLimit";

export default function CommunityPage() {
  const [calmName, setCalmName] = useState<string>("");
  const [drops, setDrops] = useState<Drop[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load calm name and drops on mount
    setCalmName(getCalmName());
    setDrops(getDrops());
  }, []);

  const handleRefreshName = () => {
    const newName = refreshCalmName();
    setCalmName(newName);
    toast({
      title: "Name refreshed",
      description: `You are now ${newName}`,
    });
  };

  const handlePost = (text: string, mood?: string) => {
    const now = Date.now();
    const lastPostAt = getLastPostAt();

    if (!canPost(now, lastPostAt)) {
      const remaining = getRemainingCooldown(now, lastPostAt);
      const seconds = Math.ceil(remaining / 1000);
      toast({
        title: "Please wait",
        description: `You can post again in ${seconds} second${seconds !== 1 ? 's' : ''}.`,
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);

    const newDrop: Drop = {
      id: `${now}-${Math.random().toString(36).substr(2, 9)}`,
      name: calmName,
      text,
      mood,
      reactions: { calm: 0, feel: 0 },
      createdAt: now,
    };

    // Add to state and localStorage
    addDrop(newDrop);
    setDrops([newDrop, ...drops]);
    setLastPostAt(now);

    toast({
      title: "Drop shared",
      description: "Your drop has been added to the collective.",
    });

    setIsPosting(false);
  };

  const handleReact = (dropId: string, reactionType: ReactionType) => {
    const drop = drops.find(d => d.id === dropId);
    if (!drop) return;

    const updatedDrop: Drop = {
      ...drop,
      reactions: {
        ...drop.reactions,
        [reactionType]: drop.reactions[reactionType] + 1,
      },
    };

    updateDrop(updatedDrop);
    setDrops(drops.map(d => d.id === dropId ? updatedDrop : d));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-warm-gray-800 mb-2">
          The Collective Drop
        </h1>
        <p className="text-warm-gray-600">
          Anonymously express, reflect, and uplift.
        </p>
      </div>

      {/* Calm Name */}
      <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 mb-1">Your Calm Name</p>
            <p className="font-medium text-blue-800" data-testid="text-calm-name">
              {calmName}
            </p>
          </div>
          <button
            onClick={handleRefreshName}
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
            title="Refresh name"
            data-testid="button-refresh-name"
          >
            <RefreshCw className="w-5 h-5 text-blue-600" />
          </button>
        </div>
      </div>

      {/* Composer */}
      <div className="mb-8 p-6 bg-white rounded-2xl border border-warm-gray-200 shadow-sm">
        <DropComposer 
          calmName={calmName}
          onPost={handlePost}
          disabled={isPosting}
        />
      </div>

      {/* Feed */}
      <DropFeed drops={drops} onReact={handleReact} />

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-warm-gray-500">
        <p>Always anonymous. Always kind.</p>
      </div>
    </div>
  );
}
