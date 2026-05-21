// client/src/lib/moods.ts

export type MoodKey =
  | "Calm"
  | "Grounded"
  | "Joy"
  | "Hopeful"
  | "Relieved"
  | "Reflective"
  | "Lonely"
  | "Numb"
  | "Upset"
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
    color: "#F8EEDC", // soft cream
    shape: "circle",
    meaning: "Peaceful, centered, emotionally balanced.",
    icon: "●",
  },

  Grounded: {
    key: "Grounded",
    color: "#DCEAD9", // soft sage green
    shape: "leaf",
    meaning: "Stable, reflective, grateful.",
    icon: "🍃",
  },

  Joy: {
    key: "Joy",
    color: "#FBD2A8", // warm peachy gold
    shape: "star",
    meaning: "Happy, lighthearted, emotionally uplifted.",
    icon: "★",
  },

  Hopeful: {
    key: "Hopeful",
    color: "#DCE8C8", // soft muted green
    shape: "leaf",
    meaning: "Looking forward with optimism, even gently.",
    icon: "✦",
  },

  Relieved: {
    key: "Relieved",
    color: "#CFEAE4", // soft aqua
    shape: "leaf",
    meaning: "Exhaling stress, finally feeling lighter.",
    icon: "❋",
  },

  Reflective: {
    key: "Reflective",
    color: "#DDD6F3", // dusty lavender
    shape: "circle",
    meaning: "Thinking deeply, processing emotions quietly.",
    icon: "◌",
  },

  Lonely: {
    key: "Lonely",
    color: "#CFCFEA", // muted periwinkle
    shape: "cloud",
    meaning: "Feeling emotionally distant or unseen.",
    icon: "☾",
  },

  Numb: {
    key: "Numb",
    color: "#C9D3DC", // soft gray-blue
    shape: "circle",
    meaning: "Emotionally disconnected, blank, or shut down.",
    icon: "○",
  },

  Upset: {
    key: "Upset",
    color: "#E8B7B1", // dusty blush rose
    shape: "cloud",
    meaning: "Emotionally affected, hurt, irritated, or bothered.",
    icon: "≈",
  },

  Tense: {
    key: "Tense",
    color: "#FBEFB0", // buttery yellow
    shape: "cloud",
    meaning: "Restless, mentally 'on,' unable to fully relax.",
    icon: "〰",
  },

  Overwhelmed: {
    key: "Overwhelmed",
    color: "#E7B6A9", // muted peach clay
    shape: "cloud",
    meaning: "Emotionally overloaded, mentally exhausted.",
    icon: "☁",
  },

  CrashOut: {
    key: "CrashOut",
    color: "#F0A25A", // warm burnt peach
    shape: "heart",
    meaning: "Emotionally done, spiraling, ready to shut down.",
    icon: "♥",
  },
};

export const moods = MOOD_PALETTE;

export const MOODS_ARRAY: MoodData[] = Object.values(MOOD_PALETTE);

export function getMoodColor(
  emotion?: string,
  savedColor?: string
): string {
  if (savedColor) return savedColor;
  if (!emotion) return "#94a3b8";

  const moodData = MOOD_PALETTE[emotion as MoodKey];

  return moodData?.color ?? "#94a3b8";
}