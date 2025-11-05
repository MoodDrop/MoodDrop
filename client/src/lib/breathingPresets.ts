export type BreathingPhase = "inhale" | "hold" | "exhale" | "hold2";

export interface BreathPhase {
  type: BreathingPhase;
  label: string;
  duration: number; // in seconds
}

export interface BreathingPreset {
  id: string;
  name: string;
  description: string;
  phases: BreathPhase[];
}

export const breathingPresets: BreathingPreset[] = [
  {
    id: "box",
    name: "Box Breathing",
    description: "Inhale 4 • Hold 4 • Exhale 4 • Hold 4",
    phases: [
      { type: "inhale", label: "Inhale", duration: 4 },
      { type: "hold", label: "Hold", duration: 4 },
      { type: "exhale", label: "Exhale", duration: 4 },
      { type: "hold2", label: "Hold", duration: 4 },
    ],
  },
  {
    id: "4-7-8",
    name: "4-7-8 Breathing",
    description: "Inhale 4 • Hold 7 • Exhale 8",
    phases: [
      { type: "inhale", label: "Inhale", duration: 4 },
      { type: "hold", label: "Hold", duration: 7 },
      { type: "exhale", label: "Exhale", duration: 8 },
    ],
  },
  {
    id: "long-exhale",
    name: "Long Exhale",
    description: "Inhale 4 • Exhale 6",
    phases: [
      { type: "inhale", label: "Inhale", duration: 4 },
      { type: "exhale", label: "Exhale", duration: 6 },
    ],
  },
];
