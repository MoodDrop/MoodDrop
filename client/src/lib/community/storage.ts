import type { Drop } from "@/types/community";
import { generateCalmName } from "./calmName";

const VIBE_ID_KEY = "md_vibeId";
const OLD_CALM_NAME_KEY = "md_calmName";
const DROPS_KEY = "md_drops";
const LAST_POST_KEY = "md_lastPostAt";
const MAX_DROPS = 500;

export function getVibeId(): string {
  try {
    // Check for new key first
    let existing = localStorage.getItem(VIBE_ID_KEY);
    
    // Migration: if md_vibeId doesn't exist but md_calmName does, migrate it
    if (!existing) {
      const oldName = localStorage.getItem(OLD_CALM_NAME_KEY);
      if (oldName) {
        localStorage.setItem(VIBE_ID_KEY, oldName);
        existing = oldName;
      }
    }
    
    if (existing) return existing;
    
    // Generate new if neither exists
    const newName = generateCalmName();
    localStorage.setItem(VIBE_ID_KEY, newName);
    return newName;
  } catch {
    return generateCalmName();
  }
}

export function refreshVibeId(): string {
  try {
    const newName = generateCalmName();
    localStorage.setItem(VIBE_ID_KEY, newName);
    return newName;
  } catch {
    return generateCalmName();
  }
}

export function getDrops(): Drop[] {
  try {
    const stored = localStorage.getItem(DROPS_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveDrops(drops: Drop[]): void {
  try {
    const limited = drops.slice(0, MAX_DROPS);
    localStorage.setItem(DROPS_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error("Failed to save drops:", error);
  }
}

export function addDrop(drop: Drop): void {
  const drops = getDrops();
  drops.unshift(drop);
  saveDrops(drops);
}

export function updateDrop(updatedDrop: Drop): void {
  const drops = getDrops();
  const index = drops.findIndex(d => d.id === updatedDrop.id);
  if (index !== -1) {
    drops[index] = updatedDrop;
    saveDrops(drops);
  }
}

export function getLastPostAt(): number | null {
  try {
    const stored = localStorage.getItem(LAST_POST_KEY);
    return stored ? parseInt(stored, 10) : null;
  } catch {
    return null;
  }
}

export function setLastPostAt(timestamp: number): void {
  try {
    localStorage.setItem(LAST_POST_KEY, timestamp.toString());
  } catch (error) {
    console.error("Failed to set last post time:", error);
  }
}
