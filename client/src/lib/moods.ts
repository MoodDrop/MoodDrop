// client/src/lib/moods.ts

export type MoodKey =
  | "Calm"
  | "Grounded"
  | "Joyful"
  | "Tense"
  | "Overwhelmed"
  | "CrashOut";

export interface MoodData {
  key: MoodKey;
  color: string;
  shape: "circle" | "leaf" | "star" | "heart" | "cloud";
  meaning: string;
  icon: string;
}

export const MOOD_PALETTE: Record<MoodKey, MoodData> = {
  Calm: {
    key: "Calm",
    color: "#F8EEDC", // soft blue
    shape: "circle",
    meaning: "Peaceful, centered, emotionally balanced.",
    icon: "●",
  },
  Grounded: {
    key: "Grounded",
    color: "#DCEAD9", // soft green
    shape: "leaf",
    meaning: "Stable, reflective, grateful.",
    icon: "🍃",
  },
  Joyful: {
    key: "Joyful",
    color: "#FBD2A8", // soft yellow
    shape: "star",
    meaning: "Happy, excited, hopeful.",
    icon: "★",
  },

  // ✅ Added mood: Tense
  Tense: {
    key: "Tense",
    color: "#FBEFB0", // soft buttery yellow (matches your homepage Tense circle)
    shape: "cloud",
    meaning: "Restless, tight-chested, overthinking, mentally 'on.'",
    icon: "〰",
  },

  Overwhelmed: {
    key: "Overwhelmed",
    color: "#E7B6A9", // gentle gray/lavender
    shape: "cloud",
    meaning: "Tired, unsure, emotionally heavy.",
    icon: "☁",
  },
  CrashOut: {
    key: "CrashOut",
    color: "#F0A25A", // soft purple for the “crash out” mood
    shape: "heart",
    meaning: "Exhausted, emotionally done, ready to crash.",
    icon: "♥",
  },
};

export const moods = MOOD_PALETTE;
export const MOODS_ARRAY: MoodData[] = Object.values(MOOD_PALETTE);

export function getMoodColor(emotion?: string, savedColor?: string): string {
  if (savedColor) return savedColor;
  if (!emotion) return "#94a3b8";

  const moodData = MOOD_PALETTE[emotion as MoodKey];
  return moodData?.color ?? "#94a3b8";
}
