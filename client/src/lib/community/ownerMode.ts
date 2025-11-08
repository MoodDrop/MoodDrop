// client/src/lib/community/ownerMode.ts

// 👑 Your “official” reply identity
export const OWNER_VIBE_ID = "Charae 💧";

// where we persist the toggle locally
const LS_KEY = "md_owner_mode";

/**
 * Enable/disable Owner Mode based on URL:
 *   ?owner=1  or  ?owner=true   → ON
 *   ?owner=0  or  ?owner=off    → OFF
 *
 * Call this once on page load (we do it in CommunityPage useEffect).
 */
export function enableOwnerModeFromURL(): void {
  // guard: window only exists in the browser, not during SSR/build
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const ownerParam = params.get("owner");

  if (ownerParam === null) return;

  const val = ownerParam.toLowerCase();
  if (val === "1" || val === "true" || val === "on") {
    localStorage.setItem(LS_KEY, "1");
  } else if (val === "0" || val === "false" || val === "off") {
    localStorage.removeItem(LS_KEY);
  }
}

/** Is Owner Mode currently active? */
export function isOwnerMode(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(LS_KEY) === "1";
}

/**
 * Given the current user’s vibeId, return the one to POST with.
 * If Owner Mode is on, we override with OWNER_VIBE_ID.
 */
export function getPostVibeId(currentVibeId: string): string {
  return isOwnerMode() ? OWNER_VIBE_ID : currentVibeId;
}
