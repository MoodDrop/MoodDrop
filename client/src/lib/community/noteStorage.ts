import type { Note } from "@/types/note";

const NOTES_KEY = "md_notes";
const LAST_NOTE_KEY = "md_lastNoteAt";

export function getNotes(): Note[] {
  try {
    const stored = localStorage.getItem(NOTES_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveNotes(notes: Note[]): void {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error("Failed to save notes:", error);
  }
}

export function addNote(note: Note): void {
  const notes = getNotes();
  notes.unshift(note);
  saveNotes(notes);
}

export function getNotesForDrop(dropId: string): Note[] {
  const notes = getNotes();
  return notes.filter(note => note.dropId === dropId);
}

export function getLastNoteAt(): number | null {
  try {
    const stored = localStorage.getItem(LAST_NOTE_KEY);
    return stored ? parseInt(stored, 10) : null;
  } catch {
    return null;
  }
}

export function setLastNoteAt(timestamp: number): void {
  try {
    localStorage.setItem(LAST_NOTE_KEY, timestamp.toString());
  } catch (error) {
    console.error("Failed to set last note time:", error);
  }
}
