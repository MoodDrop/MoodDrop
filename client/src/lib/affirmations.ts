/**
 * Affirmations Helper
 * Provides supportive, encouraging messages after users share their feelings
 */

export interface Affirmation {
  message: string;
  keywords?: string[];
}

const AFFIRMATIONS: Affirmation[] = [
  // General supportive messages
  {
    message: "You did great by letting that out.",
  },
  {
    message: "You're safe here. Take a deep breath.",
  },
  {
    message: "It's okay to feel this way — growth starts with honesty.",
  },
  {
    message: "Thank you for trusting this space with your feelings.",
  },
  {
    message: "Every feeling deserves to be acknowledged. You're doing that beautifully.",
  },
  {
    message: "Releasing this is a form of self-care. Be proud of yourself.",
  },
  {
    message: "Your emotions are valid, and so are you.",
  },
  
  // Emotion-specific affirmations
  {
    message: "It's okay to feel tired. Rest is not a reward — it's a necessity.",
    keywords: ["tired", "exhausted", "drained", "worn", "fatigue", "sleep"],
  },
  {
    message: "Your anger is valid. It's telling you something important.",
    keywords: ["angry", "mad", "furious", "rage", "frustrated", "annoyed"],
  },
  {
    message: "Sadness is a sign of deep feeling. Let it move through you gently.",
    keywords: ["sad", "down", "depressed", "blue", "unhappy", "hurt", "pain"],
  },
  {
    message: "Anxiety is your body trying to protect you. You're learning to work with it.",
    keywords: ["anxious", "worried", "nervous", "scared", "afraid", "stress", "panic"],
  },
  {
    message: "Your joy matters. Let yourself feel the good, too.",
    keywords: ["happy", "joy", "excited", "good", "great", "amazing", "wonderful"],
  },
  {
    message: "Confusion means you're processing. Give yourself time to understand.",
    keywords: ["confused", "lost", "unsure", "uncertain", "don't know"],
  },
  {
    message: "Feeling hopeful is brave. Keep nurturing that light.",
    keywords: ["hope", "hopeful", "better", "future", "tomorrow", "improve"],
  },
  {
    message: "Loneliness is hard, but you're not as alone as you feel right now.",
    keywords: ["lonely", "alone", "isolated", "nobody", "empty"],
  },
  {
    message: "Overwhelm is a sign you care deeply. Take it one breath at a time.",
    keywords: ["overwhelmed", "too much", "can't", "impossible", "drowning"],
  },
];

/**
 * Get an affirmation based on the user's message content
 * @param content - The user's written message (optional)
 * @param emotion - The selected emotion emoji (optional)
 * @returns A supportive affirmation message
 */
export function getAffirmation(content?: string, emotion?: string): string {
  if (!content || content.trim().length === 0) {
    // Return a random general affirmation if no content
    const generalAffirmations = AFFIRMATIONS.filter(a => !a.keywords);
    return getRandomItem(generalAffirmations).message;
  }

  const lowerContent = content.toLowerCase();
  
  // Try to find keyword matches
  const matchingAffirmations = AFFIRMATIONS.filter(affirmation => {
    if (!affirmation.keywords) return false;
    return affirmation.keywords.some(keyword => lowerContent.includes(keyword));
  });

  // If we found matching affirmations, pick one randomly
  if (matchingAffirmations.length > 0) {
    return getRandomItem(matchingAffirmations).message;
  }

  // Fall back to random general affirmation
  const generalAffirmations = AFFIRMATIONS.filter(a => !a.keywords);
  return getRandomItem(generalAffirmations).message;
}

/**
 * Helper to get a random item from an array
 */
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
