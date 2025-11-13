import { isOwnerMode, OWNER_VIBE_ID } from "@/lib/community/ownerMode";

/**
 * Determines if the current viewer can manage (edit/delete) a drop.
 * True if:
 * - They authored the drop (their vibe matches the drop's vibe)
 * - Owner Mode is active (?owner=1)
 * - They are the official owner (Charae 💧)
 */
export function canManageDrop({
  currentVibeId,
  dropVibeId,
}: {
  currentVibeId: string | null | undefined;
  dropVibeId: string;
}): boolean {
  if (!currentVibeId) return false;

  return (
    currentVibeId === dropVibeId ||
    isOwnerMode() ||
    currentVibeId === OWNER_VIBE_ID
  );
}
