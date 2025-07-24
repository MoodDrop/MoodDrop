interface EmotionTagsProps {
  selectedEmotion: string;
  onEmotionSelect: (emotion: string) => void;
}

const emotions = [
  { key: "angry", emoji: "😤", label: "Angry" },
  { key: "sad", emoji: "😢", label: "Sad" },
  { key: "anxious", emoji: "😰", label: "Anxious" },
  { key: "other", emoji: "🤔", label: "Other" },
];

export default function EmotionTags({ selectedEmotion, onEmotionSelect }: EmotionTagsProps) {
  return (
    <div className="mb-6">
      <label className="block text-warm-gray-700 font-medium mb-3">How are you feeling?</label>
      <div className="flex flex-wrap gap-2">
        {emotions.map((emotion) => (
          <button
            key={emotion.key}
            onClick={() => onEmotionSelect(emotion.key)}
            className={`px-4 py-2 rounded-full border-2 transition-all ${
              selectedEmotion === emotion.key
                ? "border-blush-400 bg-blush-100 text-blush-600"
                : "border-blush-200 text-warm-gray-600 hover:border-blush-300 hover:bg-blush-50"
            }`}
            data-testid={`emotion-${emotion.key}`}
          >
            {emotion.emoji} {emotion.label}
          </button>
        ))}
      </div>
    </div>
  );
}
