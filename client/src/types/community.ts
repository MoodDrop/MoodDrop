export interface Drop {
  id: string;
  name: string;
  text: string;
  mood?: string;
  reactions: {
    calm: number;
    feel: number;
  };
  createdAt: number;
}

export type ReactionType = 'calm' | 'feel';
