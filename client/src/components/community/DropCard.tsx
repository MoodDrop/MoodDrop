import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import type { Drop, ReactionType } from "@/types/community";
import type { Note } from "@/types/note";
import NoteComposer from "./NoteComposer";
import NoteList from "./NoteList";

interface DropCardProps {
  drop: Drop;
  vibeId: string;
  notes: Note[];
  onReact: (dropId: string, reactionType: ReactionType) => void;
  onNotePost: (dropId: string, text: string) => void;
}

export default function DropCard({ drop, vibeId, notes, onReact, onNotePost }: DropCardProps) {
  const [showNoteComposer, setShowNoteComposer] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const timeAgo = formatDistanceToNow(drop.createdAt, { addSuffix: true });
  const noteCount = notes.length;

  return (
    <div 
      className="rounded-2xl border border-warm-gray-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
      data-testid={`drop-card-${drop.id}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        {drop.mood && (
          <span className="text-2xl" aria-label="mood">
            {drop.mood}
          </span>
        )}
        <div className="flex-1">
          <p className="font-medium text-warm-gray-700" data-testid={`drop-name-${drop.id}`}>
            {drop.name}
          </p>
          <p className="text-xs text-warm-gray-500" data-testid={`drop-time-${drop.id}`}>
            {timeAgo}
          </p>
        </div>
      </div>

      {/* Message */}
      <p className="text-warm-gray-800 leading-relaxed mb-4" data-testid={`drop-text-${drop.id}`}>
        {drop.text}
      </p>

      {/* Reactions */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => onReact(drop.id, "calm")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm transition-colors min-h-[44px]"
          data-testid={`react-calm-${drop.id}`}
        >
          <span>💧</span>
          <span className="font-medium">{drop.reactions.calm}</span>
          <span className="hidden sm:inline">Send Calm</span>
        </button>
        <button
          onClick={() => onReact(drop.id, "feel")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 text-sm transition-colors min-h-[44px]"
          data-testid={`react-feel-${drop.id}`}
        >
          <span>🌷</span>
          <span className="font-medium">{drop.reactions.feel}</span>
          <span className="hidden sm:inline">I Feel This</span>
        </button>
        <button
          onClick={() => setShowNoteComposer(!showNoteComposer)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-600 text-sm transition-colors min-h-[44px]"
          data-testid={`button-leave-note-${drop.id}`}
        >
          <span>💌</span>
          <span className="hidden sm:inline">Leave a Note</span>
        </button>
        {noteCount > 0 && (
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warm-gray-100 hover:bg-warm-gray-200 text-warm-gray-700 text-sm transition-colors min-h-[44px]"
            data-testid={`button-view-notes-${drop.id}`}
          >
            <span>💬</span>
            <span className="font-medium">{noteCount}</span>
            <span className="hidden sm:inline">Notes</span>
          </button>
        )}
      </div>

      {/* Note Composer */}
      {showNoteComposer && (
        <NoteComposer
          vibeId={vibeId}
          onPost={(text) => {
            onNotePost(drop.id, text);
            setShowNoteComposer(false);
          }}
        />
      )}

      {/* Notes List */}
      {showNotes && <NoteList notes={notes} />}
    </div>
  );
}
