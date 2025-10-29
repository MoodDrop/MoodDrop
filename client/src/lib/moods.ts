export type MoodKey = "Calm" | "Grounded" | "Joyful" | "Tender" | "Overwhelmed" | "Frustrated";

export interface MoodData {
  key: MoodKey;
  color: string;
  shape: "circle" | "leaf" | "star" | "heart" | "cloud" | "triangle";
  meaning: string;
  icon: string;
}

export const MOOD_PALETTE: Record<MoodKey, MoodData> = {
  Calm: {
    key: "Calm",
    color: "#A6C8FF",
    shape: "circle",
    meaning: "Peaceful, centered, emotionally balanced.",
    icon: "●"
  },
  Grounded: {
    key: "Grounded",
    color: "#A4C3A2",
    shape: "leaf",
    meaning: "Stable, reflective, grateful.",
    icon: "🍃"
  },
  Joyful: {
    key: "Joyful",
    color: "#FBE694",
    shape: "star",
    meaning: "Happy, excited, hopeful.",
    icon: "★"
  },
  Tender: {
    key: "Tender",
    color: "#F6C1B4",
    shape: "heart",
    meaning: "Loving, affectionate, sensitive.",
    icon: "♥"
  },
  Overwhelmed: {
    key: "Overwhelmed",
    color: "#C9C7D2",
    shape: "cloud",
    meaning: "Tired, unsure, emotionally heavy.",
    icon: "☁"
  },
  Frustrated: {
    key: "Frustrated",
    color: "#E98A7A",
    shape: "triangle",
    meaning: "Irritated, tense, needing release.",
    icon: "▲"
  }
};

export const moods = MOOD_PALETTE;
export const MOODS_ARRAY: MoodData[] = Object.values(MOOD_PALETTE);

export function getMoodColor(emotion?: string, savedColor?: string): string {
  if (savedColor) return savedColor;
  if (!emotion) return "#94a3b8";
  
  const moodData = MOOD_PALETTE[emotion as MoodKey];
  return moodData?.color ?? "#94a3b8";
}
