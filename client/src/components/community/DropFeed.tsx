// client/src/components/community/DropFeed.tsx

import type { Drop } from "@/types/community";
import DropCard from "./DropCard";

type Props = {
  drops: Drop[];
  currentVibeId: string;
  onReply: (id: string, text: string) => void;
  onReaction: (id: string) => void;
  // NEW: parent will pass these so the list updates instantly
  onUpdated: (updated: Drop) => void;
  onDeleted: (deletedId: string) => void;
};

export default function DropFeed({
  drops,
  currentVibeId,
  onReply,
  onReaction,
  onUpdated,
  onDeleted,
}: Props) {
  if (!drops?.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        No drops yet. Be the first to share 💧
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {drops.map((drop) => (
        <DropCard
          key={drop.id}
          drop={drop}
          currentVibeId={currentVibeId}
          onReply={onReply}
          onReaction={onReaction}
          onUpdated={onUpdated}
          onDeleted={onDeleted}
        />
      ))}
    </div>
  );
}
