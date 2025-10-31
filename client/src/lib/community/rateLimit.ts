const COOLDOWN_MS = 5000; // 5 seconds

export function canPost(now: number, lastPostAt: number | null): boolean {
  if (lastPostAt === null) return true;
  return now - lastPostAt >= COOLDOWN_MS;
}

export function getRemainingCooldown(now: number, lastPostAt: number | null): number {
  if (lastPostAt === null) return 0;
  const elapsed = now - lastPostAt;
  return Math.max(0, COOLDOWN_MS - elapsed);
}
