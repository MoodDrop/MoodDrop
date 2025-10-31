import { formatDistanceToNow } from "date-fns";
import type { Note } from "@/types/note";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="pt-3 border-t border-warm-gray-200">
        <p className="text-sm text-warm-gray-500 text-center py-3">
          No notes yet. Be the first to share a note of calm.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-3 border-t border-warm-gray-200 space-y-3" data-testid="note-list">
      {notes.map((note) => (
        <div 
          key={note.id} 
          className="bg-blue-50/50 rounded-lg p-3 border border-blue-100"
          data-testid={`note-${note.id}`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-medium text-blue-700" data-testid={`note-name-${note.id}`}>
              {note.name}
            </p>
            <p className="text-xs text-blue-600" data-testid={`note-time-${note.id}`}>
              {formatDistanceToNow(note.createdAt, { addSuffix: true })}
            </p>
          </div>
          <p className="text-sm text-warm-gray-700 whitespace-pre-wrap" data-testid={`note-text-${note.id}`}>
            {note.text}
          </p>
        </div>
      ))}
    </div>
  );
}
