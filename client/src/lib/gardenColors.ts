export type EmotionColor = {
  primary: string;
  secondary: string;
  shadow: string;
  name: string;
};

export const emotionColors: Record<string, EmotionColor> = {
  // Calm emotions -> Blue
  calm: {
    primary: '#60A5FA',
    secondary: '#93C5FD',
    shadow: '#3B82F6',
    name: 'Calm Blue',
  },
  peaceful: {
    primary: '#60A5FA',
    secondary: '#93C5FD',
    shadow: '#3B82F6',
    name: 'Calm Blue',
  },
  
  // Hopeful emotions -> Pink
  happy: {
    primary: '#F9A8D4',
    secondary: '#FBCFE8',
    shadow: '#EC4899',
    name: 'Hopeful Pink',
  },
  excited: {
    primary: '#F9A8D4',
    secondary: '#FBCFE8',
    shadow: '#EC4899',
    name: 'Hopeful Pink',
  },
  hopeful: {
    primary: '#F9A8D4',
    secondary: '#FBCFE8',
    shadow: '#EC4899',
    name: 'Hopeful Pink',
  },
  
  // Proud emotions -> Gold
  proud: {
    primary: '#FCD34D',
    secondary: '#FDE68A',
    shadow: '#F59E0B',
    name: 'Proud Gold',
  },
  accomplished: {
    primary: '#FCD34D',
    secondary: '#FDE68A',
    shadow: '#F59E0B',
    name: 'Proud Gold',
  },
  
  // Sad/Tired emotions -> Gray/White
  sad: {
    primary: '#D1D5DB',
    secondary: '#E5E7EB',
    shadow: '#9CA3AF',
    name: 'Gentle Gray',
  },
  tired: {
    primary: '#D1D5DB',
    secondary: '#E5E7EB',
    shadow: '#9CA3AF',
    name: 'Gentle Gray',
  },
  overwhelmed: {
    primary: '#D1D5DB',
    secondary: '#E5E7EB',
    shadow: '#9CA3AF',
    name: 'Gentle Gray',
  },
  
  // Anxious/Frustrated emotions -> Orange
  anxious: {
    primary: '#FB923C',
    secondary: '#FDBA74',
    shadow: '#F97316',
    name: 'Alert Orange',
  },
  angry: {
    primary: '#FB923C',
    secondary: '#FDBA74',
    shadow: '#F97316',
    name: 'Alert Orange',
  },
  frustrated: {
    primary: '#FB923C',
    secondary: '#FDBA74',
    shadow: '#F97316',
    name: 'Alert Orange',
  },
  
  // Default/Other
  other: {
    primary: '#C4B5FD',
    secondary: '#DDD6FE',
    shadow: '#A78BFA',
    name: 'Peaceful Purple',
  },
};

export function getEmotionColor(emotion: string): EmotionColor {
  const normalizedEmotion = emotion.toLowerCase();
  return emotionColors[normalizedEmotion] || emotionColors.other;
}
