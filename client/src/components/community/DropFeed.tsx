import type { Drop, ReactionType } from "@/types/community";
import type { Note } from "@/types/note";
import DropCard from "./DropCard";

interface DropFeedProps {
  drops: Drop[];
  vibeId: string;
  notes: Note[];
  onReact: (dropId: string, reactionType: ReactionType) => void;
  onNotePost: (dropId: string, text: string) => void;
}

export default function DropFeed({ drops, vibeId, notes, onReact, onNotePost }: DropFeedProps) {
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
      {drops.map((drop) => {
        const dropNotes = notes.filter(note => note.dropId === drop.id);
        return (
          <DropCard 
            key={drop.id} 
            drop={drop} 
            vibeId={vibeId}
            notes={dropNotes}
            onReact={onReact}
            onNotePost={onNotePost}
          />
        );
      })}
    </div>
  );
}
