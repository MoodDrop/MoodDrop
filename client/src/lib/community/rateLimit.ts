const DROP_COOLDOWN_MS = 5000; // 5 seconds
const NOTE_COOLDOWN_MS = 3000; // 3 seconds

export function canPost(now: number, lastPostAt: number | null, cooldownMs: number = DROP_COOLDOWN_MS): boolean {
  if (lastPostAt === null) return true;
  return now - lastPostAt >= cooldownMs;
}

export function getRemainingCooldown(now: number, lastPostAt: number | null, cooldownMs: number = DROP_COOLDOWN_MS): number {
  if (lastPostAt === null) return 0;
  const elapsed = now - lastPostAt;
  return Math.max(0, cooldownMs - elapsed);
}

export { DROP_COOLDOWN_MS, NOTE_COOLDOWN_MS };
