import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DropComposer from "@/components/community/DropComposer";
import DropFeed from "@/components/community/DropFeed";
import type { Drop, ReactionType } from "@/types/community";
import type { Note } from "@/types/note";
import { 
  getVibeId, 
  refreshVibeId, 
  getDrops, 
  addDrop, 
  updateDrop,
  getLastPostAt,
  setLastPostAt
} from "@/lib/community/storage";
import { 
  getNotes, 
  addNote, 
  getLastNoteAt, 
  setLastNoteAt 
} from "@/lib/community/noteStorage";
import { canPost, getRemainingCooldown, NOTE_COOLDOWN_MS } from "@/lib/community/rateLimit";

export default function CommunityPage() {
  const [vibeId, setVibeId] = useState<string>("");
  const [drops, setDrops] = useState<Drop[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load vibe ID, drops, and notes on mount
    setVibeId(getVibeId());
    setDrops(getDrops());
    setNotes(getNotes());
  }, []);

  const handleRefreshVibeId = () => {
    const newId = refreshVibeId();
    setVibeId(newId);
    toast({
      title: "Vibe ID refreshed",
      description: `You are now ${newId}`,
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
      name: vibeId,
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

  const handleNotePost = (dropId: string, text: string) => {
    const now = Date.now();
    const lastNoteAt = getLastNoteAt();

    if (!canPost(now, lastNoteAt, NOTE_COOLDOWN_MS)) {
      const remaining = getRemainingCooldown(now, lastNoteAt, NOTE_COOLDOWN_MS);
      const seconds = Math.ceil(remaining / 1000);
      toast({
        title: "Please wait",
        description: `You can post another note in ${seconds} second${seconds !== 1 ? 's' : ''}.`,
        variant: "destructive",
      });
      return;
    }

    const newNote: Note = {
      id: `${now}-${Math.random().toString(36).substr(2, 9)}`,
      dropId,
      name: vibeId,
      text,
      createdAt: now,
    };

    addNote(newNote);
    setNotes([newNote, ...notes]);
    setLastNoteAt(now);

    toast({
      title: "Note added",
      description: "Your note of calm has been shared.",
    });
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
        notes={notes}
        onReact={handleReact}
        onNotePost={handleNotePost}
      />

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-warm-gray-500">
        <p>Always anonymous. Always kind.</p>
      </div>
    </div>
  );
}
