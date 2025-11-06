// Type for drops from Supabase
export type Drop = {
  id: string;
  vibeId: string;
  text: string;
  mood?: string;
  replyTo?: string;
  reactions: number; // "I feel this" count
  createdAt: number; // timestamp in ms
  replies?: Drop[]; // nested replies for UI
};

