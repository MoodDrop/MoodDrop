// Type for drops from Supabase
export type Drop = {
  id: string;
  vibeId: string;
  text: string;
  mood?: string;
  replyTo?: string;
  createdAt: number; // timestamp in ms
  replies?: Drop[]; // nested replies for UI
};

export type ReactionType = "calm" | "feel";

