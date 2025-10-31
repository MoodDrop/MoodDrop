const STORAGE_KEY = "mooddrop_feature_flags";

export type FeatureFlags = {
  enableVoiceNotes: boolean;
  showMoodGardenTab: boolean;
  enableAffirmations: boolean;
  communityEnabled: boolean;
};

export const DEFAULT_FLAGS: FeatureFlags = {
  enableVoiceNotes: true,
  showMoodGardenTab: false,
  enableAffirmations: true,
  communityEnabled: true,
};

export function readFlags(): FeatureFlags {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_FLAGS;
    const parsed = JSON.parse(stored);
    return { ...DEFAULT_FLAGS, ...parsed };
  } catch {
    return DEFAULT_FLAGS;
  }
}

export function writeFlags(flags: FeatureFlags): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
}

export function setFlag(key: keyof FeatureFlags, value: boolean): void {
  const current = readFlags();
  current[key] = value;
  writeFlags(current);
}
