import type { Drop } from "@/types/community";
import DropCard from "./DropCard";

interface DropFeedProps {
  drops: Drop[];
  currentVibeId: string;
  onReply: (parentId: string, text: string) => void;
}

export default function DropFeed({ drops, currentVibeId, onReply }: DropFeedProps) {
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
        <DropCard 
          key={drop.id} 
          drop={drop} 
          currentVibeId={currentVibeId}
          onReply={onReply}
        />
      ))}
    </div>
  );
}
