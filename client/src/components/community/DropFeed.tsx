import type { Drop, ReactionType } from "@/types/community";
import DropCard from "./DropCard";

interface DropFeedProps {
  drops: Drop[];
  onReact: (dropId: string, reactionType: ReactionType) => void;
}

export default function DropFeed({ drops, onReact }: DropFeedProps) {
  if (drops.length === 0) {
    return (
      <div className="text-center py-16" data-testid="empty-state">
        <p className="text-2xl mb-2">💧</p>
        <p className="text-warm-gray-600">
          Be the first to share a drop today 💧
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="drop-feed">
      {drops.map((drop) => (
        <DropCard key={drop.id} drop={drop} onReact={onReact} />
      ))}
    </div>
  );
}
